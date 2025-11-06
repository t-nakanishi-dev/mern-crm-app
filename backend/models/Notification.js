// backend/models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // 通知を受け取るユーザーのUID
    targetUser: {
      type: String,
      required: true,
    },
    // 通知メッセージの本文
    message: {
      type: String,
      required: true,
    },
    // 関連するタスクのID
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    // 既読フラグ
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
