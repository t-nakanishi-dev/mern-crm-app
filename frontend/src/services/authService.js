// src/services/authService.js

import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import { getApp } from "firebase/app";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Firebaseアプリを初期化
// NOTE: main.jsxなどでFirebaseを初期化していることが前提
const firebaseApp = getApp();
const auth = getAuth(firebaseApp);

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Axiosリクエスト前インターセプター
 * すべての認証済みリクエストにトークンを自動で付与する
 */
authApi.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  // ユーザーがログインしていない、またはトークン不要なリクエストの場合はスキップ
  if (!user || config.skipAuth) {
    console.warn(
      "⚠️ interceptor: ユーザーがログインしていないか、認証が不要なリクエストです。"
    );
    return config;
  }

  try {
    // Firebase SDKが自動でトークンの有効期限をチェック・更新してくれる
    const idToken = await user.getIdToken();
    config.headers.Authorization = `Bearer ${idToken}`;
    console.log(
      "✅ interceptor: Firebaseから取得したトークンをセットしました。"
    );
  } catch (error) {
    console.error("❌ interceptor: トークン取得に失敗しました", error);
    // トークン取得失敗時はリクエストを中止
    return Promise.reject(new Error("Firebaseトークンの取得に失敗しました。"));
  }

  return config;
});

/**
 * 共通のAPI呼び出し関数
 * この関数は認証ロジックを含まず、インターセプターに任せる
 */
export const authorizedRequest = async (method, url, data = null) => {
  try {
    const res = await authApi({
      method,
      url,
      data: method.toLowerCase() === "get" ? null : data,
    });
    return res.data;
  } catch (error) {
    // 401 Unauthorizedの場合、ログアウト処理を呼び出す
    if (error.response?.status === 401) {
      console.error(
        "401 Unauthorized - トークンが無効です。ログアウトします。"
      );
      await logout();
    }
    throw error;
  }
};

/**
 * ログアウト処理
 */
export const logout = async () => {
  await signOut(auth);
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};
