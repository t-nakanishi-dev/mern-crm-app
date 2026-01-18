// backend/controllers/taskController.js

const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Sales = require("../models/Sales");
const Activity = require("../models/Activity");
const { addNotification } = require("./notificationController");

/**
 * @desc ユーザーアクティビティを記録
 */
const recordActivity = async (
  userId,
  action,
  taskId,
  description,
  customerId = null,
  salesId = null,
  assignedUserId = null,
  before = null,
  after = null,
  targetId = null,
  timestamp = new Date()
) => {
  try {
    console.log("📝 recordActivity start:", { userId, action, taskId });
    const activity = new Activity({
      userId,
      action,
      taskId,
      description,
      customerId,
      salesId,
      assignedUserId,
      before,
      after,
      targetModel: "Task",
      targetId: targetId || taskId,
      updatedAt: timestamp,
    });
    await activity.save();
    console.log("✅ recordActivity success");
  } catch (err) {
    console.error("❌ アクティビティ記録エラー:", err.message);
  }
};

/**
 * @desc 新規タスク作成
 */
exports.createTask = asyncHandler(async (req, res) => {
  console.log("📝 createTask start", req.body);

  const {
    title,
    description,
    assignedTo,
    customer,
    sales,
    dueDate,
    status = "todo",
  } = req.body;

  const createdBy = req.user.uid;

  const newTask = new Task({
    title,
    description,
    assignedTo,
    createdBy,
    customer,
    sales,
    dueDate,
    status,
  });

  const task = await newTask.save();
  console.log("✅ Created task with status:", task.status);

  const createdByUser = await User.findOne({ uid: createdBy });
  const assignedUser = await User.findOne({ uid: assignedTo });
  const customerObj = await Customer.findById(customer);
  const salesObj = await Sales.findById(sales);

  const creatorName = createdByUser?.displayName || "不明なユーザー";
  const assigneeName = assignedUser?.displayName || "不明なユーザー";
  const customerName = customerObj?.name || "不明";
  const salesName = salesObj?.dealName || "不明";

  if (createdBy === assignedTo) {
    await addNotification({
      message: `あなたがタスク「${task.title}」を自分に作成・割り当てました。`,
      targetUser: assignedTo,
      relatedTask: task._id,
    });
  } else {
    await addNotification({
      message: `${creatorName}がタスク「${task.title}」をあなたに割り当てました。`,
      targetUser: assignedTo,
      relatedTask: task._id,
    });

    await addNotification({
      message: `${assigneeName}にタスク「${task.title}」を割り当てました。`,
      targetUser: createdBy,
      relatedTask: task._id,
    });
  }

  await recordActivity(
    createdBy,
    "created",
    task._id,
    `タスク「${task.title}」を作成しました。`,
    customer,
    sales,
    assignedTo,
    null,
    task,
    task._id
  );

  res.status(201).json(task);
});

/**
 * @desc タスク更新
 */
exports.updateTask = asyncHandler(async (req, res) => {
  console.log("📝 updateTask start", req.body);

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ msg: "タスクが見つかりません" });
  }

  // ✅ 作成者のみ編集可能
  if (String(task.createdBy) !== String(req.user.uid)) {
    return res
      .status(403)
      .json({ message: "このタスクを編集する権限がありません" });
  }

  const beforeTask = task.toObject();

  const updateData = {
    title: req.body.title ?? task.title,
    description: req.body.description ?? task.description,
    status: req.body.status ?? task.status,
    assignedTo: req.body.assignedTo ?? task.assignedTo,
    customer: req.body.customer ?? task.customer,
    sales: req.body.sales ?? task.sales,
    dueDate: req.body.dueDate ?? task.dueDate,
  };

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  const activityDescriptions = [];

  if (updateData.status !== beforeTask.status) {
    activityDescriptions.push(
      `ステータスを「${beforeTask.status}」から「${updatedTask.status}」に変更`
    );
  }

  if (updateData.title !== beforeTask.title) {
    activityDescriptions.push(
      `タイトルを「${beforeTask.title}」から「${updatedTask.title}」に変更`
    );
  }

  if (updateData.description !== beforeTask.description) {
    activityDescriptions.push(`説明を更新`);
  }

  if (activityDescriptions.length > 0) {
    await recordActivity(
      req.user.uid,
      "updated",
      updatedTask._id,
      `タスクを更新しました：\n- ${activityDescriptions.join("\n- ")}`,
      updatedTask.customer,
      updatedTask.sales,
      updatedTask.assignedTo,
      beforeTask,
      updatedTask,
      updatedTask._id
    );
  }

  res.json(updatedTask);
});

