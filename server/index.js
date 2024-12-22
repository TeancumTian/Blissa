const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const DB = require("./database.js");
const { peerProxy } = require("./peerProxy.js");
const chatRoutes = require("./routes/chatRoutes");
const skinTestRoutes = require("./routes/skinTestRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
const liveKitRoutes = require("./routes/liveKitRoutes");

const authCookieName = "token";
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = "http://localhost:5173"; // 统一前端端口

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
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({ msg: "Existing user" });
  } else {
    const user = await DB.createUser(req.body.email, req.body.password);

    // 设置 Cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// 获取 Auth 令牌
app.post("/api/auth/login", async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: "Unauthorized" });
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

// 启动服务器
const httpService = app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

// 设置 WebSocket 代理
peerProxy(httpService);
