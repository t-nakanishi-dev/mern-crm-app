// src/context/AuthContext.jsx
import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";
import { logout as apiLogout } from "../services/authService";
import api from "../utils/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await currentUser.getIdToken(true);
          console.log("✅ トークン強制リフレッシュ完了（Custom Claims反映用）");

          // ★強化ポイント2★ 更新されたトークンから最新のclaimsを取得
          const idTokenResult = await currentUser.getIdTokenResult(true);
          const claims = idTokenResult.claims;
          const freshIdToken = idTokenResult.token;

          // デバッグ用：全 claims を出力（本当に role が入っているか確認）
          console.log(
            "🔥 最新の全 Custom Claims:",
            JSON.stringify(claims, null, 2)
          );

          // isAdmin の判定（複数の形式に対応）
          const adminClaim =
            claims?.role === "admin" ||
            claims?.admin === true ||
            claims?.admin === "true" ||
            claims?.admin === 1;

          setUser(currentUser);
          setToken(freshIdToken);
          setIsAdmin(!!adminClaim); // booleanに変換

        } catch (error) {
          console.error(
            "❌ AuthContext: IDトークン/claims の取得に失敗しました",
            error
          );
          setUser(null);
          setToken(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setToken(null);
        setIsAdmin(false);
      }

      setLoading(false);
      setIsAuthReady(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  const handlePasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("✅ パスワードリセットメールを送信しました");
      return { success: true };
    } catch (error) {
      console.error("❌ パスワードリセットエラー:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    isAdmin,
    loading,
    isAuthReady,
    logout: handleLogout,
    passwordReset: handlePasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// registerUserInBackend（変更なし）
const registerUserInBackend = async (idToken, userData) => {
  try {
    console.log("🚀 バックエンドへの登録開始:", userData);
    const res = await api.post("/users/register", userData, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    console.log("✅ バックエンドへの登録成功:", res.data);

    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      await firebaseUser.getIdToken(true);
      console.log("✅ IDトークンの強制更新成功");
    }
  } catch (error) {
    console.error("❌ バックエンド登録エラー:", error.response || error);
    if (error.response?.status === 404) {
      console.error(
        "⚠️ エラー: 404 Not Found - バックエンドのルート設定を確認してください。"
      );
    } else {
      console.error("⚠️ エラー詳細:", error.response?.data?.message);
    }
    throw error;
  }
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, registerUserInBackend };
