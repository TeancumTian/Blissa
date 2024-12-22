import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req) {
  try {
    const room = req.nextUrl.searchParams.get("room");
    const username = req.nextUrl.searchParams.get("username");

    // 参数验证
    if (!room) {
      return NextResponse.json({ error: '缺少 "room" 参数' }, { status: 400 });
    } else if (!username) {
      return NextResponse.json(
        { error: '缺少 "username" 参数' },
        { status: 400 }
      );
    }

    // 环境变量验证
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL; // 注意这里改成 NEXT_PUBLIC_ 前缀

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ error: "服务器配置错误" }, { status: 500 });
    }

    // 创建访问令牌
    const at = new AccessToken(apiKey, apiSecret, { identity: username });
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    return NextResponse.json({
      token: await at.toJwt(),
      wsUrl,
    });
  } catch (error) {
    console.error("LiveKit token generation error:", error);
    return NextResponse.json({ error: "内部服务器错误" }, { status: 500 });
  }
}
