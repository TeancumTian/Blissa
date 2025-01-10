const mongoose = require("mongoose");
const Expert = require("../models/Expert");

const experts = [
  {
    name: "Dr. Sarah Chen",
    specialty: "皮肤科医生",
    description: "专注于治疗痤疮和色斑问题",
    availability: [
      {
        day: "Monday",
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      },
    ],
  },
  {
    name: "Lisa Wang",
    specialty: "美容师",
    description: "专注于面部护理和皮肤保养",
    availability: [
      {
        day: "Tuesday",
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      },
    ],
  },
];

const seedExperts = async () => {
  try {
    await Expert.deleteMany({});
    await Expert.insertMany(experts);
    console.log("专家数据添加成功");
  } catch (error) {
    console.error("添加专家数据失败:", error);
  }
};

module.exports = seedExperts;