/**
 * @desc タスク削除
 */
exports.deleteTask = asyncHandler(async (req, res) => {
  console.log("📝 deleteTask start:", req.params.id);

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ msg: "タスクが見つかりません" });
  }

  // ✅ 作成者のみ削除可能
  if (String(task.createdBy) !== String(req.user.uid)) {
    return res
      .status(403)
      .json({ message: "このタスクを削除する権限がありません" });
  }

  const user = await User.findOne({ uid: req.user.uid });
  const customerObj = await Customer.findById(task.customer);
  const salesObj = await Sales.findById(task.sales);

  const message = `${user?.displayName || "不明"}が、顧客「${
    customerObj?.name || "不明"
  }」の案件「${salesObj?.dealName || "不明"}」のタスク「${
    task.title
  }」を削除しました。`;

  await addNotification({
    message,
    targetUser: task.createdBy,
    relatedTask: task._id,
  });

  await recordActivity(
    req.user.uid,
    "deleted",
    task._id,
    `タスク「${task.title}」を削除しました。`,
    task.customer,
    task.sales,
    task.assignedTo,
    task,
    null,
    task._id
  );

  await Task.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "タスクを削除しました。" });
});

/**
 * @desc 全タスク取得（自分が作成 or 自分に割り当て）
 */
exports.getAllTasks = asyncHandler(async (req, res) => {
  let tasks = await Task.find({
    $or: [{ assignedTo: req.user.uid }, { createdBy: req.user.uid }],
  })
    .populate("customer", "name companyName")
    .populate("sales", "dealName amount status")
    .sort({ createdAt: -1 })
    .lean();

  const users = await User.find({
    uid: {
      $in: [
        ...tasks.map((t) => t.assignedTo),
        ...tasks.map((t) => t.createdBy),
      ],
    },
  })
    .select("uid displayName")
    .lean();

  const userMap = new Map(users.map((u) => [u.uid, u]));

  tasks = tasks.map((task) => ({
    ...task,
    assignedToUser: userMap.get(task.assignedTo) || null,
    createdByUser: userMap.get(task.createdBy) || null,
  }));

  res.status(200).json(tasks);
});

/**
 * @desc タスク詳細取得（アクティビティ込み）
 */
exports.getTaskById = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id)
    .populate("customer", "name companyName")
    .populate("sales", "dealName amount status dueDate")
    .lean();

  if (!task) {
    return res.status(404).json({ message: "タスクが見つかりません" });
  }

  const assignedUser = await User.findOne({ uid: task.assignedTo })
    .select("uid displayName")
    .lean();

  const activities = await Activity.find({ taskId: task._id })
    .sort({ updatedAt: -1 })
    .populate("userId", "displayName");

  res.status(200).json({
    task: {
      ...task,
      assignedToUser: assignedUser || null,
    },
    activities,
  });
});

/**
 * @desc 顧客別タスク取得
 */
exports.getTasksByCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.id;

  let tasks = await Task.find({
    customer: customerId,
    $or: [{ assignedTo: req.user.uid }, { createdBy: req.user.uid }],
  })
    .populate("customer", "name companyName")
    .populate("sales", "dealName amount status")
    .sort({ createdAt: -1 })
    .lean();

  const users = await User.find({
    uid: {
      $in: [
        ...tasks.map((t) => t.assignedTo),
        ...tasks.map((t) => t.createdBy),
      ],
    },
  })
    .select("uid displayName")
    .lean();

  const userMap = new Map(users.map((u) => [u.uid, u]));

  tasks = tasks.map((task) => ({
    ...task,
    assignedToUser: userMap.get(task.assignedTo) || null,
    createdByUser: userMap.get(task.createdBy) || null,
  }));

  res.status(200).json(tasks);
});
