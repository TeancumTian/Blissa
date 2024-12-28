import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Appointment.module.css";
import Navbar from "../components/Navbar";

const Appointment = () => {
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

  const handleNewAppointment = () => {
    navigate("/experts");
  };

  const handleChatClick = (appointmentId) => {
    navigate(`/expert-chat/${appointmentId}`);
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "待确认",
      confirmed: "已确认",
      completed: "已完成",
      cancelled: "已取消",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const statusClassMap = {
      pending: styles.statusPending,
      confirmed: styles.statusConfirmed,
      completed: styles.statusCompleted,
      cancelled: styles.statusCancelled,
    };
    return statusClassMap[status] || "";
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>我的预约</h1>
          <button
            onClick={handleNewAppointment}
            className={styles.newAppointmentButton}
          >
            新预约
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : appointments.length === 0 ? (
          <div className={styles.empty}>
            <p>暂无预约</p>
            <button
              onClick={handleNewAppointment}
              className={styles.emptyStateButton}
            >
              立即预约
            </button>
          </div>
        ) : (
          <div className={styles.appointmentList}>
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className={styles.appointmentCard}
              >
                <div className={styles.expertInfo}>
                  <img
                    src={
                      appointment.expertId.profileImage || "/default-avatar.png"
                    }
                    alt={appointment.expertId.name}
                    className={styles.expertImage}
                  />
                  <div>
                    <h3>{appointment.expertId.name}</h3>
                    <p>{appointment.expertId.specialty}</p>
                  </div>
                </div>

                <div className={styles.appointmentInfo}>
                  <p>日期：{new Date(appointment.date).toLocaleDateString()}</p>
                  <p>时间：{appointment.timeSlot}</p>
                  <p className={getStatusClass(appointment.status)}>
                    状态：{getStatusText(appointment.status)}
                  </p>
                </div>

                {appointment.status === "confirmed" && (
                  <button
                    onClick={() => handleChatClick(appointment._id)}
                    className={styles.chatButton}
                  >
                    开始对话
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
