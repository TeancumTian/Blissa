import React, { useState, useEffect } from "react";
import { Room } from "livekit-client";

function LiveKitTest() {
  const [status, setStatus] = useState("初始化");
  const [error, setError] = useState(null);
  const [connectionDetails, setConnectionDetails] = useState(null);

  const testConnection = async () => {
    try {
      setStatus("正在获取 token...");
      setError(null);

      const room = "test-room";
      const username = "test-user";

      console.log("开始请求 token:", { room, username });

      const response = await fetch(
        `/api/livekit?room=${room}&username=${username}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("服务器响应:", data);

      if (!response.ok) {
        throw new Error(data.details || data.error || "获取 token 失败");
      }

      if (!data.token || !data.wsUrl) {
        throw new Error("服务器返回的数据不完整");
      }

      setConnectionDetails(data);
      setStatus("获取到 token，正在连接...");

      // LiveKit 连接测试
      const liveKitRoom = new Room({
        // 添加更多日志
        logLevel: "debug",
      });

      liveKitRoom.on("connected", () => {
        console.log("LiveKit 连接成功");
        setStatus("连接成功！");
      });

      liveKitRoom.on("disconnected", () => {
        console.log("LiveKit 连接断开");
        setStatus("已断开连接");
      });

      liveKitRoom.on("error", (error) => {
        console.error("LiveKit 错误:", error);
        setError(`LiveKit 错误: ${error.message}`);
      });

      await liveKitRoom.connect(data.wsUrl, data.token);
    } catch (err) {
      console.error("测试失败:", err);
      setError(err.message);
      setStatus("测试失败");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">LiveKit 连接测试</h1>

      <button
        onClick={testConnection}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        开始测试
      </button>

      <div className="mt-4">
        <p>状态: {status}</p>

        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
            错误: {error}
          </div>
        )}

        {connectionDetails && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <p>Token: {connectionDetails.token.slice(0, 20)}...</p>
            <p>WebSocket URL: {connectionDetails.wsUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveKitTest;
