const mongoose = require("mongoose");
const Quote = require("../models/Quote");
const defaultQuotes = require("../data/quotes");

async function initQuotes() {
  try {
    // 检查数据库连接状态
    if (mongoose.connection.readyState !== 1) {
      console.log("等待数据库连接...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 检查是否已有语录
    const count = await Quote.countDocuments();
    console.log(`当前数据库中有 ${count} 条语录`);

    if (count === 0) {
      console.log("正在初始化语录数据...");
      await Quote.insertMany(defaultQuotes);
      console.log(`成功初始化 ${defaultQuotes.length} 条语录！`);
    }
  } catch (error) {
    console.error("初始化语录失败:", error);
  }
}

// 立即执行初始化
initQuotes();

module.exports = initQuotes;
