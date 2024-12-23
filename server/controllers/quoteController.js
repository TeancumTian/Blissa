const Quote = require("../models/Quote");

class QuoteController {
  // 获取随机名言
  async getRandomQuote(req, res) {
    try {
      const { language = "zh", category } = req.query;

      // 构建查询条件
      const query = { language };
      if (category) {
        query.category = category;
      }

      // 使用aggregate进行随机获取
      const quotes = await Quote.aggregate([
        { $match: query },
        { $sample: { size: 1 } },
      ]);

      if (!quotes || quotes.length === 0) {
        return res.status(404).json({
          error: "未找到相关名言",
          fallback: {
            content: "护肤不是一朝一夕的事，而是每一天的坚持。",
            category: "skincare",
            language: "zh",
          },
        });
      }

      res.json(quotes[0]);
    } catch (error) {
      console.error("获取随机名言错误:", error);
      res.status(500).json({
        error: "服务器错误",
        fallback: {
          content: "护肤不是一朝一夕的事，而是每一天的坚持。",
          category: "skincare",
          language: "zh",
        },
      });
    }
  }

  // 添加新名言
  async addQuote(req, res) {
    try {
      const { content, author, category, language } = req.body;

      const quote = new Quote({
        content,
        author,
        category,
        language,
      });

      await quote.save();
      res.status(201).json(quote);
    } catch (error) {
      console.error("添加名言错误:", error);
      res.status(500).json({ error: "服务器错误" });
    }
  }

  // 批量导入名言
  async importQuotes(req, res) {
    try {
      const { quotes } = req.body;
      const result = await Quote.insertMany(quotes);
      res.status(201).json({
        success: true,
        count: result.length,
      });
    } catch (error) {
      console.error("批量导入名言错误:", error);
      res.status(500).json({ error: "服务器错误" });
    }
  }
}

module.exports = new QuoteController();
