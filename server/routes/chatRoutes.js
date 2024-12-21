const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/chat", chatController.handleChat.bind(chatController));

module.exports = router;
