const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quoteController");
const auth = require("../middleware/auth");
const Quote = require("../models/Quote");

// 获取随机名言 (无需认证)
router.get("/random", quoteController.getRandomQuote);

// 管理员路由 (需要认证)
router.post("/add", auth, quoteController.addQuote);
router.post("/import", auth, quoteController.importQuotes);

// 获取随机语录
router.get("/random", async (req, res) => {
  try {
    const { language = "en" } = req.query;

    // 从数据库随机获取一条语录
    const quotes = await Quote.aggregate([
      { $match: { language } },
      { $sample: { size: 1 } },
    ]);

    if (!quotes.length) {
      return res.status(404).json({
        message: "没有找到语录",
        fallback: {
          content: "Beauty comes from inner confidence.",
          category: "confidence",
          language: "en",
        },
      });
    }

    res.json(quotes[0]);
  } catch (error) {
    console.error("获取语录错误:", error);
    res.status(500).json({
      message: "服务器错误",
      fallback: {
        content: "Beauty comes from inner confidence.",
        category: "confidence",
        language: "en",
      },
    });
  }
});

module.exports = router;
