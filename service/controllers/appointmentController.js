const Appointment = require("../models/Appointment");

class AppointmentController {
  // 获取用户的所有预约
  async getUserAppointments(req, res) {
    try {
      const userId = req.user._id;
      console.log("获取用户预约:", userId);

      const appointments = await Appointment.find({ userId })
        .populate("expertId", "name specialty")
        .sort({ date: -1 });

      console.log("找到预约:", appointments.length);
      res.json(appointments);
    } catch (error) {
      console.error("获取用户预约错误:", error);
      res.status(500).json({ error: "获取预约列表失败" });
    }
  }

  // 获取单个预约详情
  async getAppointmentById(req, res) {
    try {
      const { appointmentId } = req.params;
      const userId = req.user._id;

      const appointment = await Appointment.findOne({
        _id: appointmentId,
        userId,
      }).populate("expertId", "name specialty");

      if (!appointment) {
        return res.status(404).json({ error: "预约不存在" });
      }

      res.json(appointment);
    } catch (error) {
      console.error("获取预约详情错误:", error);
      res.status(500).json({ error: "获取预约详情失败" });
    }
  }

  // 取消预约
  async cancelAppointment(req, res) {
    try {
      const { appointmentId } = req.params;
      const userId = req.user._id;

      const appointment = await Appointment.findOneAndUpdate(
        {
          _id: appointmentId,
          userId,
          status: { $ne: "cancelled" }, // 只能取消未取消的预约
        },
        { status: "cancelled" },
        { new: true }
      );

      if (!appointment) {
        return res.status(404).json({ error: "预约不存在或已取消" });
      }

      res.json(appointment);
    } catch (error) {
      console.error("取消预约错误:", error);
      res.status(500).json({ error: "取消预约失败" });
    }
  }
}

module.exports = new AppointmentController();
