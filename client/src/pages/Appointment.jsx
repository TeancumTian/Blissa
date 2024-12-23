import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Appointment = () => {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("开始获取专家列表, token:", token);

      const response = await fetch("/api/experts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("专家列表响应状态:", response.status);

      // 尝试获取错误详情
      const data = await response.json();
      console.log("服务器响应:", data);

      if (!response.ok) {
        throw new Error(
          `获取专家列表失败: ${response.status}, ${JSON.stringify(data)}`
        );
      }

      if (Array.isArray(data) && data.length > 0) {
        setExperts(data);
        console.log("成功设置专家数据:", data);
      } else {
        console.warn("未找到专家数据或数据为空");
      }
    } catch (error) {
      console.error("获取专家列表失败:", {
        message: error.message,
        stack: error.stack,
      });
      alert(`获取专家列表失败: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/experts/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expertId: selectedExpert._id,
          date: selectedDate,
          timeSlot: selectedTime,
          notes,
        }),
      });

      if (response.ok) {
        const appointment = await response.json();
        navigate(`/chat/${appointment._id}`);
      }
    } catch (error) {
      console.error("预约失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>预约专家</h1>
          <p className={styles.subtitle}>选择您想咨询的专家</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <select
            className={styles.input}
            onChange={(e) => setSelectedExpert(experts[e.target.value])}
            required
          >
            <option value="">选择专家</option>
            {experts.map((expert, index) => (
              <option
                key={expert._id}
                value={index}
              >
                {expert.name} - {expert.specialty}
              </option>
            ))}
          </select>

          <input
            type="date"
            className={styles.input}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />

          <select
            className={styles.input}
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          >
            <option value="">选择时间段</option>
            <option value="09:00-10:00">09:00-10:00</option>
            <option value="10:00-11:00">10:00-11:00</option>
            <option value="11:00-12:00">11:00-12:00</option>
            <option value="14:00-15:00">14:00-15:00</option>
            <option value="15:00-16:00">15:00-16:00</option>
            <option value="16:00-17:00">16:00-17:00</option>
          </select>

          <textarea
            className={styles.input}
            placeholder="注信息..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "预约中..." : "确认预约"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
