// backend/routes/salesRoutes.js

const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/authMiddleware");
const {
  createSales,
  updateSales,
  deleteSales,
  getSalesById,
  getAllSalesByUser,
  getSalesByCustomer,
  getSalesSummary, // ✅ 追加: ダッシュボード用サマリーを取得するコントローラーをインポート
} = require("../controllers/salesController");

// 🔐 認証ミドルウェアをすべてのルートに適用
router.use(verifyFirebaseToken);

// --- ルート定義 ---

// ✅ 追加: 案件サマリーを取得するルートを一番上に配置
router.get("/summary", getSalesSummary);

// ✅ 非常に重要: 特定の顧客に紐づく案件を取得するルートを追加
router.get("/customer/:customerId", getSalesByCustomer);

// 📄 ユーザーに紐づく案件を全て取得
router.get("/", getAllSalesByUser);

// 🔹 新しい案件を新規登録
router.post("/", createSales);

// 📄 特定の案件をIDで取得 (最も一般的なルートのため、最後に配置)
router.get("/:id", getSalesById);

// ✏️ 案件情報を更新
router.put("/:id", updateSales);

// 🗑️ 案件を削除
router.delete("/:id", deleteSales);

module.exports = router;
