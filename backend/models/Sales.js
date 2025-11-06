// backend/models/Sales.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesSchema = new Schema(
  {
    dealName: {
      // 案件名
      type: String,
      required: true,
    },
    customerId: {
      // ✅ 顧客との紐づけ
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amount: {
      // 案件金額
      type: Number,
      required: true,
    },
    status: {
      // 案件のステータス
      type: String,
      enum: ["見込み", "提案中", "交渉中", "契約済", "失注"],
      default: "見込み",
    },
    assignedUserId: {
      // ✅ 担当者との紐づけ
      type: String, // Firebase UIDを保存
      required: true,
    },
    notes: {
      // メモ
      type: String,
      trim: true,
    },
    // ✅ dueDateフィールドを追加
    dueDate: {
      type: Date,
      required: false, // 必須ではないとします
    },
  },
  {
    timestamps: true, // ✅ 作成日時と更新日時を自動で記録
  }
);

// Mongooseモデルをエクスポート
module.exports = mongoose.model("Sales", salesSchema);
