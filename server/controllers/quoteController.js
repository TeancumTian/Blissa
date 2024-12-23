const Quote = require("../models/Quote");

class QuoteController {
  // 获取随机名言
  async getRandomQuote(req, res) {
    try {
      const { language = "zh", category } = req.query;

      // 构建查询条件
      const query = {
        active: true,
        language,
      };

      if (category) {
        query.category = category;
      }

      // 随机获取一条记录
      const count = await Quote.countDocuments(query);
      const random = Math.floor(Math.random() * count);
      const quote = await Quote.findOne(query).skip(random);

      if (!quote) {
        return res.status(404).json({ error: "未找到相关名言" });
      }

      res.json(quote);
    } catch (error) {
      console.error("获取随机名言错误:", error);
      res.status(500).json({ error: "服务器错误" });
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
