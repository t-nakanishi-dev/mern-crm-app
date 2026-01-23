// backend/controllers/customerController.js

const Customer = require("../models/Customer");
const Activity = require("../models/Activity");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

// 💡 アクティビティを記録するためのヘルパー関数を修正
const recordActivity = async (
  userId,
  action,
  targetModel,
  targetId,
  description,
  customerId = null,
  assignedUserId 
) => {
  try {
    const activity = new Activity({
      userId,
      action,
      targetModel,
      targetId,
      description,
      customerId,
      assignedUserId, // ✅ assignedUserIdをアクティビティモデルに保存
    });
    await activity.save();
  } catch (error) {
    console.error("アクティビティの記録に失敗しました:", error);
    // エラーが発生しても、メインの処理は止めない
  }
};

// 顧客新規登録
// 顧客を作成する際、ログイン中のユーザーに紐づける
exports.createCustomer = asyncHandler(async (req, res) => {
  const assignedUserId = req.user.uid;
  const newCustomer = await Customer.create({
    ...req.body,
    assignedUserId,
  });

  // 💡 顧客作成時にアクティビティを記録
  await recordActivity(
    req.user.uid,
    "created",
    "Customer",
    newCustomer._id,
    `新しい顧客「${
      newCustomer.companyName || newCustomer.name
    }」を登録しました。`,
    newCustomer._id,
    assignedUserId // ✅ assignedUserIdを渡すように変更
  );

  res.status(201).json(newCustomer);
});

// 全顧客情報取得（ログインユーザーの顧客のみ）
exports.getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({
    assignedUserId: req.user.uid,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(customers);
});

// 顧客IDで顧客情報を取得（ログインユーザーに紐づく特定の顧客を取得）
exports.getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    assignedUserId: req.user.uid,
  });
  if (!customer) {
    res.status(404);
    throw new Error("顧客が見つかりません");
  }
  res.status(200).json(customer);
});

// 顧客情報を更新（ログイン中のユーザーに紐づく特定の顧客を更新）
exports.updateCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("無効な顧客IDです");
  }

  const customer = await Customer.findById(id);
  if (!customer || customer.assignedUserId !== userId) {
    res.status(404);
    throw new Error("顧客が見つからないか、権限がありません");
  }

  const beforeUpdateData = customer.toObject();

  const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  const changes = [];
  for (const key in req.body) {
    if (beforeUpdateData[key] !== updatedCustomer[key] && key !== "updatedAt") {
      changes.push(
        `「${key}」を「${beforeUpdateData[key]}」から「${updatedCustomer[key]}」に更新`
      );
    }
  }

  if (changes.length > 0) {
    await recordActivity(
      req.user.uid,
      "updated",
      "Customer",
      updatedCustomer._id,
      `顧客「${
        updatedCustomer.companyName || updatedCustomer.name
      }」の情報を更新しました: ${changes.join("、")}`,
      updatedCustomer._id,
      userId 
    );
  }

  res.status(200).json(updatedCustomer);
});

// 顧客を削除（ログイン中のユーザーに紐づく特定の顧客を削除）
exports.deleteCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("無効な顧客IDです");
  }

  const customer = await Customer.findById(id);
  if (!customer || customer.assignedUserId !== userId) {
    res.status(404);
    throw new Error("顧客が見つからないか、権限がありません");
  }

  await recordActivity(
    req.user.uid,
    "deleted",
    "Customer",
    customer._id,
    `顧客「${customer.companyName || customer.name}」を削除しました。`,
    customer._id,
    userId // ✅ assignedUserIdを渡すように変更
  );

  await Customer.findByIdAndDelete(id);
  res.status(200).json({ message: "顧客情報を削除しました" });
});

// 全顧客取得（認証ユーザー問わず全件取得、管理者用に認可を後で追加可能）
exports.getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({}).sort({ createdAt: -1 });
  res.status(200).json({ customers });
});

// 💡 追加: ステータス別に顧客情報を取得（ログインユーザーの顧客のみ）
exports.getCustomersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const customers = await Customer.find({
    assignedUserId: req.user.uid,
    status: status,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(customers);
});

// 💡 追加: 顧客のステータスを更新
exports.updateCustomerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.uid;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("無効な顧客IDです");
  }

  const updatedCustomer = await Customer.findOneAndUpdate(
    { _id: id, assignedUserId: userId },
    { status: status },
    { new: true, runValidators: true }
  );

  if (!updatedCustomer) {
    res.status(404);
    throw new Error("顧客が見つからないか、権限がありません");
  }

  await recordActivity(
    req.user.uid,
    "status_changed",
    "Customer",
    updatedCustomer._id,
    `顧客「${
      updatedCustomer.companyName || updatedCustomer.name
    }」のステータスを「${updatedCustomer.status}」に更新しました。`,
    updatedCustomer._id,
    userId // ✅ assignedUserIdを渡すように変更
  );

  res.status(200).json(updatedCustomer);
});
