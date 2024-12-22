const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middleware/auth");

// 统一使用认证中间件
router.post("/", auth, async (req, res) => {
  try {
    await chatController.handleChat(req, res);
  } catch (error) {
    console.error("聊天请求错误:", error);
    res.status(500).json({ error: "服务器内部错误" });
  }
});

module.exports = router;
