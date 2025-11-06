// backend/controllers/salesController.js

const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Sales = require("../models/Sales");
const Customer = require("../models/Customer");
const Activity = require("../models/Activity");

// 💡 アクティビティを記録するためのヘルパー関数
const recordActivity = async (
  userId,
  action,
  targetModel,
  targetId,
  description,
  customerId = null,
  salesId = null,
  assignedUserId // ✅ 追加: assignedUserIdを引数として受け取る
) => {
  try {
    const activity = new Activity({
      userId,
      action,
      targetModel,
      targetId,
      description,
      customerId,
      salesId,
      assignedUserId, // ✅ 修正: assignedUserIdをモデルにセット
    });
    await activity.save();
  } catch (error) {
    console.error("アクティビティの記録に失敗しました:", error);
  }
};

// --- 新しい案件を作成 ---
exports.createSales = asyncHandler(async (req, res) => {
  const { dealName, customerId, amount, status, dueDate, notes } = req.body;
  const assignedUserId = req.user.uid;

  if (!dealName || !customerId || !status) {
    res.status(400);
    throw new Error("案件名、顧客、ステータスは必須項目です");
  }

  const sales = new Sales({
    dealName,
    customerId,
    amount,
    status,
    dueDate,
    notes,
    assignedUserId,
  });

  const createdSales = await sales.save();

  await recordActivity(
    assignedUserId,
    "created",
    "Sales",
    createdSales._id,
    `新しい案件「${dealName}」を作成しました。`,
    customerId,
    createdSales._id,
    assignedUserId // ✅ 修正: assignedUserIdを渡す
  );

  res.status(201).json(createdSales);
});

// --- 案件を更新 ---
exports.updateSales = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const assignedUserId = req.user.uid;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("無効な案件IDです");
  }

  const sales = await Sales.findById(id);

  if (!sales) {
    res.status(404);
    throw new Error("案件が見つかりませんでした");
  }

  if (sales.assignedUserId.toString() !== assignedUserId) {
    res.status(403);
    throw new Error("この案件を更新する権限がありません");
  }

  const beforeData = {
    dealName: sales.dealName,
    status: sales.status,
  };

  sales.dealName = req.body.dealName || sales.dealName;
  sales.amount = req.body.amount !== undefined ? req.body.amount : sales.amount;
  sales.status = req.body.status || sales.status;
  sales.dueDate =
    req.body.dueDate !== undefined ? req.body.dueDate : sales.dueDate;
  sales.notes = req.body.notes !== undefined ? req.body.notes : sales.notes;

  const updatedSales = await sales.save();

  const changes = [];
  if (beforeData.dealName !== updatedSales.dealName) {
    changes.push(`案件名を「${updatedSales.dealName}」に変更`);
  }
  if (beforeData.status !== updatedSales.status) {
    changes.push(
      `ステータスを「${beforeData.status}」から「${updatedSales.status}」に更新`
    );
  }

  if (changes.length > 0) {
    await recordActivity(
      assignedUserId,
      "updated",
      "Sales",
      updatedSales._id,
      changes.join("、"),
      updatedSales.customerId,
      updatedSales._id,
      assignedUserId // ✅ 修正: assignedUserIdを渡す
    );
  }

  res.status(200).json(updatedSales);
});

// --- 案件を削除 ---
exports.deleteSales = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const assignedUserId = req.user.uid;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("無効な案件IDです");
  }

  const sales = await Sales.findById(id);

  if (!sales) {
    res.status(404);
    throw new Error("案件が見つかりませんでした");
  }

  if (sales.assignedUserId.toString() !== assignedUserId) {
    res.status(403);
    throw new Error("この案件を削除する権限がありません");
  }

  await sales.deleteOne();
  res.status(200).json({ message: "案件が削除されました" });
});

// --- 特定の案件をIDで取得 ---
exports.getSalesById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const assignedUserId = req.user.uid;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("無効な案件IDです");
  }

  const sales = await Sales.findOne({
    _id: id,
    assignedUserId: assignedUserId,
  });

  if (!sales) {
    res.status(404);
    throw new Error("案件が見つからないか、閲覧する権限がありません");
  }

  const customer = await Customer.findById(sales.customerId);

  const activities = await Activity.find({
    targetModel: "Sales",
    targetId: sales._id,
  }).sort({
    createdAt: -1,
  });

  res.status(200).json({ sales, customer, activities });
});

// --- ユーザーに紐づく案件を全て取得 ---
exports.getAllSalesByUser = asyncHandler(async (req, res) => {
  const sales = await Sales.find({ assignedUserId: req.user.uid }).sort({
    updatedAt: -1,
  });

  res.status(200).json(sales);
});

// --- 特定の顧客に紐づく案件を全て取得 ---
exports.getSalesByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const assignedUserId = req.user.uid;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    res.status(400);
    throw new Error("無効な顧客IDです");
  }

  const sales = await Sales.find({ customerId, assignedUserId }).sort({
    updatedAt: -1,
  });

  res.status(200).json(sales);
});

// --- ダッシュボード用のサマリーデータを取得する新しい関数
exports.getSalesSummary = asyncHandler(async (req, res) => {
  const userId = req.user.uid;

  const allSales = await Sales.find({ assignedUserId: userId });

  const totalSales = allSales.reduce(
    (sum, sales) => sum + (sales.amount || 0),
    0
  );
  const totalDeals = allSales.length;

  const averageDealValue = totalDeals > 0 ? totalSales / totalDeals : 0;

  const statusSummary = allSales.reduce((acc, sales) => {
    const status = sales.status;
    if (!acc[status]) {
      acc[status] = { status, count: 0, totalAmount: 0 };
    }
    acc[status].count++;
    acc[status].totalAmount += sales.amount || 0;
    return acc;
  }, {});
  const statusSummaryArray = Object.values(statusSummary);

  const customerSales = await generateCustomerSales(userId);

  const today = new Date();
  const sevenDaysLater = new Date(today);
  sevenDaysLater.setDate(today.getDate() + 7);

  const upcomingDeals = allSales
    .filter(
      (sales) =>
        sales.dueDate &&
        new Date(sales.dueDate) >= today &&
        new Date(sales.dueDate) <= sevenDaysLater
    )
    .map((deal) => ({
      dealName: deal.dealName,
      dueDate: deal.dueDate,
      _id: deal._id,
    }));

  res.status(200).json({
    totalSales,
    totalDeals,
    averageDealValue,
    statusSummary: statusSummaryArray,
    customerSales,
    upcomingDeals,
  });
});

// --- 顧客別売上データを生成するヘルパー関数
async function generateCustomerSales(userId) {
  const allSales = await Sales.find({ assignedUserId: userId }).populate(
    "customerId",
    "companyName"
  );
  const salesByCustomer = allSales.reduce((acc, sale) => {
    const customerName = sale.customerId?.companyName || "不明な顧客";
    if (!acc[customerName]) {
      acc[customerName] = {
        name: customerName,
        sales: 0,
      };
    }
    acc[customerName].sales += sale.amount || 0;
    return acc;
  }, {});
  return Object.values(salesByCustomer);
}
