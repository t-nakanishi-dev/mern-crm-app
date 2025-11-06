// // src/components/NotificationList.jsx
import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
} from "../utils/notification";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext"; // ✅ 追加

/**
 * 通知のドロップダウンリストを表示するコンポーネント
 */
const NotificationList = () => {
  const { user } = useAuth();
  const { refreshNotifications } = useNotifications(); // ✅ 追加
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError("通知の取得に失敗しました。");
      console.error("❌ 通知の取得に失敗しました:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, refreshNotifications]); // ✅ 依存関係にrefreshNotificationsを追加

  const handleNotificationClick = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      // 既読処理が成功したら、通知リストを再取得してUIを更新
      await fetchNotifications();
      // コンテキストを使って親コンポーネントの通知件数を更新
      refreshNotifications();
    } catch (err) {
      console.error("❌ 通知を既読にする処理に失敗しました:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">通知を読み込み中...</div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="notification-list max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <p className="p-4 text-center text-gray-500">
          未読の通知はありません。
        </p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className={`notification-item p-3 mb-2 rounded border cursor-pointer ${
              n.isRead ? "bg-gray-100 font-normal" : "bg-blue-200 font-bold"
            } hover:bg-blue-300 transition`}
            onClick={() => handleNotificationClick(n._id)}
          >
            <p className="text-sm">{n.message}</p>
            <span className="text-xs text-gray-500 block mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationList;
