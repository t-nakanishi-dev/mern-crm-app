// backend/routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { verifyFirebaseToken } = require("../middleware/authMiddleware");

// 💡 ログを記録するミドルウェアを追加
const logRequestBody = (req, res, next) => {
  console.log("📝 ルートに到達したリクエストボディ:", req.body);
  next();
};

// タスク関連のルート
router.get("/", verifyFirebaseToken, taskController.getAllTasks);
router.get(
  "/customer/:id",
  verifyFirebaseToken,
  taskController.getTasksByCustomer
);

// ✅ タスク作成ルートにログミドルウェアを追加
router.post(
  "/",
  verifyFirebaseToken,
  logRequestBody,
  taskController.createTask
);

// ✅ タスク更新ルートにログミドルウェアを追加
router.put(
  "/:id",
  verifyFirebaseToken,
  logRequestBody,
  taskController.updateTask
);

router.delete("/:id", verifyFirebaseToken, taskController.deleteTask);

module.exports = router;
