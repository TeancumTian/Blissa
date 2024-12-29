const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "未授权访问" });
    }

    if (req.user.role !== role) {
      console.log("用户角色:", req.user.role, "需要角色:", role);
      return res.status(403).json({ error: "无权访问此资源" });
    }

    next();
  };
};

module.exports = checkRole;
