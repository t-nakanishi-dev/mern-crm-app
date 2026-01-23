// backend/controllers/activityController.js
const Activity = require("../models/Activity");
const User = require("../models/User");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

// --- 特定のタスクに関連するアクティビティ履歴を取得 ---
const getActivitiesByTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400);
    throw new Error("無効なタスクIDです");
  }

  const activities = await Activity.find({ taskId })
    .sort({ createdAt: -1 })
    .limit(50);

  const userIds = [...new Set(activities.map((a) => a.userId))];
  const users = await User.find({ uid: { $in: userIds } }).select(
    "uid displayName photoURL"
  );
  const userMap = users.reduce((map, user) => {
    map[user.uid] = user;
    return map;
  }, {});

  const activitiesWithUsers = activities.map((activity) => ({
    ...activity.toObject(),
    user: userMap[activity.userId],
  }));

  res.status(200).json(activitiesWithUsers);
});

// --- 顧客IDに紐づくアクティビティを取得 ---
const getActivitiesByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const assignedUserId = req.user.uid;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    console.error("❌ 無効な顧客ID:", customerId);
    res.status(400);
    throw new Error("無効な顧客IDです");
  }

  const activities = await Activity.find({
    customerId: new mongoose.Types.ObjectId(customerId),
    assignedUserId,
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json(activities);
});

// --- ユーザーIDに紐づくアクティビティを取得 ---
const getActivitiesByUser = asyncHandler(async (req, res) => {

  const activities = await Activity.find({ assignedUserId: req.user.uid })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json(activities);
});

// --- 全てのアクティビティを取得（管理者向け） ---
const getAllActivities = asyncHandler(async (req, res) => {

  if (req.user.role !== "admin") {
    console.error("❌ 権限なし user:", req.user.uid);
    res.status(403);
    throw new Error("権限がありません");
  }

  const activities = await Activity.find().sort({ createdAt: -1 }).limit(100);

  res.status(200).json(activities);
});

// --- 特定の案件IDに紐づくアクティビティを取得 ---
const getActivitiesBySaleId = asyncHandler(async (req, res) => {
  const { saleId } = req.params;
  const assignedUserId = req.user.uid;

  if (!mongoose.Types.ObjectId.isValid(saleId)) {
    console.error("❌ 無効な案件ID:", saleId);
    res.status(400);
    throw new Error("無効な案件IDです");
  }

  const activities = await Activity.find({
    salesId: new mongoose.Types.ObjectId(saleId),
    assignedUserId,
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json(activities);
});

module.exports = {
  getActivitiesByTask,
  getActivitiesByCustomer,
  getActivitiesByUser,
  getAllActivities,
  getActivitiesBySaleId,
};
