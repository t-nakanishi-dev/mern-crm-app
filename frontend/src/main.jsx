// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext"; // ✅ 追加
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
        {" "}
        {/* ✅ 追加 */}
        <App />
      </NotificationProvider>{" "}
      {/* ✅ 追加 */}
    </AuthProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
