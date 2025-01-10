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
const WebSocket = require("ws");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

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

// CORS配置
app.use(
  cors({
    origin: true, // 允许所有来源
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    credentials: true,
    maxAge: 86400, // 预检请求缓存24小时
  })
);

// 添加移动应用所需的响应头
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});

app.set("trust proxy", true);

// 调试中间件
app.use((req, res, next) => {
  console.log("Request received:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
    origin: req.get("origin"),
    userAgent: req.get("user-agent"),
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

// 先配置不需要认证的路由
app.use("/api/auth", authRoutes);
app.use("/api/test", (req, res) => {
  res.json({ message: "Backend server is running" });
});

// 安全 API 路由
const secureApiRouter = express.Router();
app.use("/api", secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  // 跳过认证路由的认证检查
  if (req.path.startsWith("/auth/")) {
    return next();
  }

  const authToken =
    req.cookies[authCookieName] || req.headers.authorization?.split(" ")[1];
  if (!authToken) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
});

// 其他需要认证的路由
secureApiRouter.use("/skintest", skinTestRoutes);
secureApiRouter.use("/chat", chatRoutes);
secureApiRouter.use("/livekit", liveKitRoutes);
secureApiRouter.use("/experts", expertRoutes);
secureApiRouter.use("/messages", messageRoutes);
secureApiRouter.use("/appointments", appointmentRoutes);

// 移动应用测试端点
app.get("/api/mobile/test", (req, res) => {
  res.json({
    status: "success",
    message: "Mobile API is working",
    timestamp: new Date().toISOString(),
    headers: req.headers,
    userAgent: req.get("user-agent"),
  });
});

// 测试路由
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend server is running" });
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
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
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

// 初始化 WebSocket 服务
const wss = new WebSocket.Server({
  noServer: true, // 重要：让我们手动处理升级
  verifyClient: false, // 我们将在 upgrade 事件中处理验证
});

// WebSocket 连接处理
wss.on("connection", (ws, req) => {
  console.log("新的WebSocket连接已建立, userId:", req.userId);

  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("error", (error) => {
    console.error("WebSocket连接错误:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket连接已关闭");
  });
});

// 心跳检测
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", () => {
  clearInterval(interval);
});

// 处理 WebSocket 升级请求
server.on("upgrade", async (request, socket, head) => {
  const pathname = new URL(request.url, "http://localhost:3000").pathname;

  if (pathname === "/ws/expert-chat") {
    try {
      const token = new URL(
        request.url,
        "http://localhost:3000"
      ).searchParams.get("token");

      if (!token) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.userId = decoded.userId;

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } catch (error) {
      console.error("WebSocket验证错误:", error);
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
    }
  }
});

// 创建专家聊天服务
expertChatService = new ExpertChatService(wss);
app.set("expertChatService", expertChatService);

// 在服务器启动之前添加错误处理
wss.on("error", (error) => {
  console.error("WebSocket服务器错误:", error);
});

// 使用 server 而不是 app 来监听端口
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
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
// 路由配置
app.use("/api/auth", authRoutes);
app.use("/api/experts", expertRoutes);
app.use("/api/appointments", appointmentRoutes);

// 验证认证中间件
const authenticateToken = async (req, res, next) => {
  try {
    // 首先检查 Authorization header
    const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    // 如果没有 Authorization header，则检查 cookie
    if (!token) {
      token = req.cookies[authCookieName];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
