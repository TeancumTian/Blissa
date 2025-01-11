// /**
//  * @fileoverview 主应用程序组件，处理路由和身份验证
//  * @module App
//  */

// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { UserProvider } from "./context/UserContext";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import LiveKitMeeting from "./pages/LiveKitMeeting";
// import ErrorBoundary from "./components/ErrorBoundary";
// import LiveKitTest from "./pages/LiveKitTest";
// import Chat from "./pages/Chat";
// import Appointment from "./pages/Appointment";
// import SkinTest from "./pages/SkinTest";
// import About from "./pages/About";
// import ExpertChat from "./pages/ExpertChat";
// import ExpertList from "./pages/ExpertList";
// import ExpertDetail from "./pages/ExpertDetail";
// import ExpertDashboard from "./pages/ExpertDashboard";
// import ExpertRegister from "./pages/ExpertRegister";

// /**
//  * @typedef {Object} ProtectedRouteProps
//  * @property {React.ReactNode} children - 需要保护的子组件
//  * @property {string} [requiredRole] - 访问路由所需的用户角色
//  */

// /**
//  * 受保护的路由组件，用于处理身份验证和授权
//  * @param {ProtectedRouteProps} props - 组件属性
//  * @returns {React.ReactElement} 渲染的组件
//  */
// const ProtectedRoute = ({ children, requiredRole }) => {
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("userRole");

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   if (requiredRole && userRole !== requiredRole) {
//     return <Navigate to="/home" />;
//   }

//   return children;
// };

// /**
//  * 主应用程序组件
//  * @returns {React.ReactElement} 渲染的应用程序
//  */
// const App = () => {
//   return (
//     <ErrorBoundary>
//       <UserProvider>
//         <Router>
//           <Routes>
//             <Route
//               path="/login"
//               element={<Login />}
//             />
//             <Route
//               path="/home"
//               element={
//                 <ProtectedRoute>
//                   <Home />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/meeting/:roomId?"
//               element={
//                 <ProtectedRoute>
//                   <LiveKitMeeting />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/test"
//               element={
//                 <ProtectedRoute>
//                   <LiveKitTest />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 <ProtectedRoute>
//                   <Chat />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/appointment"
//               element={
//                 <ProtectedRoute>
//                   <Appointment />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/skintest"
//               element={
//                 <ProtectedRoute>
//                   <SkinTest />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/about"
//               element={
//                 <ProtectedRoute>
//                   <About />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/experts"
//               element={
//                 <ProtectedRoute>
//                   <ExpertList />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/experts/:expertId"
//               element={
//                 <ProtectedRoute>
//                   <ExpertDetail />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/expert-chat/:appointmentId"
//               element={
//                 <ProtectedRoute>
//                   <ExpertChat />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/expert-dashboard"
//               element={<ExpertDashboard />}
//             />
//             <Route
//               path="/expert-register"
//               element={<ExpertRegister />}
//             />
//           </Routes>
//         </Router>
//       </UserProvider>
//     </ErrorBoundary>
//   );
// };

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
        {/* 其他路由 */}
      </Routes>
    </Router>
  );
}

export default App;
