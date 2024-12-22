const axios = require("axios");
const { createUser, getUser } = require("../database.js");
const Message = require("../models/Message");
require("dotenv").config();

async function testChat() {
  try {
    console.log("开始测试聊天功能...");

    // 1. 创建测试用户（如果不存在）
    let testUser = await getUser("test@example.com");
    if (!testUser) {
      console.log("创建测试用户...");
      testUser = await createUser("test@example.com", "testpassword123");
    }

    if (!testUser || !testUser.token) {
      throw new Error("无法获取有效的测试用户");
    }

    console.log("测试用户token:", testUser.token);

    const api = axios.create({
      baseURL: "http://localhost:3000/api",
      headers: {
        Authorization: `Bearer ${testUser.token}`,
        "Content-Type": "application/json",
      },
    });

    // 2. 测试发送消息
    console.log("\n测试发送消息...");
    const chatResponse = await api.post("/chat", {
      message: "护肤品使用的正确顺序是什么？",
    });

    console.log("发送消息测试结果:", {
      status: chatResponse.status,
      hasContent: !!chatResponse.data.content,
      hasQuestions: chatResponse.data.followUpQuestions?.length > 0,
    });

    // 3. 测试获取历史记录
    console.log("\n测试获取历史记录...");
    const historyResponse = await api.get("/chat/history");

    console.log("获取历史记录测试结果:", {
      status: historyResponse.status,
      messageCount: historyResponse.data.length,
    });

    console.log("\n测试完成！");
  } catch (error) {
    console.error("\n测试失败:");
    if (error.response) {
      console.error("响应状态:", error.response.status);
      console.error("响应数据:", error.response.data);
    } else {
      console.error("错误信息:", error.message);
    }

    console.log("\n诊断建议:");
    console.log("1. 确保服务器正在运行 (http://localhost:3000)");
    console.log("2. 检查数据库连接是否正常");
    console.log("3. 确认 .env 文件中的配置是否正确");
    console.log("4. 验证用户认证中间件是否正确配置");
  }
}

// 运行测试
testChat();
