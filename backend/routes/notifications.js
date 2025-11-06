// backend/routes/notifications.js
const express = require("express");
const { verifyFirebaseToken } = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", verifyFirebaseToken, getNotifications);
router.patch("/:id/read", verifyFirebaseToken, markAsRead);

module.exports = router;
