const Expert = require("../models/Expert");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");

class ExpertController {
  // 获取所有专家列表
  async getExperts(req, res) {
    try {
      const experts = await Expert.find({});
      res.json(experts);
    } catch (error) {
      console.error("获取专家列表错误:", error);
      res.status(500).json({ error: "获取专家列表失败" });
    }
  }

  // 获取单个专家详情
  async getExpertById(req, res) {
    try {
      const { expertId } = req.params;
      const expert = await Expert.findById(expertId);

      if (!expert) {
        return res.status(404).json({ error: "专家不存在" });
      }

      res.json(expert);
    } catch (error) {
      console.error("获取专家详情错误:", error);
      res.status(500).json({ error: "获取专家详情失败" });
    }
  }

  // 获取专家可用时间
  async getExpertAvailability(req, res) {
    try {
      const { expertId } = req.params;
      const { date } = req.query;

      const expert = await Expert.findById(expertId);
      if (!expert) {
        return res.status(404).json({ error: "专家不存在" });
      }

      // 获取已预约的时间段
      const bookedSlots = await Appointment.find({
        expertId,
        date,
        status: { $ne: "cancelled" },
      }).select("timeSlot");

      // 过滤掉已预约的时间段
      const availableSlots = expert.availability.map((day) => ({
        ...day,
        slots: day.slots.filter(
          (slot) => !bookedSlots.some((booked) => booked.timeSlot === slot)
        ),
      }));

      res.json(availableSlots);
    } catch (error) {
      console.error("获取专家可用时间错误:", error);
      res.status(500).json({ error: "获取专家可用时间失败" });
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

  // 添加获取预约列表的方法
  async getAppointments(req, res) {
    try {
      const userId = req.user._id;

      const appointments = await Appointment.find({ userId })
        .populate("expertId", "name specialty profileImage")
        .sort({ date: -1 });

      res.json(appointments);
    } catch (error) {
      console.error("获取预约列表错误:", error);
      res.status(500).json({ error: "获取预约列表失败" });
    }
  }
}

module.exports = new ExpertController();
