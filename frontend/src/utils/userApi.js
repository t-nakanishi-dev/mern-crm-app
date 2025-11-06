// src/utils/userApi.js

import api from "./api";

// ユーザー関連のエンドポイント専用のAxiosインスタンスを作成
const usersApi = api.create({
  baseURL: `${api.defaults.baseURL}/users`,
});

/**
 * すべてのユーザーを取得します。
 * @returns {Promise<Array>} ユーザーの配列
 */
export const getUsers = async () => {
  try {
    // このAPIはクエリパラメータが必要な場合があるため、
    // タスクリストの取得には getUsersBasic を使用することを推奨
    const response = await usersApi.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "ユーザーの取得に失敗しました:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * すべてのユーザーの基本情報を取得します。（認証ユーザー向け）
 * @returns {Promise<Array>} ユーザーの配列
 */
export const getUsersBasic = async () => {
  try {
    const response = await usersApi.get("/basic");
    return response.data.users;
  } catch (error) {
    console.error(
      "ユーザーリストの取得に失敗しました:",
      error.response?.data || error.message
    );
    throw error;
  }
};
