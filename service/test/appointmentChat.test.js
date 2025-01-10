const WebSocket = require("ws");
const axios = require("axios");
const { testAppointment } = require("./appointment.test.js");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  validateStatus: () => true,
});

async function testAppointmentChat() {
  try {
    console.log("开始测试预约聊天功能...");

    // 1. 首先创建一个测试预约
    const appointment = await testAppointment();
    if (!appointment) {
      throw new Error("无法创建测试预约");
    }

    // 2. 测试WebSocket连接
    console.log("\n测试 WebSocket 连接...");
    const ws = new WebSocket("ws://localhost:3000");

    ws.on("open", () => {
      console.log("WebSocket 连接成功");
    });

    ws.on("error", (error) => {
      console.error("WebSocket 错误:", error);
    });

    // 3. 测试发送消息
    console.log("\n测试发送消息...");
    const messageData = {
      content: "测试消息",
      appointmentId: appointment._id,
      receiverId: appointment.expertId,
    };

    const messageResponse = await api.post("/messages/send", messageData, {
      headers: {
        Authorization: `Bearer ${api.defaults.headers.common["Authorization"]}`,
      },
    });

    console.log("消息发送测试结果:", {
      status: messageResponse.status,
      messageId: messageResponse.data?._id,
    });

    // 4. 测试获取聊天历史
    console.log("\n测试获取聊天历史...");
    const historyResponse = await api.get(
      `/messages/appointment/${appointment._id}`,
      {
        headers: {
          Authorization: `Bearer ${api.defaults.headers.common["Authorization"]}`,
        },
      }
    );

    console.log("聊天历史测试结果:", {
      status: historyResponse.status,
      messageCount: historyResponse.data?.length,
    });

    // 5. 测试WebSocket消息接收
    ws.on("message", (data) => {
      const message = JSON.parse(data);
      console.log("收到 WebSocket 消息:", message);
    });

    // 发送测试WebSocket消息
    ws.send(
      JSON.stringify({
        type: "chat",
        data: {
          appointmentId: appointment._id,
          content: "WebSocket 测试消息",
        },
      })
    );

    // 等待3秒后关闭连接
    await new Promise((resolve) => setTimeout(resolve, 3000));
    ws.close();

    console.log("\n预约聊天功能测试完成！");
  } catch (error) {
    console.error("\n测试过程中出现错误:");
    console.error("错误类型:", error.name);
    console.error("错误信息:", error.message);
    if (error.response) {
      console.error("服务器响应:", {
        status: error.response.status,
        data: error.response.data,
      });
    }
  }
}

module.exports = { testAppointmentChat };
