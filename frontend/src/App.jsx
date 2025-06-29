import React, { useState, useEffect, createContext, useContext } from "react";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";
import Assets from "./components/assets/Assets";
import Assignments from "./components/assignments/Assignments";
import Purchases from "./components/purchases/Purchases";
import Transfers from "./components/transfers/Transfers";
import Audit from "./components/audit/Audit";
import authUtils from "./utils/auth";
import api from "./services/api";

// Theme context for global theme switching
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

// Toast context for global toast notifications
const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

function Toast({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${
        type === "success"
          ? "bg-green-600"
          : type === "error"
          ? "bg-red-600"
          : "bg-gray-800"
      }`}>
      {message}
      <button className="ml-4 text-white/80 hover:text-white" onClick={onClose}>
        &times;
      </button>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [showSignup, setShowSignup] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // Check for existing authentication on app load
  useEffect(() => {
    const token = authUtils.getToken();
    const savedUser = authUtils.getUser();
    if (token && savedUser) {
      // Try a protected API call to verify token
      api
        .getUsers()
        .then(() => {
          setUser(savedUser);
          setIsAuthenticated(true);
        })
        .catch(() => {
          authUtils.clearAuth();
          setUser(null);
          setIsAuthenticated(false);
        });
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (userData) => {
    // Store authentication data from backend response only
    // userData should already be set by Login.jsx using authUtils.setToken and setUser
    setUser(userData);
    setIsAuthenticated(true);
    setShowSignup(false);
  };

  const handleSignup = (userData) => {
    // Store authentication data from backend response only
    // userData should already be set by Signup.jsx using authUtils.setToken and setUser
    setUser(userData);
    setIsAuthenticated(true);
    setShowSignup(false);
  };

  const handleLogout = () => {
    // Clear authentication data
    authUtils.clearAuth();

    setUser(null);
    setIsAuthenticated(false);
    setActivePage("dashboard");
    setShowSignup(false);
  };

  const handleShowSignup = () => {
    setShowSignup(true);
  };

  const handleBackToLogin = () => {
    setShowSignup(false);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 3000);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "assets":
        return <Assets />;
      case "assignments":
        return <Assignments />;
      case "purchases":
        return <Purchases />;
      case "transfers":
        return <Transfers />;
      case "audit":
        return <Audit />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated && showSignup) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ToastContext.Provider value={{ showToast }}>
          <Toast
            {...toast}
            onClose={() => setToast({ message: "", type: toast.type })}
          />
          <Signup onSignup={handleSignup} onBackToLogin={handleBackToLogin} />
        </ToastContext.Provider>
      </ThemeContext.Provider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ToastContext.Provider value={{ showToast }}>
          <Toast
            {...toast}
            onClose={() => setToast({ message: "", type: toast.type })}
          />
          <Login onLogin={handleLogin} onShowSignup={handleShowSignup} />
        </ToastContext.Provider>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ToastContext.Provider value={{ showToast }}>
        <Toast
          {...toast}
          onClose={() => setToast({ message: "", type: toast.type })}
        />
        <div
          className={`relative min-h-screen flex flex-col md:flex-row overflow-hidden ${
            theme === "dark" ? "bg-[#18181c]" : "bg-gray-100"
          } ${theme === "dark" ? "dark:bg-[#18181c]" : ""}`}>
          {/* Animated gradient background for all pages (dark mode only) */}
          {theme === "dark" && (
            <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-tr from-[#18181c] via-[#232336] to-[#4f2d7f] opacity-80" />
          )}
          {/* Sidebar: hidden on mobile, toggled by hamburger */}
          <Sidebar
            activePage={activePage}
            onPageChange={setActivePage}
            theme={theme}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <div className="flex flex-col flex-1 overflow-hidden relative z-10">
            <Header
              onLogout={handleLogout}
              user={user}
              setSidebarOpen={setSidebarOpen}
            />
            <main className="flex-1 relative overflow-y-auto focus:outline-none bg-transparent px-2 sm:px-4 py-2">
              {renderPage()}
            </main>
          </div>
          <style>{`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-gradient {
              background-size: 200% 200%;
              animation: gradient 8s ease-in-out infinite;
            }
          `}</style>
        </div>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
