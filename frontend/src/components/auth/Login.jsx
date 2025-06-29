import React, { useState } from "react";
import api from "../../services/api";
import authUtils from "../../utils/auth";

const Login = ({ onLogin, onShowSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await api.login(formData);
      if (response.token && response.user) {
        authUtils.setToken(response.token);
        authUtils.setUser(response.user);
        onLogin(response.user);
      } else {
        setErrors({ general: "Invalid response from server" });
      }
    } catch (error) {
      if (error.message.includes("401")) {
        setErrors({ general: "Invalid email or password" });
      } else if (error.message.includes("500")) {
        setErrors({ general: "Server error. Please try again later." });
      } else {
        setErrors({
          general: "Login failed. Please check your connection and try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#18181c] via-[#232336] to-[#4f2d7f]">
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-4 py-12">
        {/* Left: Headline, tagline, and character */}
        <div className="flex-1 flex flex-col items-start justify-center md:pr-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            Welcome to Kristalball
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 font-medium">
            Command your assets with military precision.
          </p>
          {/* Optional: dog tag/insignia accent */}
          <div className="flex items-center gap-2 mb-8">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/80 border border-white/30 text-sm font-bold text-[#23291e] shadow-sm">
              ASSET
            </span>
            <span className="text-lime-300 font-semibold">Military Grade</span>
          </div>
          {/* 3D military character SVG/PNG placeholder below headline */}
          <div className="mb-6 w-full flex justify-center">
            <svg
              width="180"
              height="280"
              viewBox="0 0 220 340"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              {/* Head/helmet */}
              <ellipse
                cx="110"
                cy="60"
                rx="32"
                ry="38"
                fill="#6b7a4b"
                stroke="#23291e"
                strokeWidth="4"
              />
              {/* Body/torso */}
              <rect
                x="70"
                y="98"
                width="80"
                height="90"
                rx="30"
                fill="#bfc2b0"
                stroke="#23291e"
                strokeWidth="4"
              />
              {/* Arms */}
              <rect
                x="40"
                y="110"
                width="30"
                height="110"
                rx="15"
                fill="#7c836a"
                stroke="#23291e"
                strokeWidth="4"
              />
              <rect
                x="150"
                y="110"
                width="30"
                height="110"
                rx="15"
                fill="#7c836a"
                stroke="#23291e"
                strokeWidth="4"
              />
              {/* Legs */}
              <rect
                x="80"
                y="188"
                width="24"
                height="100"
                rx="12"
                fill="#7c836a"
                stroke="#23291e"
                strokeWidth="4"
              />
              <rect
                x="116"
                y="188"
                width="24"
                height="100"
                rx="12"
                fill="#7c836a"
                stroke="#23291e"
                strokeWidth="4"
              />
              {/* Boots */}
              <ellipse cx="92" cy="298" rx="16" ry="12" fill="#23291e" />
              <ellipse cx="128" cy="298" rx="16" ry="12" fill="#23291e" />
              {/* Belt */}
              <rect
                x="90"
                y="180"
                width="40"
                height="12"
                rx="6"
                fill="#23291e"
              />
              {/* Face shield/visor */}
              <ellipse
                cx="110"
                cy="60"
                rx="18"
                ry="20"
                fill="#bfc2b0"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>
        {/* Right: Glassmorphism login form */}
        <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-sm">
          <form
            className="w-full max-w-sm bg-white/40 backdrop-blur-2xl rounded-2xl shadow-2xl px-8 py-8 space-y-6 border border-[#bfc2b0] hover:shadow-3xl transition-shadow duration-300"
            onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-900/30 border border-red-400 text-red-300 px-4 py-3 rounded-md animate-pulse">
                {errors.general}
              </div>
            )}
            <div className="space-y-6">
              {/* Floating label for email */}
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`peer block w-full px-4 pt-6 pb-2 text-base bg-white/20 text-white placeholder:text-white border border-white/60 rounded-xl focus:border-indigo-400 focus:outline-none transition-colors duration-200 shadow-lg focus:shadow-indigo-400/30 ${
                    errors.email ? "border-red-400" : "border-white/60"
                  }`}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-2 text-white text-sm transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-white pointer-events-none">
                  Email address
                </label>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>
              {/* Floating label for password */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`peer block w-full px-4 pt-6 pb-2 text-base bg-white/20 text-white placeholder:text-white border border-white/60 rounded-xl focus:border-indigo-400 focus:outline-none transition-colors duration-200 shadow-lg focus:shadow-indigo-400/30 ${
                    errors.password ? "border-red-400" : "border-white/60"
                  }`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-2 text-white text-sm transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-white pointer-events-none">
                  Password
                </label>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-pink-400 focus:outline-none"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.036 3.807 6.07 6.75 9.75 6.75 1.563 0 3.06-.362 4.396-1.02M6.228 6.228A10.45 10.45 0 0 1 12 5.25c3.68 0 7.714 2.943 9.75 6.75a10.478 10.478 0 0 1-4.293 4.73M6.228 6.228l11.544 11.544M6.228 6.228A10.478 10.478 0 0 0 2.25 12c2.036 3.807 6.07 6.75 9.75 6.75 1.563 0 3.06-.362 4.396-1.02M17.772 17.772A10.45 10.45 0 0 1 12 18.75c-3.68 0-7.714-2.943-9.75-6.75a10.478 10.478 0 0 1 4.293-4.73"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12c2.036 3.807 6.07 6.75 9.75 6.75s7.714-2.943 9.75-6.75c-2.036-3.807-6.07-6.75-9.75-6.75S4.286 8.193 2.25 12z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z"
                      />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden">
                <span
                  className={`transition-all duration-200 ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}>
                  Sign in
                </span>
                {isLoading && (
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <svg
                      className="animate-spin h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  </span>
                )}
              </button>
            </div>
            <div className="w-full flex justify-center mt-6">
              <button
                type="button"
                onClick={onShowSignup}
                className="text-white hover:text-pink-400 text-sm font-medium transition-colors duration-200">
                Don't have an account? Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
