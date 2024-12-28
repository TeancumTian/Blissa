const express = require("express");
const router = express.Router();
const expertController = require("../controllers/expertController");
const auth = require("../middleware/auth");

// 获取所有专家
router.get("/", auth, expertController.getExperts);

// 获取预约列表
router.get("/appointments", auth, expertController.getAppointments);

// 获取单个专家详情
router.get("/:expertId", auth, expertController.getExpertById);

// 获取专家可用时间
router.get(
  "/:expertId/availability",
  auth,
  expertController.getExpertAvailability
);

// 创建预约
router.post("/appointment", auth, expertController.createAppointment);

// 获取单个预约详情
router.get(
  "/appointment/:appointmentId",
  auth,
  expertController.getAppointmentById
);

module.exports = router;
