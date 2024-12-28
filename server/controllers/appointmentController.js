const Appointment = require("../models/Appointment");
const { chatService } = require("../index");

class AppointmentController {
  // ... 其他方法 ...

  async startChat(req, res) {
    try {
      const { appointmentId } = req.params;
      const userId = req.user._id;

      const appointment = await Appointment.findById(appointmentId).populate(
        "expertId",
        "name"
      );

      if (!appointment) {
        return res.status(404).json({ error: "预约不存在" });
      }

      // 验证用户是否是预约的参与者
      if (appointment.userId.toString() !== userId.toString()) {
        return res.status(403).json({ error: "无权访问此预约的聊天" });
      }

      // 通知专家有新的聊天请求
      chatService.sendSystemNotification(
        appointment.expertId._id,
        `用户 ${req.user.name} 发起了聊天`
      );

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "启动聊天失败" });
    }
  }
}

module.exports = new AppointmentController();
