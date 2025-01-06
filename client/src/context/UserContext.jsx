/**
 * @fileoverview 用户上下文管理，处理用户状态和认证
 * @module UserContext
 */

import React, { createContext, useState, useContext, useEffect } from "react";

/**
 * @typedef {Object} User
 * @property {string} id - 用户ID
 * @property {string} email - 用户邮箱
 * @property {string} role - 用户角色
 * @property {string} token - 认证令牌
 */

/**
 * @typedef {Object} UserContextType
 * @property {User|null} user - 当前用户信息
 * @property {boolean} loading - 加载状态
 * @property {function(User): void} login - 登录函数
 * @property {function(): void} logout - 登出函数
 */

/** @type {React.Context<UserContextType>} */
const UserContext = createContext();

/**
 * 用户上下文提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {React.ReactElement} 渲染的组件
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 获取用户信息
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");

    if (token && userId && userEmail) {
      setUser({
        id: userId,
        email: userEmail,
        role: userRole || "user",
        token,
      });
    }
    setLoading(false);
  }, []);

  /**
   * 用户登录处理
   * @param {User} userData - 用户数据
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userRole", userData.role || "user");
  };

  /**
   * 用户登出处理
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * 用户上下文Hook
 * @returns {UserContextType} 用户上下文值
 * @throws {Error} 如果在UserProvider外部使用
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
