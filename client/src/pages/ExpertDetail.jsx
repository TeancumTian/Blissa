import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Navbar from "../components/Navbar";

const ExpertDetail = () => {
  const { expertId } = useParams();
  const [expert, setExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpertDetails();
  }, [expertId]);

  const fetchExpertDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/experts/${expertId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取专家信息失败");
      }

      const data = await response.json();
      setExpert(data);

      const availabilityResponse = await fetch(
        `/api/experts/${expertId}/availability?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json();
        setAvailableSlots(availabilityData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/experts/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expertId,
          date: selectedDate,
          timeSlot: selectedTime,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("创建预约失败");
      }

      navigate("/appointments");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className={styles.loading}>加载中...</div>;
  if (!expert) return <div className={styles.error}>专家不存在</div>;

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.expertProfile}>
          <img
            src={expert.profileImage || "/default-avatar.png"}
            alt={expert.name}
            className={styles.expertImage}
          />
          <h1>{expert.name}</h1>
          <p className={styles.specialty}>{expert.specialty}</p>
          <p className={styles.description}>{expert.description}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.appointmentForm}
        >
          <h2>预约咨询</h2>

          <div className={styles.formGroup}>
            <label>选择日期</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>选择时间</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            >
              <option value="">请选择时间段</option>
              {expert.availability
                .find(
                  (a) =>
                    a.day ===
                    new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                    })
                )
                ?.slots.map((slot) => (
                  <option
                    key={slot}
                    value={slot}
                  >
                    {slot}
                  </option>
                ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>备注</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="请输入咨询内容..."
              rows={4}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
          >
            确认预约
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpertDetail;
