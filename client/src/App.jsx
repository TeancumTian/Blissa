import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LiveKitMeeting from "./pages/LiveKitMeeting";

function App() {
  useEffect(() => {
    fetch("http://localhost:3000/api/test")
      .then((response) => response.json())
      .then((data) => console.log(data.message))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <Router>
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
            path="/meeting/room-123"
            element={<LiveKitMeeting />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
