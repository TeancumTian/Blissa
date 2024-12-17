import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // 确保创建这个组件
import Login from "./pages/Login"; // 确保创建这个组件

function App() {
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
