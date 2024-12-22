const jwt = require("jsonwebtoken");
const { getUserByToken } = require("../database");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No authentication token provided");
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

    // 从数据库验证用户
    const user = await getUserByToken(token);
    if (!user) {
      throw new Error("User not found");
    }

    // 将用户信息添加到请求对象
    req.user = {
      _id: decoded.userId,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("认证错误:", error);
    res.status(401).json({ error: "Please authenticate" });
  }
};

module.exports = auth;
