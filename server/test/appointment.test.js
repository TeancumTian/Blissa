const axios = require("axios");
const { createUser, getUser } = require("../database.js");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  validateStatus: () => true, // 允许所有状态码
});

async function testAppointment() {
  try {
    console.log("开始测试预约功能...");

    // 1. 创建测试用户
    let testUser = await getUser("test@example.com");
    if (!testUser) {
      console.log("创建测试用户...");
      testUser = await createUser("test@example.com", "testpassword123");
    }

    // 设置认证头
    api.defaults.headers.common["Authorization"] = `Bearer ${testUser.token}`;

    // 2. 测试获取专家列表
    console.log("\n测试获取专家列表...");
    const expertsResponse = await api.get("/experts");
    console.log("专家列表测试结果:", {
      status: expertsResponse.status,
      expertsCount: expertsResponse.data.length,
    });

    if (expertsResponse.data.length === 0) {
      throw new Error("没有可用的专家");
    }

    // 3. 测试创建预约
    console.log("\n测试创建预约...");
    const appointmentData = {
      expertId: expertsResponse.data[0]._id,
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // 明天
      timeSlot: "09:00-10:00",
      notes: "测试预约",
    };

    const appointmentResponse = await api.post(
      "/experts/appointment",
      appointmentData
    );
    console.log("预约创建测试结果:", {
      status: appointmentResponse.status,
      appointmentId: appointmentResponse.data?._id,
    });

    if (appointmentResponse.status === 201) {
      // 4. 测试获取预约详情
      console.log("\n测试获取预约详情...");
      const appointmentDetailsResponse = await api.get(
        `/experts/appointment/${appointmentResponse.data._id}`
      );
      console.log("预约详情测试结果:", {
        status: appointmentDetailsResponse.status,
        hasDetails: !!appointmentDetailsResponse.data,
      });
    }

    console.log("\n预约功能测试完成！");
    return appointmentResponse.data; // 返回预约数据供聊天测试使用
  } catch (error) {
    console.error("\n测试过程中出现错误:");
    console.error("错误类型:", error.name);
    console.error("错误信息:", error.message);
    if (error.response) {
      console.error("服务器响应:", {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  }
}

module.exports = { testAppointment };
