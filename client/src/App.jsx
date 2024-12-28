import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LiveKitMeeting from "./pages/LiveKitMeeting";
import ErrorBoundary from "./components/ErrorBoundary";
import LiveKitTest from "./pages/LiveKitTest";
import Chat from "./pages/Chat";
import Appointment from "./pages/Appointment";
import SkinTest from "./pages/SkinTest";
import About from "./pages/About";
import ExpertChat from "./pages/ExpertChat";
import ExpertList from "./pages/ExpertList";
import ExpertDetail from "./pages/ExpertDetail";

// 添加受保护的路由组件
const ProtectedRoute = ({ children }) => {
  // 检查用户是否已登录（根据您的认证方式来实现）
  const isAuthenticated = localStorage.getItem("token"); // 或其他验证方式

  if (!isAuthenticated) {
    // 未登录时重定向到登录页
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div>
          <Routes>
            {/* 将根路径重定向到home */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* 登录页面不需要保护 */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* 其他需要保护的路由 */}
            <Route
              path="/meeting/:roomId?"
              element={
                <ProtectedRoute>
                  <LiveKitMeeting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <LiveKitTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment"
              element={
                <ProtectedRoute>
                  <Appointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/skintest"
              element={
                <ProtectedRoute>
                  <SkinTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/experts"
              element={
                <ProtectedRoute>
                  <ExpertList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/experts/:expertId"
              element={
                <ProtectedRoute>
                  <ExpertDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expert-chat/:appointmentId"
              element={
                <ProtectedRoute>
                  <ExpertChat />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
