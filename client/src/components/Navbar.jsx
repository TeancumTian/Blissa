import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../pages/Home.module.css";
import {
  Book,
  HomeIcon,
  MessageCircle,
  ClipboardCheck,
  Info,
  LogIn,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="w-full px-4 py-2">
        <div className="flex items-center space-x-4">
          <div className="h-6 w-px bg-gray-200"></div>

          <div className="flex items-center space-x-2">
            <Link to="/">
              <button
                className={`${styles["bg-gradient"]} px-3 py-1.5 rounded-md ${
                  isActive("/") ? "opacity-100" : "opacity-70"
                } flex items-center gap-1.5`}
              >
                <HomeIcon className="w-4 h-4 text-white" />
                <span className="text-white text-sm">Home</span>
              </button>
            </Link>
            <Link to="/chat">
              <button
                className={`${styles["bg-gradient"]} px-3 py-1.5 rounded-md ${
                  isActive("/chat") ? "opacity-100" : "opacity-70"
                } flex items-center gap-1.5`}
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="text-white text-sm">Chat</span>
              </button>
            </Link>
            <Link to="/skintest">
              <button
                className={`${styles["bg-gradient"]} px-3 py-1.5 rounded-md ${
                  isActive("/skintest") ? "opacity-100" : "opacity-70"
                } flex items-center gap-1.5`}
              >
                <ClipboardCheck className="w-4 h-4 text-white" />
                <span className="text-white text-sm">Skin Test</span>
              </button>
            </Link>
            <Link to="/appointment">
              <button
                className={`${styles["bg-gradient"]} px-3 py-1.5 rounded-md ${
                  isActive("/appointment") ? "opacity-100" : "opacity-70"
                } flex items-center gap-1.5`}
              >
                <Book className="w-4 h-4 text-white" />
                <span className="text-white text-sm">Appointment</span>
              </button>
            </Link>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <Link to="/about">
              <button
                className={`${styles["bg-gradient"]} px-3 py-1.5 rounded-md ${
                  isActive("/about") ? "opacity-100" : "opacity-70"
                } flex items-center gap-1.5`}
              >
                <Info className="w-4 h-4 text-white" />
                <span className="text-white text-sm">About Us</span>
              </button>
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className={`${styles["bg-gradient"]} px-3 py-1.5 rounded-md opacity-70 hover:opacity-100 flex items-center gap-1.5`}
              >
                <LogOut className="w-4 h-4 text-white" />
                <span className="text-white text-sm">Logout</span>
              </button>
            ) : (
              <Link to="/login">
                <button
                  className={`${styles["bg-gradient"]} px-3 py-1.5 rounded-md ${
                    isActive("/login") ? "opacity-100" : "opacity-70"
                  } flex items-center gap-1.5`}
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Login</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
