import { Link, useLocation } from "react-router-dom";
import styles from "../pages/Home.module.css";
import {
  Book,
  HomeIcon,
  MessageCircle,
  ClipboardCheck,
  Info,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="w-full px-4 py-2">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex-shrink-0"
          >
            <h1 className="text-xl font-bold text-emerald-900">BLISSA</h1>
          </Link>

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
          </div>
        </div>
      </div>
    </nav>
  );
}
