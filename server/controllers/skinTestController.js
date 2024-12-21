const SkinTest = require("../models/SkinTest");

class SkinTestController {
  async submitTest(req, res) {
    try {
      const { answers, userId } = req.body;

      // 分析皮肤类型
      const skinType = this.analyzeSkinType(answers);

      // 生成测试总结
      const summary = this.getTestSummary(answers);

      // 获取皮肤类型描述
      const description = this.getSkinTypeDescription(skinType);

      // 保存到数据库
      const skinTest = new SkinTest({
        userId,
        answers: answers.map((answer, index) => ({
          questionId: index + 1,
          question: questions[index].question,
          answer: answer,
        })),
        result: {
          skinType,
          summary,
          description,
        },
      });

      await skinTest.save();

      res.json({
        success: true,
        result: {
          skinType,
          summary,
          description,
        },
      });
    } catch (error) {
      console.error("Skin test submission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // ��析皮肤类型的逻辑移到后端
  analyzeSkinType(answers) {
    // 从前端复制 analyzeSkinType 函数的逻辑
    // 参考前端代码 startLine: 164, endLine: 237
  }

  getTestSummary(answers) {
    // 从前端复制 getTestSummary 函数的逻辑
    // 参考前端代码 startLine: 144, endLine: 155
  }

  getSkinTypeDescription(skinType) {
    // 从前端复制 getSkinTypeDescription 函数的逻辑
    // 参考前端代码 startLine: 239, endLine: 267
  }
}

module.exports = new SkinTestController();
