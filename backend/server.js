// backend/server.js (修正版)

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const admin = require("firebase-admin");

// ルーター
const customersRouter = require("./routes/customers");
const usersRouter = require("./routes/users");
const salesRoutes = require("./routes/salesRoutes");
const contactRoutes = require("./routes/contactRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notifications");
const activitiesRoutes = require("./routes/activitiesRoutes");

dotenv.config();

// Firebaseサービスアカウントキー読み込み
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
if (!serviceAccountBase64) {
  console.error(
    "環境変数 FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 が設定されていません。"
  );
  process.exit(1);
}
const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin SDK initialized");
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ strict: false }));

// ルート定義
app.use("/api/customers", customersRouter);
app.use("/api/users", usersRouter);
app.use("/api/sales", salesRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activities", activitiesRoutes);

app.get("/", (req, res) => {
  res.send("🎉 Backend API is running (MongoDB Notifications Only)");
});

// MongoDB接続
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  connectDB();
});
