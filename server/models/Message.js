const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isAI: {
    type: Boolean,
    default: false,
  },
  followUpQuestions: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Message", messageSchema);
