// src/context/NotificationContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import { getNotifications } from "../utils/notification";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  /**
   * 未読通知の件数を取得し、状態を更新する
   */
  const fetchUnreadCount = async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const notifications = await getNotifications();
      setUnreadCount(notifications.length);
    } catch (err) {
      console.error("❌ 未読通知数の取得に失敗しました:", err.message);
      setUnreadCount(0);
    }
  };

  /**
   * リアルタイム更新のトリガーとして使用する関数
   */
  const refreshNotifications = () => {
    fetchUnreadCount();
  };

  // ユーザーの変更時に未読件数を取得
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
