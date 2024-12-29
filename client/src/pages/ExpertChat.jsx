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

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    const maxRetries = 3;
    let retryCount = 0;

    const connect = () => {
      try {
        // 使用相对路径，但保持在 ws 协议
        const wsProtocol =
          window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsHost = window.location.hostname + ":" + window.location.port;
        const wsUrl = `${wsProtocol}//${wsHost}/ws/expert-chat?token=${token}`;

        console.log("正在连接WebSocket:", wsUrl);

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
          console.log("WebSocket连接成功");
          setError("");
          retryCount = 0; // 重置重试计数
        };

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("收到消息:", data);
            if (
              data.type === "expert-chat" &&
              data.appointmentId === appointmentId
            ) {
              setMessages((prev) => [...prev, data.message]);
            }
          } catch (error) {
            console.error("解析消息错误:", error);
          }
        };

        ws.current.onerror = (error) => {
          console.error("WebSocket错误:", error);
        };

        ws.current.onclose = (event) => {
          console.log(
            "WebSocket连接关闭, code:",
            event.code,
            "原因:",
            event.reason
          );

          if (!ws.current?.manualClose && retryCount < maxRetries) {
            retryCount++;
            console.log(`尝试重新连接 (${retryCount}/${maxRetries})...`);
            setTimeout(connect, 3000);
          } else if (retryCount >= maxRetries) {
            setError("连接失败，请刷新页面重试");
            console.log("达到最大重试次数");
          }
        };
      } catch (error) {
        console.error("初始化WebSocket错误:", error);
        setError("初始化连接失败");
      }
    };

    connect();
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const currentUser = appointment?.userId; // 获取当前用户ID

      // 创建新消息对象
      const newMessage = {
        content: input.trim(),
        senderId: currentUser,
        appointmentId,
        timestamp: new Date().toISOString(),
      };

      // 立即添加消息到界面
      setMessages((prev) => [...prev, newMessage]);

      // 清空输入框
      setInput("");

      // 发送消息到服务器
      const response = await fetch("/api/expert-chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId,
          content: newMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error("发送消息失败");
      }

      // 获取服务器返回的消息（包含完整的消息信息）
      const savedMessage = await response.json();

      // 用服务器返回的消息更新本地消息
      setMessages((prev) =>
        prev.map((msg) => (msg === newMessage ? savedMessage : msg))
      );
    } catch (error) {
      console.error("发送消息错误:", error);
      setError(error.message);
      // 如果发送失败，移除本地添加的消息
      setMessages((prev) => prev.filter((msg) => msg.content !== input));
    }
  };

  // 添加自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 添加键盘事件处理
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [input]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.manualClose = true;
        ws.current.close();
        ws.current = null;
      }
    };
  }, []);

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
