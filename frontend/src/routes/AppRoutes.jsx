// src/routes/AppRoutes.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// 公開ページ
import Login from "../pages/Login";
import Register from "../pages/Register";
import FreeContactPage from "../pages/FreeContactPage";
import PasswordReset from "../components/PasswordReset";

// 一般ユーザー用ページ
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

// 管理者用ページ
import AdminUserPage from "../pages/AdminUserPage";
import AdminUserDetailPage from "../pages/AdminUserDetailPage";

// コンポーネント
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 公開ページ */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact-form" element={<FreeContactPage />} />
      <Route path="/password-reset" element={<PasswordReset />} />

      {/* ログイン必須ページ */}
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

      {/* 管理者専用ページ */}
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
