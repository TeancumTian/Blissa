const express = require("express");
const router = express.Router();
const skinTestController = require("../controllers/skinTestController");
const auth = require("../middleware/auth");

// 所有路由都需要认证
router.use(auth);

router.post("/submit", skinTestController.submitTest.bind(skinTestController));
router.get(
  "/latest",
  skinTestController.getLatestTest.bind(skinTestController)
);

module.exports = router;
