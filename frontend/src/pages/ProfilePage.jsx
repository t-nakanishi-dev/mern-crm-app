// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAuth,
  signOut,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { authorizedRequest } from "../services/authService";

const ProfilePage = () => {
  const { user: firebaseUser, token, setToken, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        navigate("/login");
        return;
      }
      try {
        const res = await authorizedRequest("GET", "/users/me", token);
        setProfile(res.user);
        setDisplayName(res.user.displayName || "");
      } catch (err) {
        console.error("ユーザー取得エラー", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const reauthenticate = async (password) => {
    if (!firebaseUser) throw new Error("ユーザーが見つかりません");
    const credential = EmailAuthProvider.credential(
      firebaseUser.email,
      password
    );
    await reauthenticateWithCredential(firebaseUser, credential);
  };

  const handleUpdate = async () => {
    setUpdateError("");
    setUpdateSuccess("");
    setIsUpdating(true);

    try {
      if (!firebaseUser) {
        throw new Error("ユーザー情報がありません");
      }

      if (displayName === profile.displayName || !displayName.trim()) {
        setUpdateError("変更がありません。または、表示名が空です。");
        setIsUpdating(false);
        return;
      }

      await updateProfile(firebaseUser, { displayName });
      const res = await authorizedRequest("PUT", "/users/me", { displayName });

      setProfile(res.user);
      setUpdateSuccess("プロフィールを更新しました");
    } catch (err) {
      console.error("更新エラー", err);
      setUpdateError(
        "更新に失敗しました: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword("");
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    setDeleteError("");
    setIsDeleting(true);

    try {
      if (!firebaseUser || !token) {
        throw new Error("ユーザーまたはトークンがありません");
      }

      if (!deletePassword) {
        setDeleteError("パスワードを入力してください。");
        setIsDeleting(false);
        return;
      }

      await reauthenticate(deletePassword);
      await authorizedRequest("DELETE", "/users/me");
      await firebaseUser.delete();

      localStorage.removeItem("token");
      if (setToken) {
        setToken(null);
      }

      alert("アカウントを削除しました");
      navigate("/login");
    } catch (err) {
      console.error("削除エラー", err);
      if (err.code === "auth/wrong-password") {
        setDeleteError("パスワードが間違っています。");
      } else if (err.code === "auth/requires-recent-login") {
        setDeleteError(
          "セキュリティ保護のため、最近ログインしたアカウントでのみ削除が可能です。一度ログアウトし、再度ログインしてからお試しください。"
        );
        await signOut(auth);
        navigate("/login");
      } else {
        setDeleteError("削除に失敗しました: " + err.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">ユーザー情報が見つかりません</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          プロフィール
        </h2>

        <div className="mb-4">
          <p className="text-gray-600">
            <strong>メールアドレス:</strong> {profile.email}
          </p>
          <p className="text-gray-600">
            <strong>表示名:</strong> {profile.displayName || "名前未設定"}
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="displayName"
            className="block text-gray-700 font-semibold mb-2"
          >
            表示名:
          </label>
          <input
            id="displayName"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4"
          disabled={isUpdating}
        >
          {isUpdating ? "更新中..." : "更新"}
        </button>
        {updateSuccess && (
          <p className="text-green-600 text-center mb-4">{updateSuccess}</p>
        )}
        {updateError && (
          <p className="text-red-600 text-center mb-4">{updateError}</p>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleOpenDeleteModal}
            className="w-full bg-transparent text-red-600 font-bold py-3 rounded-lg border border-red-600 hover:bg-red-100 transition-colors"
          >
            アカウント削除
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold text-center mb-4">
              アカウントを削除しますか？
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              この操作は元に戻せません。続行するには、パスワードを再入力してください。
            </p>
            <input
              type="password"
              placeholder="パスワード"
              className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              disabled={isDeleting}
            />
            {deleteError && (
              <p className="text-red-500 text-sm mb-4 text-center">
                {deleteError}
              </p>
            )}
            <div className="flex justify-between space-x-4">
              <button
                onClick={handleCloseDeleteModal}
                className="w-1/2 py-2 px-4 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                disabled={isDeleting}
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? "削除中..." : "削除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
