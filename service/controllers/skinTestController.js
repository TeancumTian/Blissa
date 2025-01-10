const SkinTest = require("../models/SkinTest");

// Questions array defined outside the class
const questions = [
  {
    question: "How does your skin typically feel?",
    options: [
      "Balanced and comfortable",
      "Dry and tight",
      "Oily in some areas, normal in others",
    ],
  },
  {
    question: "What is the condition of your pores?",
    options: ["Very visible", "Somewhat visible", "Barely visible"],
  },
  {
    question: "How often do you experience breakouts?",
    options: ["Rarely", "Occasionally", "Frequently"],
  },
  {
    question: "Does your skin produce oil after cleansing?",
    options: ["All over", "Only in T-zone", "Rarely"],
  },
  {
    question: "Do you experience skin tightness or dryness?",
    options: ["Rarely", "In cheek areas", "Frequently"],
  },
  {
    question: "Do you have fine lines and wrinkles?",
    options: ["None", "Around eyes", "Noticeable"],
  },
  {
    question: "How often do you use skincare products?",
    options: ["Never", "2-3 times per week", "Daily"],
  },
  {
    question: "Do you have uneven skin tone or pigmentation?",
    options: ["Rarely", "Some", "Significant"],
  },
  {
    question: "Does your skin react to certain skincare products?",
    options: ["Never", "Occasionally", "Frequently"],
  },
  {
    question: "Does your skin produce excess oil?",
    options: ["No", "Somewhat", "Yes"],
  },
  {
    question: "Do you have fine lines around your eyes?",
    options: ["No", "Some", "Noticeable"],
  },
  {
    question: "How does your skin react to seasonal changes?",
    options: ["Stays the same", "Drier in winter", "Oilier in summer"],
  },
];

class SkinTestController {
  async submitTest(req, res) {
    try {
      const { answers } = req.body;
      const userId = req.user._id;

      console.log("Received answers:", answers);
      console.log("Questions array:", questions);

      if (!Array.isArray(answers)) {
        return res.status(400).json({
          error: "Invalid answer format",
          details: "Answers must be an array",
        });
      }

      const skinTest = new SkinTest({
        userId,
        answers: answers.map((answer, index) => {
          if (!questions[index]) {
            throw new Error(`Question index ${index} out of range`);
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
      console.error("Skin test submission error:", error);
      res.status(500).json({
        error: "Failed to submit test",
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

    // Enhanced scoring algorithm
    answers.forEach((answer, index) => {
      switch (index) {
        case 0: // Skin feel
          if (answer === 0) scores.normal += 3;
          if (answer === 1) scores.dry += 3;
          if (answer === 2) scores.combination += 3;
          break;
        case 1: // Pores
          if (answer === 0) scores.oily += 2;
          if (answer === 1) scores.combination += 1;
          if (answer === 2) scores.normal += 2;
          break;
        case 2: // Breakouts
          if (answer === 2) {
            scores.oily += 2;
            scores.sensitive += 1;
          }
          if (answer === 0) scores.normal += 2;
          break;
        case 3: // Oil production
          if (answer === 0) scores.oily += 3;
          if (answer === 1) scores.combination += 3;
          if (answer === 2) {
            scores.normal += 1;
            scores.dry += 1;
          }
          break;
        case 4: // Tightness/dryness
          if (answer === 2) {
            scores.dry += 3;
            scores.sensitive += 1;
          }
          if (answer === 1) scores.combination += 2;
          break;
        case 5: // Fine lines/wrinkles
          if (answer === 2) scores.agingMature += 3;
          if (answer === 1) scores.agingMature += 1;
          break;
        case 6: // Skincare usage
          if (answer === 0) scores.normal += 1;
          if (answer === 2) scores.sensitive += 1;
          break;
        case 7: // Pigmentation
          if (answer === 2) {
            scores.agingMature += 2;
            scores.sensitive += 1;
          }
          break;
        case 8: // Product reactions
          if (answer === 2) scores.sensitive += 3;
          if (answer === 1) scores.sensitive += 1;
          break;
        case 9: // Excess oil
          if (answer === 2) scores.oily += 3;
          if (answer === 1) scores.combination += 2;
          break;
        case 10: // Eye area
          if (answer === 2) scores.agingMature += 2;
          if (answer === 1) scores.agingMature += 1;
          break;
        case 11: // Seasonal changes
          if (answer === 1) {
            scores.dry += 2;
            scores.sensitive += 1;
          }
          if (answer === 2) {
            scores.oily += 2;
            scores.combination += 1;
          }
          break;
      }
    });

    // Find the dominant skin type
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
      normal: [
        "Your skin is well-balanced",
        "Minimal issues with oil or dryness",
        "Fine pores and even skin tone",
      ],
      dry: [
        "Your skin tends to feel tight",
        "May show fine lines",
        "Needs extra hydration",
      ],
      oily: [
        "Your skin produces excess oil",
        "Prone to breakouts",
        "Requires oil control",
      ],
      combination: [
        "Oily T-zone with dry cheeks",
        "Mixed skin concerns",
        "Needs targeted care",
      ],
      sensitive: [
        "Your skin is easily irritated",
        "Reactive to products",
        "Requires gentle care",
      ],
      agingMature: [
        "Shows signs of aging",
        "Decreased elasticity",
        "Needs anti-aging care",
      ],
    };
    return descriptions[skinType] || [];
  }
}

module.exports = new SkinTestController();
