const axios = require("axios");

async function testServer() {
  try {
    // 测试用户创建
    const createResponse = await axios.post(
      "http://localhost:3000/api/auth/create",
      {
        email: "test@example.com",
        password: "password123",
      }
    );
    console.log(
      "用户创建测试:",
      createResponse.status === 200 ? "通过" : "失败"
    );

    // 测试登录
    const loginResponse = await axios.post(
      "http://localhost:3000/api/auth/login",
      {
        email: "test@example.com",
        password: "password123",
      }
    );
    console.log("登录测试:", loginResponse.status === 200 ? "通过" : "失败");
  } catch (error) {
    console.error("测试失败:", error.message);
  }
}

testServer();
