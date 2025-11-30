// src/routes/AppRoutes.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// =========================
// 公開ページ（認証不要）
// =========================
import Login from "../pages/Login";
import Register from "../pages/Register";
import FreeContactPage from "../pages/FreeContactPage";
import PasswordReset from "../components/PasswordReset";
import LandingPage from "../pages/Landing"; // ランディングページ追加

// =========================
// 一般ユーザー用ページ（ログイン必須）
// =========================
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../pages/ProfilePage";
import CustomerPage from "../pages/CustomerPage";
import CustomerDetailPage from "../pages/CustomerDetailPage";
import ContactsPage from "../pages/ContactsPage";
import ContactForm from "../components/ContactForm";
import SalesPage from "../pages/SalesPage";
import SalesDetailPage from "../pages/SalesDetailPage";
import TasksPage from "../pages/TasksPage";
import KanbanBoard from "../components/Kanban/KanbanBoard";

// =========================
// 管理者用ページ（adminOnly）
// =========================
import AdminUserPage from "../pages/AdminUserPage";
import AdminUserDetailPage from "../pages/AdminUserDetailPage";

// =========================
// 共通コンポーネント
// =========================
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================
          ランディングページ（未ログインなら表示、ログイン済みなら Dashboard に自動遷移）
      ========================= */}
      <Route path="/" element={<LandingPage />} />

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

      {/* =========================
          未定義のパスはホームへリダイレクト
      ========================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
