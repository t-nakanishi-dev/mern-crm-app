// src/utils/notification.js

import { authorizedRequest } from "../services/authService";

/**
 * @desc ユーザーの通知一覧を取得
 * @returns {Promise<Array>} 通知の配列
 */
export const getNotifications = async () => {
  try {
    const response = await authorizedRequest("get", "/notifications");
    console.log("✅ 通知リスト取得成功:", response);
    return response;
  } catch (error) {
    console.error("❌ 通知の取得に失敗しました:", error.message);
    throw error;
  }
};

/**
 * @desc 特定の通知を既読としてマーク
 * @param {string} id - 通知のID
 * @returns {Promise<Object>} 成功メッセージ
 */
export const markNotificationAsRead = async (id) => {
  try {
    const response = await authorizedRequest(
      "patch",
      `/notifications/${id}/read`
    );
    console.log(`✅ 通知ID ${id} を既読にしました`);
    return response;
  } catch (error) {
    console.error(`❌ 通知ID ${id} の既読処理に失敗しました:`, error.message);
    throw error;
  }
};
