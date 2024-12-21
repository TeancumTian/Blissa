const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    // 从请求头获取 token
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No authentication token provided");
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

    // 将用户信息添加到请求对象
    req.user = { _id: decoded.userId };

    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

module.exports = auth;
