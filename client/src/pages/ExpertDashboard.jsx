/**
 * @fileoverview 专家仪表板组件，显示预约和聊天管理界面
 * @module ExpertDashboard
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import styles from "./ExpertDashboard.module.css";

/**
 * @typedef {Object} Appointment
 * @property {string} _id - 预约ID
 * @property {string} userName - 用户名称
 * @property {string} date - 预约日期
 * @property {string} timeSlot - 时间段
 * @property {string} status - 预约状态
 */

/**
 * 专家仪表板组件
 * @returns {React.ReactElement} 渲染的组件
 */
const ExpertDashboard = () => {
  /** @type {[Appointment[], function(Appointment[]): void]} */
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  /**
   * 获取预约列表
   * @async
   */
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/experts/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理开始聊天
   * @param {string} appointmentId - 预约ID
   */
  const handleStartChat = (appointmentId) => {
    navigate(`/expert-chat/${appointmentId}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.dashboard}>
        <h1>Expert Dashboard</h1>
        <div className={styles.appointmentsList}>
          {appointments.length === 0 ? (
            <p>No appointments scheduled</p>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment._id}
                className={styles.appointmentCard}
              >
                <div className={styles.appointmentInfo}>
                  <h3>Appointment with {appointment.userName}</h3>
                  <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                  <p>Time: {appointment.timeSlot}</p>
                  <p>Status: {appointment.status}</p>
                </div>
                <button
                  onClick={() => handleStartChat(appointment._id)}
                  className={styles.chatButton}
                  disabled={appointment.status !== "confirmed"}
                >
                  Start Chat
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
