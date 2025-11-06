// components/Navbar.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext"; // ✅ 追加
import NotificationList from "./NotificationList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { unreadCount, refreshNotifications } = useNotifications(); // ✅ Contextから取得
  const navigate = useNavigate();
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const dropdownRef = useRef(null);

  /**
   * ドロップダウンの外をクリックしたら閉じる
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  /**
   * ドロップダウンを開閉
   */
  const handleBellClick = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    // ドロップダウンを開くたびに通知をリフレッシュ
    if (!isNotificationDropdownOpen) {
      refreshNotifications();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("ログアウト失敗:", error);
    }
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold mr-6">
          CRM App
        </Link>
        {user && (
          <>
            <Link to="/sales" className="mr-4 hover:text-gray-300">
              案件
            </Link>
            <Link to="/customers" className="mr-4 hover:text-gray-300">
              顧客
            </Link>
            <Link to="/tasks" className="mr-4 hover:text-gray-300">
              タスク
            </Link>
            <Link to="/contacts" className="mr-4 hover:text-gray-300">
              問い合わせ
            </Link>
            <Link to="/kanban" className="mr-4 hover:text-gray-300">
              Kanban
            </Link>
            <Link to="/profile" className="mr-4 hover:text-gray-300">
              プロフィール
            </Link>
            {isAdmin && (
              <Link to="/admin/users" className="hover:text-gray-300">
                ユーザー管理
              </Link>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleBellClick}
              className="relative p-2 rounded-full hover:bg-gray-700 transition"
            >
              <FontAwesomeIcon icon={faBell} size="lg" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {unreadCount}
                </span>
              )}
            </button>
            {isNotificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                {/* Navbarからプロップスを渡す必要がなくなる */}
                <NotificationList />
              </div>
            )}
          </div>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            ログアウト
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            ログイン
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
