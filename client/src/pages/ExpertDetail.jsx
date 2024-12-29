import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ExpertDetail.module.css";

const ExpertDetail = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpertDetails();
  }, [expertId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate]);

  const fetchExpertDetails = async () => {
    try {
      const response = await fetch(`/api/experts/${expertId}`);
      if (!response.ok) {
        throw new Error("获取专家信息失败");
      }
      const data = await response.json();
      setExpert(data);
      setLoading(false);
    } catch (error) {
      console.error("获取专家详情错误:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchAvailability = async (date) => {
    try {
      if (!date) return;

      const formattedDate = new Date(date).toISOString().split("T")[0];
      const response = await fetch(
        `/api/experts/${expertId}/availability?date=${formattedDate}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "获取可用时间失败");
      }

      const data = await response.json();
      setAvailableSlots(data.availableSlots || []);
    } catch (error) {
      console.error("获取可用时间错误:", error);
      setError(error.message);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTimeSlot("");
  };

  const handleTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedDate || !selectedTimeSlot) {
        throw new Error("请选择预约日期和时间");
      }

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
          timeSlot: selectedTimeSlot,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "预约失败");
      }

      const data = await response.json();
      navigate("/appointments");
    } catch (error) {
      console.error("预约错误:", error);
      setError(error.message);
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  if (!expert) return <div>未找到专家信息</div>;

  return (
    <div className={styles.container}>
      <div className={styles.expertInfo}>
        <h2>{expert.name}</h2>
        <p>专业领域: {expert.specialty}</p>
        <p>简介: {expert.description}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={styles.appointmentForm}
      >
        <div className={styles.formGroup}>
          <label>选择日期:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        {selectedDate && (
          <div className={styles.formGroup}>
            <label>选择时间段:</label>
            <select
              value={selectedTimeSlot}
              onChange={handleTimeSlotChange}
              required
            >
              <option value="">请选择时间段</option>
              {availableSlots.map((slot) => (
                <option
                  key={slot}
                  value={slot}
                >
                  {slot}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!selectedDate || !selectedTimeSlot}
        >
          确认预约
        </button>
      </form>
    </div>
  );
};

export default ExpertDetail;
