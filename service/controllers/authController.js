const User = require("../models/User");
const Expert = require("../models/Expert");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  // 用户登录
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log("\n========== 登录尝试 ==========");
      console.log("时间:", new Date().toISOString());
      console.log("登录邮箱:", email);
      console.log("请求头:", JSON.stringify(req.headers, null, 2));

      // 预处理邮箱
      const normalizedEmail = email.toLowerCase().trim();
      console.log("标准化后的邮箱:", normalizedEmail);

      // 查找用户
      console.log("\n--- 开始查找用户 ---");
      console.log("查询条件:", { email: normalizedEmail });
      const user = await User.findOne({ email: normalizedEmail });
      console.log("原始数据库查询结果:", user);
      console.log(
        "数据库查询结果:",
        user
          ? {
              id: user._id,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
            }
          : "未找到用户"
      );

      if (!user) {
        console.log("错误: 用户不存在");
        return res.status(404).json({ msg: "User not found" });
      }

      // 验证密码
      console.log("\n--- 开始验证密码 ---");
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log("密码验证结果:", isValidPassword ? "验证通过" : "验证失败");

      if (!isValidPassword) {
        console.log("错误: 密码错误");
        return res.status(401).json({ msg: "Invalid email or password" });
      }

      // 确保 JWT_SECRET 存在
      if (!process.env.JWT_SECRET) {
        console.error("错误: JWT_SECRET 未配置");
        throw new Error("Server configuration error");
      }

      // 生成 JWT token
      console.log("\n--- 生成 JWT Token ---");
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("Token 生成成功");

      // 更新用户的最后登录时间
      user.lastLogin = new Date();
      await user.save();
      console.log("最后登录时间已更新:", user.lastLogin);

      console.log("\n=== 登录成功 ===");
      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("\n!!! 登录过程出错 !!!");
      console.error("错误详情:", error);
      console.error("错误堆栈:", error.stack);
      res.status(500).json({
        msg: "Login failed",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }

  // 用户注册
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      console.log("\n========== 注册尝试 ==========");
      console.log("时间:", new Date().toISOString());
      console.log("注册邮箱:", email);

      // 预处理邮箱
      const normalizedEmail = email.toLowerCase().trim();
      console.log("标准化后的邮箱:", normalizedEmail);

      // 检查邮箱是否已存在
      console.log("\n--- 检查邮箱是否已存在 ---");
      console.log("查询条件:", { email: normalizedEmail });
      const existingUser = await User.findOne({ email: normalizedEmail });
      console.log(
        "查询结果:",
        existingUser
          ? {
              id: existingUser._id,
              email: existingUser.email,
              createdAt: existingUser.createdAt,
            }
          : "未找到用户"
      );

      if (existingUser) {
        console.log("错误: 邮箱已被注册");
        return res.status(400).json({ msg: "Email already registered" });
      }

      // 加密密码
      console.log("\n--- 开始加密密码 ---");
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("密码加密完成");

      // 创建新用户
      console.log("\n--- 创建新用户 ---");
      const user = new User({
        email: normalizedEmail,
        password: hashedPassword,
        name,
        role: "user",
      });

      await user.save();
      console.log("新用户创建成功:", {
        id: user._id,
        email: user.email,
        role: user.role,
      });

      // 生成 JWT token
      console.log("\n--- 生成 JWT Token ---");
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("Token 生成成功");

      console.log("\n=== 注册成功 ===");
      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("\n!!! 注册过程出错 !!!");
      console.error("错误详情:", error);
      console.error("错误堆栈:", error.stack);
      res.status(500).json({ msg: "Registration failed" });
    }
  }
}

module.exports = new AuthController();
