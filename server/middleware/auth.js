const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "未提供认证令牌" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "未提供认证令牌" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = { _id: decoded.userId };
    next();
  } catch (error) {
    console.error("认证错误:", error);
    res.status(401).json({ message: "认证失败" });
  }
};

module.exports = auth;
