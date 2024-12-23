const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quoteController");
const auth = require("../middleware/auth");

// 获取随机名言 (无需认证)
router.get("/random", quoteController.getRandomQuote);

// 管理员路由 (需要认证)
router.post("/add", auth, quoteController.addQuote);
router.post("/import", auth, quoteController.importQuotes);

module.exports = router;
