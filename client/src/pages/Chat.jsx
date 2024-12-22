import React, { useState, useRef, useEffect } from "react";
import styles from "./Login.module.css"; // 复用 Login 的样式

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("未登录");
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
        credentials: "include",
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.content,
            followUpQuestions: data.followUpQuestions,
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
              : "抱歉,发生错误。请稍后重试。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.card}
        style={{ height: "80vh", width: "80vw" }}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>BLISSA AI</h1>
          <p className={styles.subtitle}>您的智能护肤助手</p>
        </div>

        <div className={styles.chatContent}>
          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.message} ${styles[msg.role]}`}
              >
                <div className={styles.messageContent}>{msg.content}</div>
                {msg.followUpQuestions && (
                  <div className={styles.followUp}>
                    <p className={styles.followUpTitle}>您可以继续问:</p>
                    {msg.followUpQuestions.map((q, i) => (
                      <button
                        key={i}
                        className={styles.followUpButton}
                        onClick={() => setInput(q)}
                      >
                        {q}
                      </button>
                    ))}
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
              disabled={loading}
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
