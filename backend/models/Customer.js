// backend/models/Customer.js

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["見込み", "提案中", "契約済", "失注"],
      default: "見込み",
    },
    contactMemo: {
      type: String,
      trim: true,
    },
    assignedUserId: {
      type: String, // ✅ FirebaseのUIDを保存
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
