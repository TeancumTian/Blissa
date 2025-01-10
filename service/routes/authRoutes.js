const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const User = require("../models/User");

// 认证路由
router.post("/register", authController.register);
router.post("/login", authController.login);

// 添加测试路由（仅在开发环境使用）
if (process.env.NODE_ENV === "development") {
  router.get("/check-user/:email", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email }).select(
        "-password"
      );
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      res.json({
        msg: "User found",
        user: {
          email: user.email,
          role: user.role,
          _id: user._id,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
}

module.exports = router;
