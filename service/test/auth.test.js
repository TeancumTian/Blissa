const axios = require("axios");
const { getUser, createUser, getUserByToken } = require("../database.js");
require("dotenv").config();

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

async function testAuth() {
  try {
    console.log("开始测试认证功能...");

    // 1. 测试用户创建
    try {
      console.log("\n测试 1: 创建用户");
      const testUser = {
        email: "test@example.com",
        password: "Test123!@#",
      };

      const user = await createUser(testUser.email, testUser.password);
      console.log("用户创建成功:", {
        email: user.email,
        hasToken: !!user.token,
      });
    } catch (error) {
      console.error("用户创建失败:", error.message);
    }

    // 2. 测试用户查询
    try {
      console.log("\n测试 2: 查询用户");
      const user = await getUser("test@example.com");
      console.log("用户查询结果:", {
        found: !!user,
        email: user?.email,
        hasToken: !!user?.token,
      });
    } catch (error) {
      console.error("用户查询失败:", error.message);
    }

    // 3. 测试 Token 查询
    try {
      console.log("\n测试 3: Token 查询");
      const user = await getUser("test@example.com");
      if (user && user.token) {
        const userByToken = await getUserByToken(user.token);
        console.log("Token 查询结果:", {
          found: !!userByToken,
          email: userByToken?.email,
          tokenMatch: user.token === userByToken?.token,
        });
      }
    } catch (error) {
      console.error("Token 查询失败:", error.message);
    }
  } catch (error) {
    console.error("\n测试过程中出现错误:");
    console.error("错误类型:", error.name);
    console.error("错误信息:", error.message);

    console.log("\n诊断信息:");
    console.log("1. 确保服务器正在运行");
    console.log("2. 检查数据库连接");
    console.log("3. 验证数据库配置正确");
  }
}

// 运行测试前的环境检查
console.log("测试环境检查:");
console.log("1. NODE_ENV:", process.env.NODE_ENV || "development");
console.log(
  "2. 数据库配置:",
  !!require("../dbConfig.json") ? "已配置" : "未配置"
);

// 运行测试
testAuth();
