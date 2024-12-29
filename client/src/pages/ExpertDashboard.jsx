import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import styles from "./ExpertDashboard.module.css";

const ExpertDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/experts/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取预约列表失败");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (appointmentId) => {
    navigate(`/expert-chat/${appointmentId}`);
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.dashboard}>
        <h1>专家工作台</h1>

        <div className={styles.appointmentsSection}>
          <h2>今日预约</h2>
          <div className={styles.appointmentsList}>
            {appointments
              .filter(
                (apt) =>
                  new Date(apt.date).toDateString() ===
                  new Date().toDateString()
              )
              .map((appointment) => (
                <div
                  key={appointment._id}
                  className={styles.appointmentCard}
                >
                  <div className={styles.appointmentInfo}>
                    <h3>用户: {appointment.userId.name}</h3>
                    <p>时间: {appointment.timeSlot}</p>
                    <p>状态: {appointment.status}</p>
                  </div>
                  <button
                    onClick={() => handleChatClick(appointment._id)}
                    className={styles.chatButton}
                  >
                    开始对话
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className={styles.upcomingSection}>
          <h2>未来预约</h2>
          <div className={styles.appointmentsList}>
            {appointments
              .filter((apt) => new Date(apt.date) > new Date())
              .map((appointment) => (
                <div
                  key={appointment._id}
                  className={styles.appointmentCard}
                >
                  <div className={styles.appointmentInfo}>
                    <h3>用户: {appointment.userId.name}</h3>
                    <p>
                      日期: {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p>时间: {appointment.timeSlot}</p>
                    <p>状态: {appointment.status}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
