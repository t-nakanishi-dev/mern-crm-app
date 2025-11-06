// backend/models/Activity.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Activityモデルのスキーマ定義
const activitySchema = new Schema(
  {
    // 活動を行ったユーザーのID（Firebase UID）
    userId: {
      type: String,
      required: true,
      index: true, // ユーザーIDで検索することが多いためインデックスを張る
    }, // 活動の種類（例: 'created', 'updated', 'deleted', 'status_changed'）
    action: {
      type: String,
      enum: ["created", "updated", "deleted", "commented", "status_changed"],
      required: true,
    }, // 活動が関連するモデル名（例: 'Customer', 'Sales', 'Task'）
    targetModel: {
      type: String,
      required: true,
      index: true, // どのモデルに関連するかで検索することが多いためインデックスを張る
    }, // 関連するドキュメントのObjectId
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true, // ドキュメントIDで検索することが多いためインデックスを張る
    }, // 活動の詳細な説明文
    description: {
      type: String,
      required: true,
    }, // 関連するCustomerのObjectId（検索を容易にするための冗長なフィールド）
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      index: true,
    }, // 関連するSalesのObjectId（検索を容易にするための冗長なフィールド）
    salesId: {
      type: Schema.Types.ObjectId,
      ref: "Sales",
      index: true,
    }, // 関連するTaskのObjectId（検索を容易にするための冗長なフィールド）
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      index: true,
    }, // ✅ 修正: 活動が紐づく担当ユーザーのIDを追加
    assignedUserId: {
      type: String,
      required: false,
      index: true,
    }, // 変更前のデータ（任意で追加。差分を記録したい場合に便利）
    before: {
      type: Schema.Types.Mixed,
    }, // 変更後のデータ（任意で追加。差分を記録したい場合に便利）
    after: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true, // 作成日時（createdAt）と更新日時（updatedAt）を自動で追加
  }
);

// モデルをエクスポート
module.exports = mongoose.model("Activity", activitySchema);
