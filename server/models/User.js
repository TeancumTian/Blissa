const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    avatar: String,
    role: {
      type: String,
      enum: ["user", "expert"],
      default: "user",
    },
    skinTestResults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SkinTest",
      },
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    phoneNumber: {
      type: String,
    },
    preferences: {
      language: {
        type: String,
        enum: ["en", "zh"],
        default: "en",
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
