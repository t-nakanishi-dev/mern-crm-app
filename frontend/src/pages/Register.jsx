// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { registerUserInBackend } from "../context/AuthContext";

function Register() {
  // フォーム入力の状態管理
  const [displayName, setDisplayName] = useState(""); // 表示名
  const [email, setEmail] = useState(""); // メールアドレス
  const [password, setPassword] = useState(""); // パスワード
  const [error, setError] = useState(""); // エラーメッセージ
  const navigate = useNavigate(); // 画面遷移用

  // 登録処理
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // 前回エラーをリセット

    // 入力チェック
    if (!displayName || !email || !password) {
      setError("すべてのフィールドを入力してください。");
      return;
    }

    try {
      console.log("🟡 登録処理開始");

      // Firebase Authentication にユーザー登録
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("✅ Firebase登録成功:", userCredential);

      // Firebase ユーザーの表示名を更新
      await updateProfile(user, { displayName: displayName });
      console.log("✅ 表示名を Firebase ユーザーに設定");

      // バックエンドに登録するためのユーザー情報
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };

      // IDトークンを取得（バックエンド認証用）
      const idToken = await user.getIdToken();
      console.log("✅ IDトークン取得成功:", idToken);

      // バックエンドにユーザー登録
      await registerUserInBackend(idToken, userData);

      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Firebase 登録エラー:", error);
      setError(error.message); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">ユーザー登録</h2>
        {/* エラーメッセージ */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* 登録フォーム */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* 表示名入力 */}
          <div>
            <label className="block mb-1 text-sm font-medium">表示名</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* メールアドレス入力 */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* パスワード入力 */}
          <div>
            <label className="block mb-1 text-sm font-medium">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* 登録ボタン */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            登録
          </button>
        </form>

        {/* ログインリンク */}
        <div className="text-center">
          <p className="text-sm">
            アカウントをお持ちですか？{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
