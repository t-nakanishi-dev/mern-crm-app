// backend/routes/contactRoutes.js

const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/authMiddleware");
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

// ============================
// 公開フォーム用（認証不要）
// ============================
// 誰でも問い合わせを登録できる
router.post("/public", createContact);

// ============================
// 社員用（認証必須）
// ============================
router.use(verifyFirebaseToken);

// 📄 問い合わせ一覧取得（認証必須）
router.get("/", getContacts);

// ✏️ 問い合わせを新規登録（認証必須 → 自分が担当者になる）
router.post("/", createContact);

// ✏️ 問い合わせ情報を更新（認証必須）
router.put("/:id", updateContact);

// 🗑️ 問い合わせを削除（認証必須）
router.delete("/:id", deleteContact);

module.exports = router;
