const mongoose = require("mongoose");
const Expert = require("../models/Expert");
const { getUser, createUser } = require("../database.js");
const config = require("../dbConfig.json");

async function testExpertData() {
  try {
    console.log("开始测试专家数据...");

    // 连接数据库
    const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
    await mongoose.connect(url);
    console.log("数据库连接成功");

    // 检查现有专家数据
    const existingExperts = await Expert.find({});
    console.log("现有专家数量:", existingExperts.length);
    console.log(
      "现有专家:",
      existingExperts.map((e) => ({
        name: e.name,
        specialty: e.specialty,
        _id: e._id,
      }))
    );

    if (existingExperts.length === 0) {
      // 如果没有专家数据，创建测试数据
      console.log("未找到专家数据，创建测试专家...");

      const testExperts = [
        {
          name: "张医生",
          specialty: "皮肤科医生",
          qualification: "主任医师",
          experience: "15年临床经验",
          description: "专注于痤疮、敏感肌肤治疗",
          availability: [
            {
              dayOfWeek: 1,
              timeSlots: ["09:00-10:00", "10:00-11:00", "14:00-15:00"],
            },
            {
              dayOfWeek: 3,
              timeSlots: ["09:00-10:00", "10:00-11:00", "14:00-15:00"],
            },
          ],
          rating: 4.8,
        },
        {
          name: "李医生",
          specialty: "美容皮肤科",
          qualification: "副主任医师",
          experience: "10年临床经验",
          description: "专注于抗衰老、皮肤美容治疗",
          availability: [
            {
              dayOfWeek: 2,
              timeSlots: ["09:00-10:00", "10:00-11:00", "14:00-15:00"],
            },
            {
              dayOfWeek: 4,
              timeSlots: ["09:00-10:00", "10:00-11:00", "14:00-15:00"],
            },
          ],
          rating: 4.9,
        },
      ];

      const createdExperts = await Expert.create(testExperts);
      console.log(
        "成功创建测试专家:",
        createdExperts.map((e) => e.name)
      );
    }

    // 再次检查专家数据
    const finalExperts = await Expert.find({});
    console.log("\n最终专家数据:");
    console.log(JSON.stringify(finalExperts, null, 2));
  } catch (error) {
    console.error("测试过程中出现错误:", error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("数据库连接已关闭");
    }
  }
}

// 运行测试
testExpertData();
