// backend/routes/customers.js

const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/authMiddleware");

const {
  getCustomers,
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
  // 💡 追加: ステータス別顧客取得とステータス更新のコントローラー
  getCustomersByStatus,
  updateCustomerStatus,
} = require("../controllers/customerController");

const {
  getTasksByCustomer, // 💡 追加: 顧客別タスク取得のコントローラー
} = require("../controllers/taskController");

// 🔐 認証ミドルウェアをすべてのルートに適用
router.use(verifyFirebaseToken);

// 📄 管理者向け: 全顧客を取得できるエンドポイント
router.get("/all", getAllCustomers);

// 📄 全顧客情報取得（ログインユーザーの顧客のみ）
router.get("/", getCustomers);

// 💡 追加: ステータス別に顧客を取得
// 例: /api/customers/status/提案中
router.get("/status/:status", getCustomersByStatus);

// 💡 追加: 顧客のステータスを更新
// 例: PUT /api/customers/:id/status
router.put("/:id/status", updateCustomerStatus);

// 💡 追加: 特定の顧客に紐づくタスクを取得
// 例: /api/customers/:id/tasks
router.get("/:id/tasks", getTasksByCustomer);

// 🔹 顧客新規登録
router.post("/", createCustomer);

// 🔸 顧客IDで取得
router.get("/:id", getCustomerById);

// ✏️ 顧客情報を更新
router.put("/:id", updateCustomer);

// 🗑️ 顧客を削除
router.delete("/:id", deleteCustomer);

module.exports = router;
