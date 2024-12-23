const express = require("express");
const router = express.Router();
const Expert = require("../models/Expert");
const expertController = require("../controllers/expertController");
const auth = require("../middleware/auth");

// 调试中间件
router.use((req, res, next) => {
  console.log("专家路由请求:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
  });
  next();
});

// 获取专家列表
router.get("/", expertController.getAllExperts);

// 获取专家可用时间
router.get("/:expertId/availability", expertController.getExpertAvailability);

// 创建预约（需要认证）
router.post("/appointment", auth, expertController.createAppointment);

router.put(
  "/appointment/:id/status",
  auth,
  expertController.updateAppointmentStatus
);
router.get("/appointments", auth, expertController.getExpertAppointments);

module.exports = router;
