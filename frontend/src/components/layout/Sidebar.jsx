import React from "react";

const Sidebar = ({
  activePage,
  onPageChange,
  theme,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "assets", label: "Assets", icon: "💎" },
    { id: "assignments", label: "Assignments", icon: "📋" },
    { id: "purchases", label: "Purchases", icon: "🛒" },
    { id: "transfers", label: "Transfers", icon: "🔄" },
    { id: "audit", label: "Audit", icon: "📝" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`fixed inset-y-0 md:static top-0 left-0 h-full md:min-h-screen w-64 bg-[#18181c] z-50 md:z-10 transform transition-transform duration-300
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 flex flex-col`}>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          {/* Close button for mobile */}
          <div className="flex md:hidden justify-end px-4 pb-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white text-2xl focus:outline-none"
              aria-label="Close sidebar">
              &times;
            </button>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`$ {
                  activePage === item.id
                    ? "bg-[#232336] text-white font-semibold shadow-sm"
                    : "text-white hover:bg-[#232336] hover:text-indigo-300 font-semibold"
                } group flex items-center px-4 py-3 text-base rounded-md w-full text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`}>
                <span className="mr-3 text-base md:text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
