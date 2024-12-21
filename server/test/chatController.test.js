const axios = require("axios");
const { getUser } = require("../database.js");
require("dotenv").config();

// 创建一个带认证的 axios 实例
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

async function testChatController() {
  try {
    console.log("启动 ChatController 测试...");
    console.log("环境:", process.env.NODE_ENV || "development");
    console.log(
      "API 密钥状态:",
      process.env.OPENAI_API_KEY ? "已设置" : "未设置"
    );

    // 获取测试用户并设置认证
    const testUser = await getUser("test@example.com");
    if (!testUser) {
      throw new Error("测试用户不存在，请先运行用户创建测试");
    }

    // 设置认证头
    api.defaults.headers.common["Authorization"] = `Bearer ${testUser.token}`;
    console.log("已设置用户认证:", {
      email: testUser.email,
      hasToken: !!testUser.token,
    });

    console.log("\n开始测试 ChatController...");

    // 1. 测试基本聊天功能
    try {
      console.log("\n测试 1: 基本聊天请求");
      const chatResponse = await api.post("/chat", {
        message: "什么是维生素C精华液？",
      });

      console.log("聊天响应状态:", chatResponse.status);
      console.log("AI 回复:", chatResponse.data.content);
      console.log("后续问题:", chatResponse.data.followUpQuestions);
    } catch (error) {
      console.error("基本聊天测试失败:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // 2. 测试带皮肤测试结果的聊天
    try {
      console.log("\n测试 2: 带皮肤测试结果的聊天");
      const chatWithTestResponse = await api.post("/chat", {
        message: "根据我的皮肤测试结果给出建议",
        skinTestResult: {
          summary: "混合性肌肤，T区偏油",
          skinType: "combination",
        },
      });

      console.log("带测试结果的聊天响应状态:", chatWithTestResponse.status);
      console.log("AI 个性化建议:", chatWithTestResponse.data.content);
    } catch (error) {
      console.error("带皮肤测试的聊天测试失败:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // 3. 测试错误处理
    try {
      console.log("\n测试 3: 错误处理");
      await api.post("/chat", {
        // 发送空消息测试错误处理
        message: "",
      });
    } catch (error) {
      console.log("错误处理测试结果:", {
        status: error.response?.status,
        error: error.response?.data?.error,
      });
    }
  } catch (error) {
    console.error("\n测试过程中出现错误:");
    console.error("错误类型:", error.name);
    console.error("错误信息:", error.message);

    console.log("\n诊断信息:");
    console.log("1. 确保服务器正在运行");
    console.log("2. 检查数据库连接");
    console.log("3. 验证用户认证是否正确");
    console.log("4. 确认 OpenAI API 密钥已设置");
  }
}

// 运行测试
testChatController();
