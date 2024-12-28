require("dotenv").config();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const express = require("express");
const http = require("http");
const app = express();
const DB = require("./database.js");
const { peerProxy } = require("./peerProxy.js");
const chatRoutes = require("./routes/chatRoutes");
const skinTestRoutes = require("./routes/skinTestRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
const liveKitRoutes = require("./routes/liveKitRoutes");
const jwt = require("jsonwebtoken");
const expertRoutes = require("./routes/expertRoutes");
const messageRoutes = require("./routes/messageRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const initQuotes = require("./init/initQuotes");
const ExpertChatService = require("./services/expertChatService");
const expertChatRoutes = require("./routes/expertChatRoutes");

// ... 其他代码 ...

// 添加路由

const authCookieName = "token";
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = "http://localhost:5173"; // 统一前端端口

// 添加MongoDB连接
mongoose
  .connect(
    "mongodb+srv://BlissaDB:ERcf3HsZ8JGbcRgg@blissa.mcauor7.mongodb.net/blissa",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB连接成功"))
  .catch((err) => console.error("MongoDB连接失败:", err));

// 在数据库连接成功后初始化数据
mongoose.connection.once("open", () => {
  console.log("MongoDB连接成功，开始初始化数据...");
  initQuotes();
});

// 基础中间件配置
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.set("trust proxy", true);

// 调试中间件
app.use((req, res, next) => {
  console.log("收到请求:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
  });
  next();
});

// 创建 Auth 令牌
app.post("/api/auth/create", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证请求数据
    if (!email || !password) {
      return res.status(400).json({ msg: "邮箱和密码不能为空" });
    }

    // 检查用户是否存在
    const existingUser = await DB.getUser(email);
    if (existingUser) {
      return res.status(409).json({ msg: "用户已存在" });
    }

    // 创建新用户
    const user = await DB.createUser(email, password);

    // 设置认证 cookie
    setAuthCookie(res, user.token);

    // 返回用户信息
    res.json({
      id: user._id,
      token: user.token,
      email: user.email,
    });
  } catch (error) {
    console.error("用户创建错误:", error);
    res.status(500).json({ msg: "服务器错误：" + error.message });
  }
});

// 获取 Auth 令牌
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "邮箱和密码不能为空" });
    }

    const user = await DB.getUser(email);
    if (!user) {
      return res.status(401).json({ msg: "用户不存在" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ msg: "密码错误" });
    }

    // 生成新的 token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    // 更新用户的 token
    user.token = token;
    await DB.updateUser(user._id, { token });

    // 设置 cookie
    setAuthCookie(res, token);

    // 返回用户信息和 token
    res.json({
      id: user._id,
      email: user.email,
      token: token, // 确保返回 token
    });
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json({ msg: "服务器错误" });
  }
});

// 删除 Auth 令牌
app.delete("/api/auth/logout", (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// 安全 API 路由
const secureApiRouter = express.Router();
app.use("/api", secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// 获取分数
secureApiRouter.get("/scores", async (req, res) => {
  const scores = await DB.getHighScores();
  res.send(scores);
});

// 提交分数
secureApiRouter.post("/score", async (req, res) => {
  const score = { ...req.body, ip: req.ip };
  await DB.addScore(score);
  const scores = await DB.getHighScores();
  res.send(scores);
});

// API 路由配置
app.use("/api/skintest", skinTestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/livekit", liveKitRoutes);
app.use("/api/experts", expertRoutes);
app.use("/api/messages", messageRoutes);

// 测试路由
app.get("/api/test", (req, res) => {
  res.json({ message: "后端服务器正常运行" });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error("服务器错误:", err);
  res.status(500).json({ error: "服务器内部错误" });
});

// 默认路由处理
// app.use((_req, res) => {
//   res.sendFile("index.html", { root: "public" });
// });

// 创建 HTTP 服务器
const server = http.createServer(app);

// 定义 cookie 名称和设置函数
function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
  });
}

app.use("/api/quotes", quoteRoutes);

// 添加专家路由
app.use("/api/experts", expertRoutes);

// 确保只创建一个 WebSocket 服务实例
let expertChatService = null;

// 数据库连接
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB 连接成功");
    // 在数据库连接成功后初始化 WebSocket 服务
    if (!expertChatService) {
      expertChatService = new ExpertChatService(server);
      app.set("expertChatService", expertChatService);
    }
  })
  .catch((err) => console.error("MongoDB 连接错误:", err));

// 添加专家聊天路由
app.use("/api/expert-chat", expertChatRoutes);

// 使用 server 而不是 app 来监听端口
server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

// 设置 WebSocket 代理
peerProxy(server);

// 优雅关闭
process.on("SIGTERM", () => {
  console.log("收到 SIGTERM 信号，准备关闭服务器");
  server.close(() => {
    console.log("服务器已关闭");
    process.exit(0);
  });
});
