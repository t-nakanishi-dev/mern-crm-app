// src/pages/Landing.jsx

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config"; // Firebase auth

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // ユーザーがログイン済みならダッシュボードへリダイレクト
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        ようこそ、MERN CRM アプリへ
      </h1>
      <p className="text-center mb-8 max-w-md">
        このアプリでは顧客管理・営業案件・タスク管理をシンプルに行えます。
        まずはアカウントを作成するか、ログインしてください。
      </p>

      <div className="flex gap-4">
        <Link
          to="/register"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          新規登録
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded hover:bg-gray-300"
        >
          ログイン
        </Link>
      </div>

      <p className="mt-12 text-sm text-gray-500">
        お問い合わせは{" "}
        <Link to="/contact-form" className="underline text-blue-600">
          こちら
        </Link>
      </p>
    </div>
  );
}
