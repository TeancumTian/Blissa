const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    description: {
      type: String,
    },
    availability: [
      {
        day: String,
        slots: [String],
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expert", expertSchema);
