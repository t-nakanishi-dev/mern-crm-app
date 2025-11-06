// backend/updateAdmin.js

const admin = require("firebase-admin");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // ✅ Mongooseをインポート
const User = require("./models/User"); // ✅ Userモデルをインポート

// .envファイルを読み込む
dotenv.config();

// ✅ MongoDBに接続
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 環境変数からBase64キーを読み込み、デコードする
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

// Firebase Admin SDKの初期化
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin SDK initialized");
}

// ユーザーのUIDをここに貼り付け
const targetUid = "WzwMXMJFA0NuMsPjKOmkzzPgeFx2";

async function setAdminClaimAndRole() {
  // ✅ 関数名を変更
  try {
    // Firebaseのカスタムクレームを更新
    await admin.auth().setCustomUserClaims(targetUid, { role: "admin" });
    console.log(
      `✅ ユーザー ${targetUid} のカスタムクレームを 'admin' に設定しました。`
    );

    // ✅ MongoDBのユーザー役割を更新
    const user = await User.findOne({ uid: targetUid });
    if (user) {
      user.role = "admin";
      await user.save();
      console.log(
        `✅ ユーザー ${targetUid} のMongoDBの役割を 'admin' に更新しました。`
      );
    } else {
      console.error("❌ MongoDBにユーザーが見つかりませんでした。");
    }
  } catch (error) {
    console.error("❌ 役割の更新に失敗しました:", error);
  } finally {
    mongoose.connection.close(); // ✅ 処理完了後に接続を閉じる
  }
}

setAdminClaimAndRole(); // ✅ 更新された関数を呼び出す
