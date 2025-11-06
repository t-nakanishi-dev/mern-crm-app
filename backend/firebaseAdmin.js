// backend/firebaseAdmin.js

const admin = require("firebase-admin");
require("dotenv").config();

// base64文字列をJSONに変換
const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64,
    "base64"
  ).toString("utf-8")
);

// Firebase Admin 初期化（多重初期化防止）
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
