const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// 开发环境下跳过认证
if (process.env.NODE_ENV === "development") {
  console.log("运行在开发环境，跳过认证");

  router.post("/", async (req, res) => {
    try {
      // 添加测试用户ID
      req.user = { _id: "test-user-id" };
      // 处理聊天请求
      // ... 其他代码
    } catch (error) {
      console.error("聊天请求错误:", error);
      res.status(500).json({ error: "服务器内部错误" });
    }
  });
} else {
  // 生产环境使用认证
  const auth = require("../middleware/auth");
  router.post("/", auth, async (req, res) => {
    // ... 处理聊天请求
  });
}

module.exports = router;
