const ExpertMessage = require("../models/ExpertMessage");
const Appointment = require("../models/Appointment");

class ExpertChatController {
  async getChatHistory(req, res) {
    try {
      const { appointmentId } = req.params;
      const userId = req.user._id;

      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ error: "预约不存在" });
      }

      if (
        appointment.userId.toString() !== userId.toString() &&
        appointment.expertId.toString() !== userId.toString()
      ) {
        return res.status(403).json({ error: "无权访问此对话" });
      }

      const messages = await ExpertMessage.find({ appointmentId }).sort({
        timestamp: 1,
      });

      res.json(messages);
    } catch (error) {
      console.error("获取专家聊天记录错误:", error);
      res.status(500).json({ error: "获取聊天记录失败" });
    }
  }

  async sendMessage(req, res) {
    try {
      const { appointmentId, content } = req.body;
      const senderId = req.user._id;

      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ error: "预约不存在" });
      }

      if (
        appointment.userId.toString() !== senderId.toString() &&
        appointment.expertId.toString() !== senderId.toString()
      ) {
        return res.status(403).json({ error: "无权发送消息" });
      }

      const message = new ExpertMessage({
        appointmentId,
        senderId,
        content,
        timestamp: new Date(),
      });

      await message.save();

      const receiverId =
        appointment.userId.toString() === senderId.toString()
          ? appointment.expertId.toString()
          : appointment.userId.toString();

      if (req.app.get("expertChatService")) {
        req.app.get("expertChatService").sendMessageToUser(receiverId, {
          type: "expert-chat",
          appointmentId,
          message,
        });
      }

      res.status(201).json(message);
    } catch (error) {
      console.error("发送专家聊天消息错误:", error);
      res.status(500).json({ error: "发送消息失败" });
    }
  }
}

module.exports = new ExpertChatController();
