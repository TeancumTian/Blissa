import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./Login.module.css";

const AppointmentChat = () => {
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchAppointmentDetails();
    fetchMessages();
    initializeWebSocket();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/experts/appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAppointment(data);
    } catch (error) {
      console.error("获取预约详情失败:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/messages/appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("获取消息历史失败:", error);
    }
  };

  const initializeWebSocket = () => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat" && data.appointmentId === appointmentId) {
        setMessages((prev) => [...prev, data.message]);
      }
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: input,
          appointmentId,
          receiverId: appointment.expertId,
        }),
      });

      if (response.ok) {
        setInput("");
        fetchMessages();
      }
    } catch (error) {
      console.error("发送消息失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${styles.chatCard}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>预约聊天</h1>
          {appointment && (
            <p className={styles.subtitle}>
              与 {appointment.expertName} 的预约聊天
            </p>
          )}
        </div>

        <div className={styles.chatContent}>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  msg.sender === appointment?.userId
                    ? styles.sent
                    : styles.received
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.chatInput}
              placeholder="输入消息..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              className={styles.sendButton}
              disabled={loading}
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentChat;
