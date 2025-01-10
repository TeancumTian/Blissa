const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// 显式指定 .env 文件路径并加载
const envPath = path.join(__dirname, "..", ".env");
const result = dotenv.config({ path: envPath });

async function testConnection() {
  try {
    // 调试信息
    console.log("环境变量加载结果:", result);
    console.log(".env 文件路径:", envPath);

    // 读取并解析 .env 文件内容
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    console.log("直接解析的环境变量:", envConfig);

    // 手动设置环境变量（如果自动加载失败）
    Object.keys(envConfig).forEach((key) => {
      process.env[key] = envConfig[key];
    });

    // 验证环境变量
    if (!process.env.DB_HOST) {
      throw new Error("未设置 DB_HOST 环境变量");
    }

    const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;
    console.log("数据库连接 URL:", url);

    const client = new MongoClient(url);
    await client.connect();
    console.log("数据库连接成功！");

    const db = client.db(process.env.DB_NAME);
    const collections = await db.listCollections().toArray();
    console.log(
      "可用的集合:",
      collections.map((c) => c.name)
    );

    await client.close();
    console.log("连接已关闭");
  } catch (error) {
    console.error("连接测试失败:", error);
    console.log("环境变量状态:", {
      DB_HOST: process.env.DB_HOST || "未设置",
      DB_USER: process.env.DB_USER || "未设置",
      DB_PASSWORD: process.env.DB_PASSWORD || "未设置",
      DB_NAME: process.env.DB_NAME || "未设置",
    });
  }
}

testConnection();
