// src/routes/AppRoutes.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// =========================
// 公開ページ（認証不要）
// =========================
import Login from "../pages/Login"; // ログインページ
import Register from "../pages/Register"; // ユーザー登録ページ
import FreeContactPage from "../pages/FreeContactPage"; // お問い合わせフォーム（未ログインでもアクセス可能）
import PasswordReset from "../components/PasswordReset"; // パスワードリセットフォーム

// =========================
// 一般ユーザー用ページ（ログイン必須）
// =========================
import Dashboard from "../pages/Dashboard"; // ダッシュボード
import ProfilePage from "../pages/ProfilePage"; // プロフィール編集ページ
import CustomerPage from "../pages/CustomerPage"; // 顧客一覧ページ
import CustomerDetailPage from "../pages/CustomerDetailPage"; // 顧客詳細ページ
import ContactsPage from "../pages/ContactsPage"; // 連絡先一覧ページ
import ContactForm from "../components/ContactForm"; // 連絡先作成フォーム
import SalesPage from "../pages/SalesPage"; // 営業案件一覧ページ
import SalesDetailPage from "../pages/SalesDetailPage"; // 営業案件詳細ページ
import TasksPage from "../pages/TasksPage"; // タスク一覧ページ
import KanbanBoard from "../components/Kanban/KanbanBoard"; // カンバンボード表示コンポーネント

// =========================
// 管理者用ページ（adminOnly）
// =========================
import AdminUserPage from "../pages/AdminUserPage"; // ユーザー管理ページ
import AdminUserDetailPage from "../pages/AdminUserDetailPage"; // ユーザー詳細ページ

// =========================
// 共通コンポーネント
// =========================
import ProtectedRoute from "../components/ProtectedRoute"; // ログイン必須/管理者専用ページ制御用ラッパー

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================
          公開ページ（ログイン不要）
      ========================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact-form" element={<FreeContactPage />} />
      <Route path="/password-reset" element={<PasswordReset />} />

      {/* =========================
          ログイン必須ページ
      ========================= */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/:customerId"
        element={
          <ProtectedRoute>
            <CustomerDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/:customerId/contacts"
        element={
          <ProtectedRoute>
            <ContactsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <ContactsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts/new"
        element={
          <ProtectedRoute>
            <ContactForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <SalesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales/:saleId"
        element={
          <ProtectedRoute>
            <SalesDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kanban"
        element={
          <ProtectedRoute>
            <KanbanBoard />
          </ProtectedRoute>
        }
      />

      {/* =========================
          管理者専用ページ（adminOnly=true）
      ========================= */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminUserPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:userId"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminUserDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
