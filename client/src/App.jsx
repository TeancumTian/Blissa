import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LiveKitMeeting from "./pages/LiveKitMeeting";
import ErrorBoundary from "./components/ErrorBoundary";
import LiveKitTest from "./pages/LiveKitTest";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div>
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/meeting/:roomId?"
              element={<LiveKitMeeting />}
            />
            <Route
              path="/test"
              element={<LiveKitTest />}
            />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
