// backend/middleware/authMiddleware.js

const admin = require("../firebaseAdmin");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const verifyFirebaseToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "未認証：トークンがありません" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // ✅ デバッグ用：Firebaseのデコード済みトークンの中身を確認
    console.log("Firebase decodedToken:", decodedToken);

    const user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      return res
        .status(404)
        .json({ message: "未登録ユーザー：MongoDBにユーザー情報がありません" });
    }

    // ✅ デバッグ用：MongoDBから取得したユーザーの役割を確認
    console.log("MongoDB user role:", user.role);

    req.user = {
      ...decodedToken,
      _id: user._id,
      role: user.role,
    };
    next();
  } catch (err) {
    console.error("Firebase トークン検証エラー:", err.message);
    return res.status(401).json({ message: "未認証：トークンが無効です" });
  }
});

const isAdmin = (req, res, next) => {
  // ✅ デバッグ用：isAdminミドルウェアがチェックしている役割を確認
  console.log(
    "isAdmin check on req.user.role:",
    req.user ? req.user.role : "ユーザー情報なし"
  );

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "管理者権限が必要です。" });
  }
};

module.exports = {
  verifyFirebaseToken,
  isAdmin,
};
