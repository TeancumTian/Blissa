const User = require("../models/User");
const Expert = require("../models/Expert");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  // 用户登录
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log("Login attempt for email:", email);

      // 查找用户
      const user = await User.findOne({ email });
      console.log("Found user:", user ? "Yes" : "No");

      if (!user) {
        console.log("User not found in database");
        return res.status(401).json({ msg: "User does not exist" });
      }

      // 验证密码
      console.log("Comparing passwords...");
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log("Password valid:", isValidPassword);

      if (!isValidPassword) {
        console.log("Invalid password");
        return res.status(401).json({ msg: "Invalid email or password" });
      }

      // 确保 JWT_SECRET 存在
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET not configured");
        throw new Error("Server configuration error");
      }

      // 生成 JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("JWT token generated successfully");

      // 更新用户的最后登录时间
      user.lastLogin = new Date();
      await user.save();

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
      console.error("Login error details:", error);
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

      // 检查邮箱是否已存在
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email already registered" });
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建新用户
      const user = new User({
        email,
        password: hashedPassword,
        name,
        role: "user",
      });

      await user.save();

      // 生成 JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

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
      console.error("Registration error:", error);
      res.status(500).json({ msg: "Registration failed" });
    }
  }
}

module.exports = new AuthController();
