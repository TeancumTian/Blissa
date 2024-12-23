import { Link, useLocation } from "react-router-dom";
import styles from "../pages/Home.module.css";
import {
  Book,
  HomeIcon,
  MessageCircle,
  TreesIcon as Plant,
  Video,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center"
          >
            <h1 className="text-2xl font-bold text-emerald-900">BLISSA</h1>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/">
              <button
                className={`${styles["bg-gradient"]} p-2 rounded-lg ${
                  isActive("/") ? "opacity-100" : "opacity-70"
                }`}
              >
                <HomeIcon className="w-5 h-5 text-white" />
              </button>
            </Link>
            <Link to="/chat">
              <button
                className={`${styles["bg-gradient"]} p-2 rounded-lg ${
                  isActive("/chat") ? "opacity-100" : "opacity-70"
                }`}
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
            </Link>
            <Link to="/appointment">
              <button
                className={`${styles["bg-gradient"]} p-2 rounded-lg ${
                  isActive("/appointment") ? "opacity-100" : "opacity-70"
                }`}
              >
                <Book className="w-5 h-5 text-white" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
