// backend/server.js (詳細コメント付き)

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const admin = require("firebase-admin");

// ====================
// ルーターのインポート
// ====================
const customersRouter = require("./routes/customers");
const usersRouter = require("./routes/users");
const salesRoutes = require("./routes/salesRoutes");
const contactRoutes = require("./routes/contactRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notifications");
const activitiesRoutes = require("./routes/activitiesRoutes");

// ====================
// 環境変数の読み込み
// ====================
dotenv.config();

// ====================
// Firebase Admin SDK 初期化
// ====================
// 環境変数からサービスアカウントキーを読み込む（base64形式）
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
if (!serviceAccountBase64) {
  console.error(
    "環境変数 FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 が設定されていません。"
  );
  process.exit(1); // 必須環境変数がなければサーバー起動を中止
}

// base64文字列をJSONオブジェクトに変換
const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
);

// Firebase Admin SDKの多重初期化を防止
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin SDK initialized");
}

// ====================
// Expressアプリ初期化
// ====================
const app = express();
const PORT = process.env.PORT || 5000;

// ====================
// ミドルウェア
// ====================
app.use(cors()); // CORS設定
app.use(express.json({ strict: false })); // JSONボディのパース

// ====================
// ルート定義
// ====================
app.use("/api/customers", customersRouter); // 顧客関連
app.use("/api/users", usersRouter); // ユーザー関連
app.use("/api/sales", salesRoutes); // 案件関連
app.use("/api/contacts", contactRoutes); // 問い合わせ関連
app.use("/api/tasks", taskRoutes); // タスク関連
app.use("/api/notifications", notificationRoutes); // 通知関連
app.use("/api/activities", activitiesRoutes); // アクティビティ関連

// ルート確認用のシンプルなエンドポイント
app.get("/", (req, res) => {
  res.send("🎉 Backend API is running (MongoDB Notifications Only)");
});

// ====================
// MongoDB接続関数
// ====================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // MongoDB接続
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // 接続失敗時はサーバーを停止
  }
};

// ====================
// サーバー起動
// ====================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  connectDB(); // 起動時にMongoDB接続を実行
});
