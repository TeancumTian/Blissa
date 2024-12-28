import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import styles from "./ExpertChat.module.css";

const ExpertChat = () => {
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

  useEffect(() => {
    fetchAppointmentDetails();
    fetchChatHistory();
    initializeWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
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

      if (!response.ok) {
        throw new Error("获取预约详情失败");
      }

      const data = await response.json();
      setAppointment(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/expert-chat/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取聊天记录失败");
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeWebSocket = () => {
    const token = localStorage.getItem("token");
    ws.current = new WebSocket(
      `ws://localhost:3000/ws/expert-chat?token=${token}`
    );

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "expert-chat" && data.appointmentId === appointmentId) {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket错误:", error);
      setError("连接错误，请刷新页面重试");
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/expert-chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId,
          content: input,
        }),
      });

      if (!response.ok) {
        throw new Error("发送消息失败");
      }

      setInput("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.chatContainer}>
        {appointment && (
          <div className={styles.appointmentInfo}>
            <h2>与 {appointment.expertName} 的对话</h2>
            <p>
              预约时间: {new Date(appointment.date).toLocaleDateString()}{" "}
              {appointment.timeSlot}
            </p>
          </div>
        )}

        <div className={styles.messageList}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.senderId === appointment?.userId
                  ? styles.userMessage
                  : styles.expertMessage
              }`}
            >
              <div className={styles.messageContent}>{message.content}</div>
              <div className={styles.messageTime}>
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息..."
            className={styles.input}
          />
          <button
            onClick={handleSendMessage}
            className={styles.sendButton}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertChat;
