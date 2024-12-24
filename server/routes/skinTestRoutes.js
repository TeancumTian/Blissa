const express = require("express");
const router = express.Router();
const skinTestController = require("../controllers/skinTestController");
const auth = require("../middleware/auth");
const SkinTest = require("../models/SkinTest");

// 所有路由都需要认证
router.use(auth);

router.post("/submit", skinTestController.submitTest.bind(skinTestController));
router.get(
  "/latest",
  skinTestController.getLatestTest.bind(skinTestController)
);

router.put("/update", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { result } = req.body;

    const updatedTest = await SkinTest.findOneAndUpdate(
      { userId },
      {
        $set: {
          "result.gptAnalysis": result.gptAnalysis,
          "result.followUpQuestions": result.followUpQuestions,
        },
      },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ error: "测试结果未找到" });
    }

    res.json({ success: true, result: updatedTest.result });
  } catch (error) {
    console.error("更新测试结果错误:", error);
    res.status(500).json({ error: "更新失败" });
  }
});

module.exports = router;
