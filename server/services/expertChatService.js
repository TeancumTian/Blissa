const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ExpertMessage = require("../models/ExpertMessage");
const Appointment = require("../models/Appointment");

class ExpertChatService {
  constructor(server) {
    this.wss = new WebSocket.Server({
      server,
      path: "/ws/expert-chat", // 独立的WebSocket路径
    });
    if (!process.env.JWT_SECRET) {
      console.error("警告: JWT_SECRET 未定义");
    }
    this.clients = new Map();

    this.wss.on("connection", (ws, req) => {
      this.handleConnection(ws, req);
    });
  }

  handleConnection(ws, req) {
    const token = new URL(req.url, "http://localhost").searchParams.get(
      "token"
    );

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      this.clients.set(userId, ws);

      ws.on("message", async (message) => {
        await this.handleMessage(userId, message);
      });

      ws.on("close", () => {
        this.clients.delete(userId);
      });
    } catch (error) {
      console.error("专家聊天WebSocket认证失败:", error);
      ws.close();
    }
  }

  async handleMessage(userId, message) {
    try {
      const data = JSON.parse(message);
      const { appointmentId, content } = data;

      const newMessage = await ExpertMessage.create({
        appointmentId,
        senderId: userId,
        content,
        timestamp: new Date(),
      });

      const appointment = await Appointment.findById(appointmentId).populate(
        "expertId userId"
      );

      const receiverId =
        userId === appointment.userId.toString()
          ? appointment.expertId.toString()
          : appointment.userId.toString();

      this.sendMessageToUser(receiverId, {
        type: "expert-chat",
        appointmentId,
        message: newMessage,
      });
    } catch (error) {
      console.error("处理专家聊天消息错误:", error);
    }
  }

  sendMessageToUser(userId, data) {
    const ws = this.clients.get(userId);
    if (ws) {
      ws.send(JSON.stringify(data));
    }
  }
}

module.exports = ExpertChatService;
