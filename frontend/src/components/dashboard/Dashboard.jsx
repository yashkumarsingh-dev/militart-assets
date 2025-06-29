import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .getDashboardStats()
      .then((data) => {
        setStats(data.metrics);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!stats) return <div className="p-6">No data available.</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-[#a1a1aa]">
          Welcome to Kristalball Asset Management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#232336] overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📦</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-[#a1a1aa] truncate">
                    Opening Balance
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
                    {stats.openingBalance}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#232336] overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">🟢</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-[#a1a1aa] truncate">
                    Closing Balance
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
                    {stats.closingBalance}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#232336] overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">➕</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-[#a1a1aa] truncate">
                    Net Movement
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
                    {stats.netMovement}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#232336] overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📝</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-[#a1a1aa] truncate">
                    Purchases
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
                    {stats.purchases}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#232336] overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">⬆️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-[#a1a1aa] truncate">
                    Transfers In
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
                    {stats.transfersIn}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#232336] overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-pink-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">⬇️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-[#a1a1aa] truncate">
                    Transfers Out
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
                    {stats.transfersOut}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#232336] overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📋</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-[#a1a1aa] truncate">
                    Assigned Assets
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
                    {stats.assignedAssets}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#232336] overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">❌</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-[#a1a1aa] truncate">
                    Expended Assets
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
                    {stats.expendedAssets}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      {stats.recentAssignments && stats.recentAssignments.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2">Recent Assignments</h2>
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <tbody>
              {stats.recentAssignments.map((assignment) => (
                <tr key={assignment.id} className="text-xs sm:text-sm">
                  {/* Table row content */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent Purchases */}
      {stats.recentPurchases && stats.recentPurchases.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2">Recent Purchases</h2>
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <tbody>
              {stats.recentPurchases.map((purchase) => (
                <tr key={purchase.id} className="text-xs sm:text-sm">
                  {/* Table row content */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
