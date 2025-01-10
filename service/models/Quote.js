const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["en", "zh"],
      default: "en",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quote", quoteSchema);
