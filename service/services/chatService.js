const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const Appointment = require("../models/Appointment");

class ChatService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // 存储连接的客户端

    this.wss.on("connection", (ws, req) => {
      this.handleConnection(ws, req);
    });
  }

  handleConnection(ws, req) {
    // 从 URL 获取 token
    const token = new URL(req.url, "http://localhost").searchParams.get(
      "token"
    );

    try {
      // 验证 token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      // 存储连接
      this.clients.set(userId, ws);

      ws.on("message", async (message) => {
        await this.handleMessage(userId, message);
      });

      ws.on("close", () => {
        this.clients.delete(userId);
      });
    } catch (error) {
      console.error("WebSocket 认证失败:", error);
      ws.close();
    }
  }

  async handleMessage(userId, message) {
    try {
      const data = JSON.parse(message);
      const { appointmentId, content } = data;

      // 保存消息到数据库
      const newMessage = await Message.create({
        appointmentId,
        senderId: userId,
        content,
        timestamp: new Date(),
      });

      // 获取预约信息以确定接收者
      const appointment = await Appointment.findById(appointmentId).populate(
        "expertId userId"
      );

      // 确定消息接收者
      const receiverId =
        userId === appointment.userId._id.toString()
          ? appointment.expertId._id.toString()
          : appointment.userId._id.toString();

      // 发送消息给接收者
      this.sendMessageToUser(receiverId, {
        type: "chat",
        appointmentId,
        message: newMessage,
      });
    } catch (error) {
      console.error("处理消息错误:", error);
    }
  }

  sendMessageToUser(userId, data) {
    const ws = this.clients.get(userId);
    if (ws) {
      ws.send(JSON.stringify(data));
    }
  }
}

module.exports = ChatService;
