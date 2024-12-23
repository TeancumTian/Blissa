const Expert = require("../models/Expert");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");

class ExpertController {
  // 获取所有专家列表
  async getAllExperts(req, res) {
    try {
      console.log("开始获取专家列表");

      // 检查数据库连接
      if (mongoose.connection.readyState !== 1) {
        console.error("数据库未连接");
        return res.status(500).json({ error: "数据库连接错误" });
      }

      // 查询专家列表
      const experts = await Expert.find({}).lean();
      console.log("查询到的专家数量:", experts.length);

      if (!experts || experts.length === 0) {
        console.log("未找到专家数据");
        return res.json([]);
      }

      console.log(
        "成功获取专家列表:",
        experts.map((e) => ({
          name: e.name,
          specialty: e.specialty,
        }))
      );

      res.json(experts);
    } catch (error) {
      console.error("获取专家列表错误:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      res.status(500).json({
        error: "服务器错误",
        details: error.message,
      });
    }
  }

  // 获取专家可用时间段
  async getExpertAvailability(req, res) {
    try {
      const { expertId } = req.params;
      const expert = await Expert.findById(expertId);
      if (!expert) {
        return res.status(404).json({ error: "专家不存在" });
      }
      res.json(expert.availability);
    } catch (error) {
      console.error("获取专家时间段错误:", error);
      res.status(500).json({ error: "服务器错误" });
    }
  }

  // 创建预约
  async createAppointment(req, res) {
    try {
      const { expertId, date, timeSlot, notes } = req.body;
      const userId = req.user._id;

      const expert = await Expert.findById(expertId);
      if (!expert) {
        return res.status(404).json({ error: "专家不存在" });
      }

      const appointment = new Appointment({
        userId,
        expertId,
        date,
        timeSlot,
        notes,
        status: "pending",
      });

      await appointment.save();
      res.status(201).json(appointment);
    } catch (error) {
      console.error("创建预约错误:", error);
      res.status(500).json({ error: "服务器错误" });
    }
  }

  // 更新预约状态
  async updateAppointmentStatus(req, res) {
    try {
      const { appointmentId, status } = req.body;
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({ error: "预约不存在" });
      }

      // 验证权限
      if (appointment.expertId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "无权更新此预约" });
      }

      appointment.status = status;
      await appointment.save();

      res.json(appointment);
    } catch (error) {
      console.error("更新预约状态错误:", error);
      res.status(500).json({ error: "服务器错误" });
    }
  }

  // 获取专家的所有预约
  async getExpertAppointments(req, res) {
    try {
      const appointments = await Appointment.find({ expertId: req.user._id })
        .populate("userId", "name email")
        .sort({ date: 1 });
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "服务器错误" });
    }
  }
}

module.exports = new ExpertController();
