const SkinTest = require("../models/SkinTest");

// 确保 questions 数组在类外部定义
const questions = [
  {
    question: "您的皮肤通常感觉如何？",
    options: ["平衡舒适", "干燥紧绷", "某些部位油腻，其他部位正常"],
  },
  {
    question: "您的毛孔状况如何？",
    options: ["非常明显", "有些明显", "不太明显"],
  },
  {
    question: "您是否容易长痘？",
    options: ["很少", "偶尔", "经常"],
  },
  {
    question: "洗脸后皮肤会持续出油吗？",
    options: ["部分区域都会", "仅T区会", "很少出油"],
  },
  {
    question: "您的皮肤会感觉紧绷干燥吗？",
    options: ["很少", "脸颊部位会", "经常"],
  },
  {
    question: "您有细纹和皱纹吗？",
    options: ["完全没有", "眼部有一些", "比较明显"],
  },
  {
    question: "您多久使用一次护肤品？",
    options: ["从不使用", "每周2-3次", "每天使用"],
  },
  {
    question: "您的肤色是否不均匀，有色斑？",
    options: ["很少", "有一些", "比较多"],
  },
  {
    question: "您的皮肤对某些护肤品是否会过敏？",
    options: ["从不", "偶尔", "经常"],
  },
  {
    question: "您的皮肤会分泌过多油脂吗？",
    options: ["不会", "有一点", "会"],
  },
  {
    question: "您的眼部是否有细纹？",
    options: ["没有", "有", "比较明显"],
  },
  {
    question: "季节变化时您的皮肤会有什么反应？",
    options: ["保持不变", "冬天更干", "夏天更油"],
  },
];

class SkinTestController {
  async submitTest(req, res) {
    try {
      const { answers } = req.body;
      const userId = req.user._id;

      console.log("收到的答案:", answers); // 添加调试日志
      console.log("问题数组:", questions); // 添加调试日志

      // 验证答案数组
      if (!Array.isArray(answers)) {
        return res.status(400).json({
          error: "答案格式错误",
          details: "answers 必须是数组",
        });
      }

      // 创建新的测试记录
      const skinTest = new SkinTest({
        userId,
        answers: answers.map((answer, index) => {
          // 添加安全检查
          if (!questions[index]) {
            throw new Error(`问题索引 ${index} 超出范围`);
          }
          return {
            questionId: index + 1,
            question: questions[index].question,
            answer: questions[index].options[answer],
          };
        }),
        result: {
          skinType: this.analyzeSkinType(answers).skinType,
          description: this.getSkinTypeDescription(
            this.analyzeSkinType(answers).skinType
          ),
          timestamp: new Date(),
        },
      });

      await skinTest.save();

      res.json({
        success: true,
        result: skinTest.result,
      });
    } catch (error) {
      console.error("皮肤测试提交错误:", error);
      res.status(500).json({
        error: "提交测试失败",
        details: error.message,
      });
    }
  }

  async getLatestTest(req, res) {
    try {
      const userId = req.user._id;
      const latestTest = await SkinTest.findOne({ userId })
        .sort({ "result.timestamp": -1 })
        .select("result");

      res.json({
        success: true,
        result: latestTest ? latestTest.result : null,
      });
    } catch (error) {
      console.error("Error fetching latest test:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // 分析皮肤类型的方法
  analyzeSkinType(answers) {
    // 初始化各种皮肤类型的得分
    const scores = {
      normal: 0,
      dry: 0,
      oily: 0,
      combination: 0,
      sensitive: 0,
      agingMature: 0,
    };

    // 根据答案计算得分
    answers.forEach((answer, index) => {
      switch (index) {
        case 0: // 皮肤感觉
          if (answer === 0) scores.normal += 2;
          if (answer === 1) scores.dry += 2;
          if (answer === 2) scores.combination += 2;
          break;
        case 1: // 毛孔状况
          if (answer === 0) scores.oily += 2;
          if (answer === 2) scores.normal += 1;
          break;
        case 2: // 长痘情况
          if (answer === 2) scores.oily += 2;
          if (answer === 0) scores.normal += 1;
          break;
        case 3: // 出油情况
          if (answer === 0) scores.oily += 2;
          if (answer === 1) scores.combination += 2;
          break;
        case 4: // 紧绷干燥
          if (answer === 2) scores.dry += 2;
          if (answer === 1) scores.combination += 1;
          break;
        case 5: // 细纹皱纹
          if (answer === 2) scores.agingMature += 2;
          break;
        case 6: // 护肤品使用
          if (answer === 0) scores.normal += 1;
          break;
        case 7: // 色斑
          if (answer === 2) scores.agingMature += 1;
          break;
        case 8: // 过敏
          if (answer === 2) scores.sensitive += 2;
          break;
        case 9: // 油脂分泌
          if (answer === 2) scores.oily += 2;
          break;
        case 10: // 眼部细纹
          if (answer === 2) scores.agingMature += 2;
          break;
        case 11: // 季节变化
          if (answer === 1) scores.dry += 1;
          if (answer === 2) scores.oily += 1;
          break;
      }
    });

    // 找出得分最高的皮肤类型
    const skinType = Object.entries(scores).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    return {
      skinType,
      description: this.getSkinTypeDescription(skinType),
    };
  }

  getTestSummary(answers) {
    // 从前端复制 getTestSummary 函数的逻辑
    // 参考前端代码 startLine: 144, endLine: 155
  }

  // 获取皮肤类型描述的方法
  getSkinTypeDescription(skinType) {
    const descriptions = {
      normal: ["您的皮肤状态平衡", "不易出现油光或干燥", "毛孔细腻，肤色均匀"],
      dry: ["您的皮肤容易感到紧绷", "可能出现细小皱纹", "需要额外保湿护理"],
      oily: ["您的皮肤易出油，毛孔粗大", "容易长痘痘", "需要控油护理"],
      combination: ["您的T区易出油", "脸颊偏干", "需要针对性护理"],
      sensitive: ["您的皮肤容易泛红发痒", "对护肤品敏感", "需要温和护理"],
      agingMature: ["您的皮肤有细纹和皱纹", "弹性下降", "需要抗衰老护理"],
    };
    return descriptions[skinType] || [];
  }
}

module.exports = new SkinTestController();
