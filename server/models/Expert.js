const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
    availability: [
      {
        day: String,
        slots: [String],
      },
    ],
    profileImage: {
      type: String,
      default: "default.jpg",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expert", expertSchema);
