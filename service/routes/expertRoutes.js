const express = require("express");
const router = express.Router();
const expertController = require("../controllers/expertController");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

// 公开路由 - 获取所有专家列表
router.get("/", expertController.getAllExperts);

// 需要验证的路由
const isExpert = checkRole("expert");

// 获取专家的所有预约
router.get(
  "/appointments",
  auth,
  isExpert,
  expertController.getExpertAppointments
);

// 获取单个预约详情
router.get(
  "/appointment/:appointmentId",
  auth,
  isExpert,
  expertController.getAppointmentById
);

// 更新预约状态
router.patch(
  "/appointment/:appointmentId",
  auth,
  isExpert,
  expertController.updateAppointmentStatus
);

// 获取专家信息
router.get("/profile", auth, isExpert, expertController.getExpertProfile);

// 获取单个专家详情（公开路由）
router.get("/:expertId", expertController.getExpertById);

// 获取专家可用时间
router.get("/:expertId/availability", expertController.getExpertAvailability);

// 需要验证的路由
router.post("/appointment", auth, expertController.createAppointment);

module.exports = router;
