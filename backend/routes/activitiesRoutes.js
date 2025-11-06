// backend/routes/activitiesRoutes.js

const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/authMiddleware");
const activityController = require("../controllers/activityController");

// 🔐 認証ミドルウェアを適用
router.use(verifyFirebaseToken);

// --- ユーザーIDに紐づくアクティビティを取得 ---
router.get(
  "/user",
  (req, res, next) => {
    console.log("📝 GET /activities/user called by:", req.user.uid);
    next();
  },
  activityController.getActivitiesByUser
);

// --- 全てのアクティビティを取得（管理者向け） ---
router.get(
  "/all",
  (req, res, next) => {
    console.log("📝 GET /activities/all called by:", req.user.uid);
    next();
  },
  activityController.getAllActivities
);

// ✅ 特定の顧客に紐づく活動履歴を取得
router.get(
  "/customer/:customerId",
  (req, res, next) => {
    console.log(
      `📝 GET /activities/customer/${req.params.customerId} called by:`,
      req.user.uid
    );
    next();
  },
  activityController.getActivitiesByCustomer
);

// ✅ 特定の案件に紐づく活動履歴を取得
router.get(
  "/sales/:saleId",
  (req, res, next) => {
    console.log(
      `📝 GET /activities/sales/${req.params.saleId} called by:`,
      req.user.uid
    );
    next();
  },
  activityController.getActivitiesBySaleId
);

// ✅ 特定のタスクに紐づく活動履歴を取得
router.get(
  "/tasks/:taskId",
  (req, res, next) => {
    console.log(
      `📝 GET /activities/tasks/${req.params.taskId} called by:`,
      req.user.uid
    );
    next();
  },
  activityController.getActivitiesByTask
);

module.exports = router;
