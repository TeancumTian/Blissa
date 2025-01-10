const { testAppointment } = require("./appointment.test.js");
const { testAppointmentChat } = require("./appointmentChat.test.js");

async function runTests() {
  try {
    console.log("开始运行测试套件...\n");

    // 运行预约测试
    console.log("=== 预约功能测试 ===");
    await testAppointment();
    console.log("\n");

    // 运行聊天测试
    console.log("=== 预约聊天功能测试 ===");
    await testAppointmentChat();
    console.log("\n");

    console.log("所有测试完成！");
  } catch (error) {
    console.error("\n测试套件执行失败:");
    console.error(error);
    process.exit(1);
  }
}

// 运行测试
runTests();
