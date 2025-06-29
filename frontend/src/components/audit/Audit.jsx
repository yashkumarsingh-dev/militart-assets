import React, { useEffect, useState } from "react";
import api from "../../services/api";

const actionColors = {
  "Asset Assigned": "bg-green-100 text-green-800",
  "Purchase Approved": "bg-blue-100 text-blue-800",
  "Asset Transferred": "bg-purple-100 text-purple-800",
  "User Login": "bg-gray-100 text-gray-800",
};

const unique = (arr, key) => [...new Set(arr.map((item) => item[key]))];

const Audit = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filter, setFilter] = useState({ user: "", action: "", date: "" });
  const [expandedRows, setExpandedRows] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .getAuditLogs()
      .then((data) => {
        setAuditLogs(data.logs || []);
        setFilteredLogs(data.logs || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load audit logs");
        setLoading(false);
      });
  }, []);

  // Export CSV
  const handleExport = () => {
    const headers = ["Timestamp", "Action", "User", "Details", "IP Address"];
    const rows = filteredLogs.map((log) => [
      log.timestamp,
      log.action,
      log.user,
      log.details,
      log.ipAddress,
    ]);
    const csvContent = [headers, ...rows]
      .map((e) =>
        e.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter modal
  const openFilterModal = () => setShowFilterModal(true);
  const closeFilterModal = () => setShowFilterModal(false);
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };
  const applyFilter = (e) => {
    e.preventDefault();
    let logs = [...auditLogs];
    if (filter.user) logs = logs.filter((l) => l.user === filter.user);
    if (filter.action) logs = logs.filter((l) => l.action === filter.action);
    if (filter.date)
      logs = logs.filter((l) => l.timestamp.startsWith(filter.date));
    setFilteredLogs(logs);
    closeFilterModal();
  };
  const clearFilter = () => {
    setFilter({ user: "", action: "", date: "" });
    setFilteredLogs(auditLogs);
    closeFilterModal();
  };

  // Enhanced filtering: search by method, url, or status
  const filtered = filteredLogs.filter((log) => {
    let details = log.details;
    let method = "",
      url = "",
      status = "";
    try {
      const obj = typeof details === "string" ? JSON.parse(details) : details;
      method = obj.method || "";
      url = obj.url || "";
      status = obj.statusCode ? String(obj.statusCode) : "";
    } catch {}
    const q = search.toLowerCase();
    return (
      method.toLowerCase().includes(q) ||
      url.toLowerCase().includes(q) ||
      status.includes(q)
    );
  });

  if (loading) return <div className="p-6">Loading audit logs...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
              Audit Log
            </h1>
            <p className="text-gray-600 dark:text-[#a1a1aa]">
              System activity and audit trail
            </p>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search by method, URL, or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleExport}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
              Export Log
            </button>
            <button
              onClick={openFilterModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((log) => {
                  let details = log.details;
                  let method = "",
                    url = "",
                    status = "",
                    userAgent = "",
                    responseData = "";
                  let parsed = false;
                  try {
                    const obj =
                      typeof details === "string"
                        ? JSON.parse(details)
                        : details;
                    if (obj && typeof obj === "object") {
                      method = obj.method || "";
                      url = obj.url || "";
                      status = obj.statusCode ? String(obj.statusCode) : "";
                      userAgent = obj.userAgent || "";
                      responseData = obj.responseData || "";
                      parsed = true;
                    }
                  } catch {}
                  // Color coding for status
                  let statusColor = "";
                  if (status.startsWith("2"))
                    statusColor = "text-green-600 font-bold";
                  else if (status.startsWith("4") || status.startsWith("5"))
                    statusColor = "text-red-600 font-bold";
                  else if (status.startsWith("3"))
                    statusColor = "text-yellow-600 font-bold";
                  // Expand/collapse logic
                  const isExpanded = !!expandedRows[log.id];
                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          setExpandedRows((r) => ({
                            ...r,
                            [log.id]: !r[log.id],
                          }))
                        }>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <b>Method:</b> {method} <b>URL:</b> {url}
                          {isExpanded && parsed && (
                            <div className="mt-2 text-xs text-gray-700">
                              <div>
                                <b>UserAgent:</b>{" "}
                                <span className="break-all">{userAgent}</span>
                              </div>
                              {responseData &&
                                typeof responseData === "string" && (
                                  <div>
                                    <b>Response:</b>{" "}
                                    <span className="break-all">
                                      {responseData}
                                    </span>
                                  </div>
                                )}
                            </div>
                          )}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${statusColor}`}>
                          {status}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Filter Audit Logs</h2>
            <form onSubmit={applyFilter} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User
                </label>
                <select
                  name="user"
                  value={filter.user}
                  onChange={handleFilterChange}
                  className="w-full border px-3 py-2 rounded">
                  <option value="">All</option>
                  {unique(auditLogs, "user").map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Action
                </label>
                <select
                  name="action"
                  value={filter.action}
                  onChange={handleFilterChange}
                  className="w-full border px-3 py-2 rounded">
                  <option value="">All</option>
                  {unique(auditLogs, "action").map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  name="date"
                  type="date"
                  value={filter.date}
                  onChange={handleFilterChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={clearFilter}
                  className="px-4 py-2 bg-gray-200 rounded">
                  Clear
                </button>
                <button
                  type="button"
                  onClick={closeFilterModal}
                  className="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded">
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audit;
