const express = require("express");
const router = express.Router();
const { AccessToken } = require("livekit-server-sdk");

router.get("/", async (req, res) => {
  const room = req.query.room;
  const username = req.query.username;

  if (!room) {
    return res.status(400).json({ error: 'Missing "room" query parameter' });
  } else if (!username) {
    return res
      .status(400)
      .json({ error: 'Missing "username" query parameter' });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const at = new AccessToken(apiKey, apiSecret, { identity: username });

  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  const token = await at.toJwt();
  res.json({ token });
});

module.exports = router;
