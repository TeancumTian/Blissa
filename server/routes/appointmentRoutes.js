const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const auth = require("../middleware/auth");

// 获取用户的所有预约
router.get("/", auth, appointmentController.getUserAppointments);

// 获取单个预约详情
router.get("/:appointmentId", auth, appointmentController.getAppointmentById);

// 取消预约
router.patch(
  "/:appointmentId/cancel",
  auth,
  appointmentController.cancelAppointment
);

module.exports = router;
