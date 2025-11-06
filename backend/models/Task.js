// backend/models/Task.js

const mongoose = require("mongoose");

// タスクのスキーマを定義
const taskSchema = new mongoose.Schema(
  {
    // タスクの件名
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // タスクの説明
    description: {
      type: String,
      trim: true,
    },
    // タスクの状態（例: 'todo', 'in_progress', 'done'）
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
    // タスクの担当者（Firebase UIDを格納）
    assignedTo: {
      type: String,
      required: true,
    },
    // タスクを作成したユーザー（Firebase UIDを格納）
    createdBy: {
      type: String,
      required: true,
    },
    // タスクに関連付けられた顧客（顧客IDを格納）
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // 'Customer'モデルを参照
      required: true, // ✅ 修正: 顧客は必須とする
    },
    // ✅ 追加: タスクに関連付けられた案件ID
    sales: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sales", // 'Sales'モデルを参照
      required: false, // 案件に紐づかないタスクもあるため必須ではない
    },
    // タスクの期日
    dueDate: {
      type: Date,
    },
  },
  // 作成日時と更新日時を自動で追加
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
