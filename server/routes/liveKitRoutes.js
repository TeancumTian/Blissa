import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req) {
  try {
    // 打印请求信息
    console.log("收到 LiveKit 请求:", {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers),
    });

    const room = req.nextUrl.searchParams.get("room");
    const username = req.nextUrl.searchParams.get("username");

    console.log("请求参数:", { room, username });

    // 环境变量检查
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    console.log("环境变量状态:", {
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      wsUrl: wsUrl || "未设置",
    });

    if (!apiKey || !apiSecret || !wsUrl) {
      throw new Error("缺少必要的环境变量配置");
    }

    if (!room || !username) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    // 创建 token
    const at = new AccessToken(apiKey, apiSecret, { identity: username });
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    const token = await at.toJwt();
    console.log("Token 生成成功");

    return NextResponse.json({
      token,
      wsUrl,
      debug: {
        room,
        username,
        hasToken: !!token,
      },
    });
  } catch (error) {
    // 详细的错误日志
    console.error("LiveKit 错误详情:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: "服务器内部错误",
        details: error.message,
        type: error.name,
      },
      { status: 500 }
    );
  }
}
