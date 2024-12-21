const axios = require("axios");
require("dotenv").config();

async function testChatController() {
  try {
    console.log("开始测试 ChatController...");

    // 1. 测试基本聊天功能
    try {
      console.log("\n测试 1: 基本聊天请求");
      const chatResponse = await axios.post("http://localhost:3000/api/chat", {
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
      const chatWithTestResponse = await axios.post(
        "http://localhost:3000/api/chat",
        {
          message: "根据我的皮肤测试结果给出建议",
          skinTestResult: {
            summary: "混合性肌肤，T区偏油",
            skinType: "combination",
          },
        }
      );

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
      await axios.post("http://localhost:3000/api/chat", {
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
    console.log("1. 确保 .env 文件中设置了 OPENAI_API_KEY");
    console.log("2. 确保服务器正在运行");
    console.log("3. 检查网络连接");

    // 检查环境变量
    console.log("\n环境变量状态:");
    console.log(
      "OPENAI_API_KEY:",
      process.env.OPENAI_API_KEY ? "已设置" : "未设置"
    );
  }
}

// 运行测试
console.log("启动 ChatController 测试...");
console.log("环境:", process.env.NODE_ENV || "development");
console.log("API 密钥状态:", process.env.OPENAI_API_KEY ? "已设置" : "未设置");

testChatController();
