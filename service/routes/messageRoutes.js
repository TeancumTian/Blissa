const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const auth = require("../middleware/auth");

// 所有路由都需要认证
router.use(auth);

// 发送消息
router.post("/send", messageController.sendMessage);

// 获取与特定用户的聊天历史
router.get("/history/:userId", messageController.getChatHistory);

// 获取预约相关的消息
router.get(
  "/appointment/:appointmentId",
  messageController.getAppointmentMessages
);

// 标记消息为已读
router.post("/mark-read", messageController.markAsRead);

// 获取未读消息数量
router.get("/unread-count", messageController.getUnreadCount);

module.exports = router;
