const express = require("express");
const router = express.Router();
const skinTestController = require("../controllers/skinTestController");
const SkinTest = require("../models/SkinTest");

// 开发环境下的测试路由 - 无需认证
if (process.env.NODE_ENV === "development") {
  console.log("运行在开发环境，跳过认证");

  // 测试路由
  router.get("/test", (req, res) => {
    res.json({ message: "测试路由正常" });
  });

  // 皮肤测试路由 - 开发环境跳过认证
  router.post("/submit", async (req, res) => {
    try {
      // 添加测试用户ID
      req.user = { _id: "test-user-id" };
      await skinTestController.submitTest(req, res);
    } catch (error) {
      console.error("提交测试错误:", error);
      res.status(500).json({ error: "服务器内部错误" });
    }
  });

  router.get("/history", async (req, res) => {
    try {
      // 使用测试用户ID
      req.user = { _id: "test-user-id" };
      const tests = await SkinTest.find({ userId: req.user._id }).sort({
        "result.timestamp": -1,
      });
      res.json(tests);
    } catch (error) {
      console.error("获取历史记录错误:", error);
      res.status(500).json({ error: "服务器内部错误" });
    }
  });
} else {
  // 生产环境使用认证中间件
  const auth = require("../middleware/auth");
  router.post(
    "/submit",
    auth,
    skinTestController.submitTest.bind(skinTestController)
  );
  router.get("/history", auth, async (req, res) => {
    try {
      const tests = await SkinTest.find({ userId: req.user._id }).sort({
        "result.timestamp": -1,
      });
      res.json(tests);
    } catch (error) {
      res.status(500).json({ error: "服务器内部错误" });
    }
  });
}

module.exports = router;
