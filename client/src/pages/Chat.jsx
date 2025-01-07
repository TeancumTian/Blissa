import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.css";
import Navbar from "../components/Navbar";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { initialQuestion, skinTestResult } = location.state || {};

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 处理初始问题
  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage(initialQuestion);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // 添加用户消息到对话
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("未登录");
      }

      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          skinTestResult,
        }),
        credentials: "include",
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // 添加助手回复到对话
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.content, // 主要回答内容
            followUpQuestions: data.followUpQuestions, // 后续问题
          },
        ]);
      } else {
        throw new Error(data.error || "聊天请求失败");
      }
    } catch (err) {
      console.error("聊天错误:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content:
            err.message === "未登录"
              ? "请先登录"
              : "抱歉，发生错误。请稍后重试。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.card}
        style={{ height: "100vh", width: "100vw" }}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>BLISSA AI</h1>
          <p className={styles.subtitle}>Your Intelligent Skincare Assistant</p>
          <Navbar />
        </div>

        <div className={styles.chatContent}>
          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.message} ${styles[msg.role]}`}
              >
                {/* 消息内容 */}
                <div className={styles.messageContent}>{msg.content}</div>

                {/* 后续问题建议 */}
                {msg.role === "assistant" &&
                  msg.followUpQuestions &&
                  msg.followUpQuestions.length > 0 && (
                    <div className={styles.followUp}>
                      <p className={styles.followUpTitle}>
                        You might also want to ask：
                      </p>
                      <div className={styles.followUpQuestions}>
                        {msg.followUpQuestions.map((question, i) => (
                          <button
                            key={i}
                            className={styles.followUpButton}
                            onClick={() => handleSendMessage(question)}
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
            {loading && <div className={styles.loading}>思考中...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className={styles.inputForm}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入您的问题..."
              className={styles.chatInput}
              disabled={loading}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={loading || !input.trim()}
            >
              发送
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
