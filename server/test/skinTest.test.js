const axios = require("axios");
const { getUser } = require("../database.js");
require("dotenv").config();

// 创建一个带认证的 axios 实例
const api = axios.create({
  baseURL: "http://localhost:3000/api/skintest",
  withCredentials: true,
});

async function testSkinTest() {
  try {
    console.log("开始测试皮肤测试功能...");

    // 0. 获取测试用户
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

    // 1. 测试基本连接
    try {
      console.log("\n测试 1: 检查服务器连接");
      const response = await api.get("/test");
      console.log("服务器连接状态:", response.status);
      console.log("服务器响应:", response.data);
    } catch (error) {
      console.error("服务器连接测试失败:", {
        status: error.response?.status,
        message: error.message,
      });
    }

    // 2. 测试皮肤测试提交
    try {
      console.log("\n测试 2: 提交皮肤测试");
      const testData = {
        answers: [
          "Balanced and comfortable",
          "Somewhat noticeable",
          "Rarely",
          "T-zone only",
          "Sometimes on cheeks",
          "Very few/around eyes",
          "Daily",
          "Sometimes",
          "Sometimes",
          "A little",
          "No",
          "Gets oilier in summer",
        ],
        userId: testUser._id, // 使用实际用户ID
      };

      const submitResponse = await api.post("/submit", testData);
      console.log("测试提交响应:", {
        status: submitResponse.status,
        skinType: submitResponse.data.result.skinType,
        hasDescription: !!submitResponse.data.result.description,
      });
    } catch (error) {
      console.error("皮肤测试提交失败:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response) {
        console.log("完整错误响应:", {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
        });
      }
    }

    // 3. 测试获取历史记录
    try {
      console.log("\n测试 3: 获取测试历史");
      const historyResponse = await api.get("/history");

      console.log("历史记录获取状态:", historyResponse.status);
      console.log("测试历史数量:", historyResponse.data.length);
      if (historyResponse.data.length > 0) {
        console.log("最新测试结果:", {
          skinType: historyResponse.data[0].result.skinType,
          timestamp: historyResponse.data[0].result.timestamp,
        });
      }
    } catch (error) {
      console.error("历史记录获取失败:", {
        status: error.response?.status,
        message: error.message,
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
    console.log("4. 确认所有必要的环境变量已设置");
  }
}

// 运行测试前的环境检查
console.log("测试环境检查:");
console.log("1. NODE_ENV:", process.env.NODE_ENV || "development");
console.log(
  "2. 数据库连接:",
  !!require("../dbConfig.json") ? "已配置" : "未配置"
);

// 运行测试
testSkinTest();
