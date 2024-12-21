const mongoose = require("mongoose");

const skinTestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      questionId: Number,
      question: String,
      answer: String,
    },
  ],
  result: {
    skinType: {
      type: String,
      enum: [
        "normal",
        "dry",
        "oily",
        "combination",
        "sensitive",
        "agingMature",
      ],
    },
    summary: String,
    description: [String],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
});

module.exports = mongoose.model("SkinTest", skinTestSchema);
