const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
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

userSchema.index(
  { email: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 },
  }
);

userSchema.pre("save", function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

userSchema.pre("findOne", function (next) {
  if (this._conditions.email) {
    this._conditions.email = this._conditions.email.toLowerCase().trim();
  }
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
