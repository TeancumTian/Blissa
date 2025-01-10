const Expert = require("../models/Expert");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const User = require("../models/User");

class ExpertController {
  // 获取所有专家列表
  async getAllExperts(req, res) {
    try {
      const experts = await Expert.find()
        .select("name specialty description rating profileImage")
        .lean();

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

      const expert = await Expert.findById(expertId)
        .select("name specialty description rating profileImage availability")
        .lean();

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

      // 获取指定日期的预约情况
      const appointments = await Appointment.find({
        expertId,
        date: {
          $gte: new Date(date),
          $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
      }).select("timeSlot");

      // 获取已预约的时间段
      const bookedSlots = appointments.map((apt) => apt.timeSlot);

      // 根据星期几获取可用时间段
      const dayOfWeek = new Date(date).toLocaleString("en-us", {
        weekday: "long",
      });
      const dayAvailability = expert.availability.find(
        (a) => a.day === dayOfWeek
      );

      // 过滤掉已预约的时间段
      const availableSlots = dayAvailability
        ? dayAvailability.slots.filter((slot) => !bookedSlots.includes(slot))
        : [];

      res.json({ availableSlots });
    } catch (error) {
      console.error("获取专家可用时间错误:", error);
      res.status(500).json({ error: "获取可用时间失败" });
    }
  }

  // 创建预约
  async createAppointment(req, res) {
    try {
      const { expertId, date, timeSlot } = req.body;
      const userId = req.user._id;

      // 验证时间段是否可用
      const existingAppointment = await Appointment.findOne({
        expertId,
        date,
        timeSlot,
      });

      if (existingAppointment) {
        return res.status(400).json({ error: "该时间段已被预约" });
      }

      const appointment = new Appointment({
        userId,
        expertId,
        date,
        timeSlot,
        status: "pending",
      });

      await appointment.save();

      res.status(201).json(appointment);
    } catch (error) {
      console.error("创建预约错误:", error);
      res.status(500).json({ error: "创建预约失败" });
    }
  }

  // 更新预约状态
  async updateAppointmentStatus(req, res) {
    try {
      const { appointmentId } = req.params;
      const { status } = req.body;
      const expertId = req.user._id;

      const appointment = await Appointment.findOneAndUpdate(
        { _id: appointmentId, expertId },
        { status },
        { new: true }
      );

      if (!appointment) {
        return res.status(404).json({ error: "预约不存在" });
      }

      res.json(appointment);
    } catch (error) {
      console.error("更新预约状态错误:", error);
      res.status(500).json({ error: "更新预约状态失败" });
    }
  }

  // 获取专家的所有预约
  async getExpertAppointments(req, res) {
    try {
      const expertId = req.user._id;

      const appointments = await Appointment.find({ expertId })
        .populate("userId", "name email")
        .sort({ date: 1 });

      res.json(appointments);
    } catch (error) {
      console.error("获取预约列表错误:", error);
      res.status(500).json({ error: "获取预约列表失败" });
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

  // 获取单个预约详情
  async getAppointmentById(req, res) {
    try {
      const { appointmentId } = req.params;
      const expertId = req.user._id;

      const appointment = await Appointment.findOne({
        _id: appointmentId,
        expertId,
      }).populate("userId", "name email");

      if (!appointment) {
        return res.status(404).json({ error: "预约不存在" });
      }

      res.json(appointment);
    } catch (error) {
      console.error("获取预约详情错误:", error);
      res.status(500).json({ error: "获取预约详情失败" });
    }
  }

  // 获取专家信息
  async getExpertProfile(req, res) {
    try {
      const expertId = req.user._id;
      const expert = await Expert.findById(expertId);

      if (!expert) {
        return res.status(404).json({ error: "专家信息不存在" });
      }

      res.json(expert);
    } catch (error) {
      console.error("获取专家信息错误:", error);
      res.status(500).json({ error: "获取专家信息失败" });
    }
  }
}

module.exports = new ExpertController();
