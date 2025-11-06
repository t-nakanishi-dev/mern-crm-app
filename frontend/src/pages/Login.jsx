// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";

// 簡易ログ関数
const addLog = (msg) => {
  console.log(`[Login] ${msg}`);
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      addLog("ログイン処理開始");

      // Firebaseでログイン
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      addLog(`ログイン成功: UID=${user.uid}`);

      // トークン取得
      const token = await user.getIdToken();
      addLog(`IDトークンを取得しました: ${token.substring(0, 20)}...`);

      // localStorage に保存
      localStorage.setItem("token", token);
      addLog("IDトークンをlocalStorageに保存しました");

      // ダッシュボードへ
      navigate("/dashboard");
      addLog("ダッシュボードへ遷移しました");
    } catch (err) {
      console.error("ログインエラー詳細:", err);
      setError("ログインに失敗しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">ログイン</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          type="email"
          placeholder="メールアドレス"
          className="w-full p-2 mb-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          ログイン
        </button>
        <p className="mt-4 text-center">
          <Link
            to="/password-reset"
            className="text-sm text-blue-600 underline"
          >
            パスワードをお忘れですか？
          </Link>
        </p>
        <p className="mt-4">
          アカウントをお持ちでない方は{" "}
          <Link to="/register" className="text-blue-600 underline">
            新規登録
          </Link>
        </p>
      </form>
    </div>
  );
}
