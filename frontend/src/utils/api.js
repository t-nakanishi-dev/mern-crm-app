// src/utils/api.js

import axios from "axios";
import { getAuth } from "firebase/auth";

// 環境変数からAPIのベースURLを取得
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 認証ヘッダーを自動で付加するAxiosインスタンス。
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * リクエストインターセプター:
 * 各APIリクエストの前にFirebaseのIDトークンを取得し、Authorizationヘッダーに設定します。
 */
api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        // ユーザーがログインしている場合、IDトークンを取得
        const token = await user.getIdToken();
        // Bearerトークンとしてヘッダーに設定
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Firebase IDトークンの取得に失敗しました:", error);
        // エラーが発生した場合はリクエストを中止
        return Promise.reject(error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
