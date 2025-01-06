/**
 * @fileoverview 专家聊天组件，提供实时聊天功能
 * @module ExpertChat
 */

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import styles from "./ExpertChat.module.css";

/**
 * @typedef {Object} Message
 * @property {string} content - 消息内容
 * @property {string} sender - 发送者类型 ('user' | 'expert')
 * @property {string} timestamp - 发送时间戳
 */

/**
 * 专家聊天组件
 * @returns {React.ReactElement} 渲染的组件
 */
const ExpertChat = () => {
  const { expertId } = useParams();
  /** @type {[Message[], function(Message[]): void]} */
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  /** @type {[WebSocket|null, function(WebSocket|null): void]} */
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  /**
   * 初始化WebSocket连接
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = new WebSocket(
      `ws://localhost:3000/ws/expert-chat?token=${token}`
    );

    socket.onopen = () => {
      console.log("Connected to expert chat");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(socket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [expertId]);

  /**
   * 滚动到最新消息
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * 处理发送消息
   * @param {React.FormEvent} e - 表单提交事件
   */
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && ws) {
      ws.send(
        JSON.stringify({
          type: "message",
          content: newMessage,
          expertId,
        })
      );
      setNewMessage("");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                msg.sender === "user"
                  ? styles.userMessage
                  : styles.expertMessage
              }`}
            >
              <p>{msg.content}</p>
              <span className={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSendMessage}
          className={styles.inputContainer}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className={styles.input}
          />
          <button
            type="submit"
            className={styles.sendButton}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpertChat;
