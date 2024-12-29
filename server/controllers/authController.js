const User = require("../models/User");
const Expert = require("../models/Expert");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  // 普通用户注册
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // 检查邮箱是否已存在
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "该邮箱已被注册" });
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
      console.error("注册错误:", error);
      res.status(500).json({ error: "注册失败" });
    }
  }

  // 专家注册
  async registerExpert(req, res) {
    try {
      const { email, password, name, specialty, description } = req.body;
      console.log("注册专家数据:", { email, name, specialty, description }); // 调试用

      // 验证必填字段
      if (!email || !password || !name || !specialty || !description) {
        return res.status(400).json({ error: "所有字段都是必填的" });
      }

      // 检查邮箱是否已存在
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "该邮箱已被注册" });
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("密码加密成功"); // 调试用

      // 创建专家用户
      const user = new User({
        email,
        password: hashedPassword,
        name,
        role: "expert",
      });

      await user.save();
      console.log("用户保存成功:", user._id); // 调试用

      // 创建专家信息
      const expert = new Expert({
        _id: user._id,
        name,
        specialty,
        description,
        availability: [
          {
            day: "Monday",
            slots: ["09:00-10:00", "10:00-11:00", "14:00-15:00", "15:00-16:00"],
          },
          {
            day: "Wednesday",
            slots: ["09:00-10:00", "10:00-11:00", "14:00-15:00", "15:00-16:00"],
          },
          {
            day: "Friday",
            slots: ["09:00-10:00", "10:00-11:00", "14:00-15:00", "15:00-16:00"],
          },
        ],
      });

      await expert.save();
      console.log("专家信息保存成功"); // 调试用

      // 确保 JWT_SECRET 存在
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not configured");
      }

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
      console.error("专家注册错误:", error);
      res.status(500).json({
        error: "注册失败",
        details: error.message,
      });
    }
  }

  // 用户登录
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 查找用户
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "邮箱或密码错误" });
      }

      // 验证密码
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "邮箱或密码错误" });
      }

      // 生成 JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

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
      console.error("登录错误:", error);
      res.status(500).json({ error: "登录失败" });
    }
  }
}

module.exports = new AuthController();
