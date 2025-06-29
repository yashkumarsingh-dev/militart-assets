import React, { useState } from "react";
import { useTheme, useToast } from "../../App";
import ProfileModal from "./ProfileModal";
import api from "../../services/api";
import authUtils from "../../utils/auth";

const Header = ({ onLogout, user, setSidebarOpen }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    onLogout();
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Hamburger menu for mobile */}
            <button
              className="md:hidden mr-2 text-gray-700 dark:text-gray-200 focus:outline-none"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Open sidebar">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                Kristalball
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 bg-gray-200 dark:bg-gray-700 hover:bg-indigo-200 dark:hover:bg-indigo-600 transition-colors duration-200 focus:outline-none"
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }>
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-yellow-300">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M17.657 17.657l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M17.657 6.343l1.061-1.061M12 7.5A4.5 4.5 0 1 1 7.5 12 4.505 4.505 0 0 1 12 7.5z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-800">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.718 9.718 0 0 1 12 21.75a9.75 9.75 0 0 1 0-19.5c.414 0 .75.336.75.75v.75a7.5 7.5 0 0 0 7.5 7.5h.75c.414 0 .75.336.75.75a9.718 9.718 0 0 1-2.248 6.002z"
                  />
                </svg>
              )}
            </button>
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                  className="flex items-center focus:outline-none">
                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <svg
                      className="h-full w-full text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M24 24H0c0-6.627 5.373-12 12-12s12 5.373 12 12zM12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                    </svg>
                  </span>
                  <span className="ml-2 text-base md:text-lg font-medium text-gray-700 dark:text-gray-200 max-w-xs truncate">
                    {user?.name || user?.username || "User"}
                  </span>
                </button>
              </div>

              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                    <div className="font-medium">{user?.name || "User"}</div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {user?.role || "user"}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onSave={async (profileData) => {
            try {
              const response = await api.updateProfile(profileData);
              if (response && response.user) {
                authUtils.setUser(response.user);
                showToast("Profile updated successfully!", "success");
                setShowProfileModal(false);
              }
            } catch (err) {
              showToast(err.message || "Failed to update profile.", "error");
            }
          }}
        />
      )}
    </header>
  );
};

export default Header;
