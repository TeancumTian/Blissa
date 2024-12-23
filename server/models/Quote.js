const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "匿名",
    },
    category: {
      type: String,
      enum: ["skincare", "wellness", "confidence", "health", "beauty"],
      default: "skincare",
    },
    language: {
      type: String,
      enum: ["zh", "en"],
      default: "zh",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quote", quoteSchema);
