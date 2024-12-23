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
    name: String,
    avatar: String,
    role: {
      type: String,
      enum: ["user", "expert", "admin"],
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
