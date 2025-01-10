const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 用户注册和登录
router.post("/register", authController.register);
router.post("/login", authController.login);

// 专家注册
router.post("/register/expert", authController.registerExpert);

module.exports = router;
