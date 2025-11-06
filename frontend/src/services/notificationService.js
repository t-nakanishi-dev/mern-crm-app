// src/services/notificationService.js
import { authorizedRequest } from "./authService";

// 通知一覧取得
export async function fetchNotifications() {
  const response = await authorizedRequest("get", "/notifications");
  return response.notifications || [];
}

// 通知追加
export async function addNotification(message, recipientUid, taskId = null) {
  await authorizedRequest("post", "/notifications", {
    recipientUid,
    message,
    taskId,
  });
}

// 通知を既読にする
export async function markNotificationAsRead(id) {
  await authorizedRequest("patch", `/notifications/${id}/read`);
}
