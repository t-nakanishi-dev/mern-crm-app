// backend/models/contactModel.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    contactDate: {
      type: Date,
      required: [true, "連絡日を入力してください"],
      default: Date.now,
    },
    content: {
      type: String,
      required: [true, "内容を入力してください"],
      trim: true,
    },
    responseStatus: {
      type: String,
      enum: ["未対応", "対応中", "対応済み"],
      default: "未対応",
    },
    memo: {
      type: String,
      trim: true,
    },
    assignedUserId: {
      type: String, // Firebase UIDを保存
      default: null, // 社員が登録した場合のみUIDを入れる
    },
    customerName: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      required: [true, "氏名は必須です"],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, "メールアドレスは必須です"],
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
