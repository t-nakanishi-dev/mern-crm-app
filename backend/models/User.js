// backend/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true }, // Firebase UID
    email: { type: String, required: true },
    displayName: { type: String }, // 任意で表示名に使う
    role: { type: String, enum: ["admin", "user"], default: "user" }, // 必要なら
    isActive: { type: Boolean, default: true }, // 任意でユーザーの有効・無効制御に使用
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
