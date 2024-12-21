const axios = require("axios");

async function testServer() {
  try {
    console.log("开始服务器测试...");
    console.log("测试环境:", process.env.NODE_ENV || "development");

    // 1. 测试服务器基本连接
    try {
      console.log("\n测试 1: 检查服务器基本连接");
      const testResponse = await axios.get("http://localhost:3000/api/test", {
        validateStatus: function (status) {
          return status < 500; // 允许任何小于500的状态码
        },
      });

      console.log("服务器响应状态:", testResponse.status);
      console.log("服务器响应数据:", testResponse.data);

      if (testResponse.status === 401) {
        console.log("警告: 收到401未授权响应，检查认证配置");
      }
    } catch (error) {
      console.error("基本连接测试详细错误:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
        },
      });

      if (error.code === "ECONNREFUSED") {
        throw new Error("服务器未启动或端口不可访问");
      }
      throw new Error(`服务器连接测试失败: ${error.message}`);
    }
  } catch (error) {
    console.error("\n测试失败:");
    console.error("错误类型:", error.name);
    console.error("错误信息:", error.message);

    // 检查服务器状态
    console.log("\n诊断信息:");
    try {
      const { execSync } = require("child_process");
      console.log("检查端口 3000 使用情况:");
      console.log(execSync("lsof -i :3000").toString());
    } catch (e) {
      console.log("端口 3000 似乎没有被使用");
    }

    console.log("\n可能的解决方案:");
    console.log("1. 确保服务器已启动 (node server/index.js)");
    console.log("2. 检查 index.js 中的路由配置");
    console.log("3. 确认 /api/test 路由未被认证中间件拦截");
    console.log("4. 检查是否有其他服务占用端口 3000");

    process.exit(1);
  }
}

// 运行测试前检查服务器状态
console.log("启动前检查:");
console.log("1. 当前工作目录:", process.cwd());
console.log("2. Node.js 版本:", process.version);
console.log("3. 环境变量:", {
  NODE_ENV: process.env.NODE_ENV || "未设置",
  PORT: process.env.PORT || "3000 (默认)",
});

testServer();
