// src/components/PasswordReset.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const PasswordReset = () => {
  const { passwordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [emailError, setEmailError] = useState("");

  // メールアドレスの形式をチェックする正規表現
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // ✅ 入力ごとにバリデーションを実行
    if (newEmail === "") {
      setEmailError("");
    } else if (!emailRegex.test(newEmail)) {
      setEmailError("無効なメールアドレス形式です。");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setEmailError("");

    // ✅ 送信前に最終的なバリデーション
    if (!emailRegex.test(email)) {
      setEmailError("有効なメールアドレスを入力してください。");
      return;
    }

    try {
      const result = await passwordReset(email);
      if (result.success) {
        setMessage(
          "✅ パスワードリセットメールを送信しました。メールをご確認ください。"
        );
      } else {
        setIsError(true);
        // Firebaseからのエラーメッセージを日本語に変換して表示
        if (result.error.includes("auth/user-not-found")) {
          setMessage("❌ このメールアドレスのユーザーは存在しません。");
        } else {
          setMessage(`❌ パスワードリセットに失敗しました: ${result.error}`);
        }
      }
    } catch (err) {
      setIsError(true);
      setMessage("❌ パスワードリセット中に予期せぬエラーが発生しました。");
    }
  };

  // ✅ 有効なメールアドレスが入力されるまでボタンを無効にする
  const isButtonDisabled = !emailRegex.test(email);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          パスワードをリセットする
        </h2>
        <p className="text-center text-gray-600 mb-6">
          登録済みのメールアドレスを入力してください。
          <br />
          パスワードリセット用のメールを送信します。
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              required
              aria-label="メールアドレス"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-2">{emailError}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full font-bold py-3 px-4 rounded-lg transition duration-200 ${
              isButtonDisabled
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            disabled={isButtonDisabled}
          >
            パスワードをリセットする
          </button>
        </form>
        {message && (
          <div
            className={`mt-4 p-4 rounded-lg text-center ${
              isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
        <div className="mt-6 text-center">
          <a href="/login" className="text-indigo-600 hover:underline">
            ログインページに戻る
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
