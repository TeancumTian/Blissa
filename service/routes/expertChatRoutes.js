const express = require("express");
const router = express.Router();
const expertChatController = require("../controllers/expertChatController");
const auth = require("../middleware/auth");

router.get("/:appointmentId", auth, expertChatController.getChatHistory);
router.post("/send", auth, expertChatController.sendMessage);

module.exports = router;
