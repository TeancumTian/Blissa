import React, { useState } from "react";

function LiveKitTest() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [connectionDetails, setConnectionDetails] = useState(null);

  const testConnection = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setStatus("开始测试连接...");

      const room = "test-room";
      const username = "test-user";

      setStatus("正在请求 LiveKit token...");

      const response = await fetch(
        `/api/livekit?room=${room}&username=${username}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const responseText = await response.text();
      console.log("API 原始响应:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`服务器响应格式错误: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(data.error || "获取 token 失败");
      }

      setConnectionDetails(data);
      setStatus("成功获取 token！");

      console.log("连接信息:", {
        hasToken: !!data.token,
        wsUrl: data.wsUrl,
      });
    } catch (err) {
      console.error("测试失败:", err);
      setError(err.message);
      setStatus("测试失败");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">LiveKit 连接测试</h1>

      <div className="space-y-4">
        <button
          onClick={testConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isConnecting}
        >
          {isConnecting ? "测试中..." : "开始测试"}
        </button>

        <div className="mt-4">
          <p className="font-bold">
            当前状态: <span className="font-normal">{status}</span>
          </p>

          {error && (
            <div className="mt-2 p-4 bg-red-100 text-red-700 rounded">
              错误: {error}
            </div>
          )}

          {connectionDetails && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
              <p>连接成功！</p>
              <p>Token: {connectionDetails.token.slice(0, 20)}...</p>
              <p>WebSocket URL: {connectionDetails.wsUrl}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveKitTest;
