// backend/routes/users.js

const express = require("express");
const router = express.Router();
const {
  verifyFirebaseToken,
  isAdmin,
} = require("../middleware/authMiddleware");
const {
  registerUser,
  getMe,
  updateUser,
  deleteUser,
  getUsers,
  getAllUsers,
  updateUserRole,
  getUsersBasic,
  toggleUserDisabledStatus,
  getUserById, // ✅ 追加: 新しいコントローラー関数をインポート
} = require("../controllers/userController");

// 🔹 初回登録（MongoDBにユーザー登録）
// ✅ 修正: 他のルートより前に配置し、verifyFirebaseTokenをスキップさせる
router.post("/register", registerUser);

// ----------------------------------------------------
// ✅ 以下のすべてのルートは、Firebase認証が必要
router.use(verifyFirebaseToken);
// ----------------------------------------------------

// ✅ 新しいルート：管理者専用で、すべてのユーザーを取得
router.get("/all", isAdmin, getAllUsers);

// 🔸 現在のユーザー情報取得
router.get("/me", getMe);

// 🔸 現在のユーザー情報更新
router.put("/me", updateUser);

// 🔸 現在のユーザー削除
router.delete("/me", deleteUser);

// ✅ 元のルート：IDクエリでユーザーを取得
router.get("/", getUsers);

// すべての認証ユーザーが利用可能なユーザー一覧取得（閲覧に必要な情報のみ返す）
router.get("/basic", getUsersBasic);

// ✅ 新しいルート：管理者専用で、ユーザーの役割を更新
router.put("/:id/role", isAdmin, updateUserRole);

// ✅ 新規: 管理者専用で、ユーザーの有効化/無効化を切り替えるエンドポイント
router.put("/:id/disabled", isAdmin, toggleUserDisabledStatus);

// ✅ 新規: 管理者専用で、特定のユーザー情報を取得するエンドポイント
router.get("/:id", isAdmin, getUserById);

module.exports = router;
