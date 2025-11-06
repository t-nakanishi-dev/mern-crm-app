// backend/controllers/notificationController.js (修正案)
const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

// この関数はtaskControllerから呼び出されることを想定
const addNotification = async ({ message, targetUser, relatedTask }) => {
  if (!message || !targetUser) {
    console.error("❌ 通知メッセージと対象ユーザーは必須です。");
    return;
  }

  const notification = new Notification({
    message,
    targetUser,
    relatedTask,
  });

  try {
    await notification.save();
    console.log(`✅ 通知が追加されました: to=${targetUser}, msg=${message}`);
  } catch (error) {
    console.error("❌ 通知追加エラー:", error.message);
  }
};

/**
 * @desc ログインユーザーの通知を取得
 * @route GET /api/notifications
 * @access Private
 */
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    targetUser: req.user.uid,
    isRead: false,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(notifications);
});

/**
 * @desc 通知を既読にする
 * @route PATCH /api/notifications/:id/read
 * @access Private
 */
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("通知が見つかりません。");
  }

  if (notification.targetUser.toString() !== req.user.uid) {
    res.status(401);
    throw new Error("この通知に対する権限がありません。");
  }

  notification.isRead = true;
  await notification.save();
  res.json({
    message: "通知が既読になりました。",
  });
});

module.exports = {
  addNotification,
  getNotifications,
  markAsRead,
};
