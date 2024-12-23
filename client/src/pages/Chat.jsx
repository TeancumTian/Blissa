import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import chatStyles from "./Login.module.css"; // 复用 Login 的样式
import homeStyles from "./Home.module.css"; // Home的样式，用于按钮

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

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
        console.log("认证失败，重定向到登录页面");
        localStorage.removeItem("token"); // 清除无效的 token
        navigate("/login");
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
    <div className={chatStyles.container}>
      <div
        className={chatStyles.card}
        style={{ height: "80vh", width: "80vw" }}
      >
        <div className={chatStyles.header}>
          <h1 className={chatStyles.title}>BLISSA AI</h1>
          <p className={chatStyles.subtitle}>您的智能护肤助手</p>
        </div>

        <div className={chatStyles.chatContent}>
          <div className={chatStyles.messages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${chatStyles.message} ${chatStyles[msg.role]}`}
              >
                <div className={chatStyles.messageContent}>{msg.content}</div>
                {msg.followUpQuestions && (
                  <div className={chatStyles.followUp}>
                    <p className={chatStyles.followUpTitle}>您可以继续问:</p>
                    {msg.followUpQuestions.map((q, i) => (
                      <button
                        key={i}
                        className={`${homeStyles["bg-gradient"]} px-4 py-2 rounded-lg text-white w-full mt-2`}
                        onClick={() => setInput(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className={chatStyles.loading}>思考中...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className={chatStyles.inputForm}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入您的问题..."
              className={chatStyles.chatInput}
              disabled={loading}
            />
            <button
              type="submit"
              className={`${homeStyles["bg-gradient"]} px-4 py-2 rounded-lg text-white`}
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
