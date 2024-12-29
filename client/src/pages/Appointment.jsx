import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Appointment.module.css";
import Navbar from "../components/Navbar";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("未登录");
      }

      let user = { role: "user" };
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          user = JSON.parse(userStr);
        }
      } catch (e) {
        console.error("解析用户信息错误:", e);
      }

      console.log("当前用户角色:", user.role);

      const endpoint =
        user.role === "expert"
          ? "/api/experts/appointments"
          : "/api/appointments";

      console.log("使用的API端点:", endpoint);

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "获取预约列表失败");
      }

      const data = await response.json();
      setAppointments(data || []);
      setLoading(false);
    } catch (error) {
      console.error("获取预约列表错误:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loading}>加载中...</div>
      </div>
    );

  if (error)
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.error}>错误: {error}</div>
      </div>
    );

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>我的预约</h1>
          <Link
            to="/experts"
            className={styles.newAppointmentButton}
          >
            新预约
          </Link>
        </div>

        <div className={styles.appointmentList}>
          {appointments.length === 0 ? (
            <div className={styles.noAppointments}>暂无预约记录</div>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment._id}
                className={styles.appointmentCard}
              >
                <div className={styles.appointmentInfo}>
                  <h3>
                    预约时间: {new Date(appointment.date).toLocaleDateString()}{" "}
                    {appointment.timeSlot}
                  </h3>
                  <p>专家: {appointment.expertId?.name || "未知专家"}</p>
                  <p>
                    状态:{" "}
                    {{
                      pending: "待确认",
                      confirmed: "已确认",
                      cancelled: "已取消",
                      completed: "已完成",
                    }[appointment.status] || appointment.status}
                  </p>
                </div>
                {appointment.status !== "cancelled" && (
                  <Link
                    to={`/expert-chat/${appointment._id}`}
                    className={styles.chatButton}
                  >
                    进入对话
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
