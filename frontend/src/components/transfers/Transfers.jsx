import React, { useEffect, useState } from "react";
import api from "../../services/api";

const statusColors = {
  Completed: "bg-green-100 text-green-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
};

// Utility to format date for <input type="date" />
function formatDateForInput(dateString) {
  if (!dateString) return "";
  // Handles both ISO and yyyy-MM-dd
  return dateString.split("T")[0];
}

const Transfers = () => {
  const user = JSON.parse(localStorage.getItem("kristalball_user"));
  const isAdmin = user?.role === "admin";

  const [transfers, setTransfers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [form, setForm] = useState({
    assetId: "",
    fromBaseId: "",
    toBaseId: "",
    transferredBy: "",
    transferDate: "",
    status: "In Progress",
    reason: "",
    quantity: 1,
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getTransfers(), api.getAssets(), api.getBases()])
      .then(([transferData, assetData, baseData]) => {
        setTransfers(
          (transferData.transfers || []).map((t) => ({
            id: t.id,
            assetId: t.Asset?.id || t.asset_id || "",
            assetName: t.Asset?.description || t.assetName || "",
            fromBaseId: t.fromBase?.id || t.from_base_id || "",
            fromLocation: t.fromBase?.name || t.fromLocation || "",
            toBaseId: t.toBase?.id || t.to_base_id || "",
            toLocation: t.toBase?.name || t.toLocation || "",
            transferredBy: t.transferredBy || "",
            transferDate: t.date || t.transferDate || "",
            status: t.status || "In Progress",
            reason: t.reason || "",
            quantity: t.quantity || 1,
          }))
        );
        setAssets(assetData.assets || []);
        setBases(baseData.bases || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load transfers/assets/bases");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("Transfers state:", transfers);
  }, [transfers]);

  useEffect(() => {
    console.log(
      "Transfers state changed at:",
      new Date().toLocaleTimeString(),
      "Count:",
      transfers.length
    );
    console.log("Full transfers data:", JSON.stringify(transfers, null, 2));
  }, [transfers, lastUpdate]);

  // Add
  const openAddModal = () => {
    setForm({
      assetId: "",
      fromBaseId: "",
      toBaseId: "",
      transferredBy: "",
      transferDate: "",
      status: "In Progress",
      reason: "",
      quantity: 1,
    });
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);
  const handleAdd = (e) => {
    e.preventDefault();
    // Validate required fields
    if (
      !form.assetId ||
      !form.fromBaseId ||
      !form.toBaseId ||
      !form.transferredBy
    ) {
      alert("Please fill in all required fields");
      return;
    }
    if (form.fromBaseId === form.toBaseId) {
      alert("From and To base cannot be the same");
      return;
    }
    // Map form data to backend format
    const transferData = {
      asset_id: parseInt(form.assetId),
      from_base_id: parseInt(form.fromBaseId),
      to_base_id: parseInt(form.toBaseId),
      quantity: parseInt(form.quantity) || 1,
      date: form.transferDate
        ? new Date(form.transferDate).toISOString()
        : new Date().toISOString(),
      transferred_by: form.transferredBy,
      reason: form.reason || "",
      status: form.status,
    };
    api
      .createTransfer(transferData)
      .then((response) => {
        // Refresh the transfers list
        api.getTransfers().then((data) => {
          console.log("Fresh transfers data:", data);
          console.log("Raw transfer objects:", data.transfers);
          setTransfers(
            (data.transfers || []).map((t) => {
              console.log("Raw transfer object keys:", Object.keys(t));
              console.log("Raw transfer object:", t);
              console.log("transferred_by value:", t.transferred_by);
              const mapped = {
                id: t.id,
                assetId: t.Asset?.id || t.asset_id || "",
                assetName: t.Asset?.description || t.assetName || "",
                fromBaseId: t.fromBase?.id || t.from_base_id || "",
                fromLocation: t.fromBase?.name || t.fromLocation || "",
                toBaseId: t.toBase?.id || t.to_base_id || "",
                toLocation: t.toBase?.name || t.toLocation || "",
                transferredBy: t.transferred_by || t.transferredBy || "",
                transferDate: t.date || t.transferDate || "",
                status: t.status || "In Progress",
                reason: t.reason || "",
                quantity: t.quantity || 1,
              };
              console.log("Mapped transfer:", mapped);
              return mapped;
            })
          );
          setShowAddModal(false);
          setForm({
            assetId: "",
            fromBaseId: "",
            toBaseId: "",
            transferredBy: "",
            transferDate: "",
            status: "In Progress",
            reason: "",
            quantity: 1,
          });
          alert("Transfer created successfully!");
        });
      })
      .catch((error) => {
        console.error("Error creating transfer:", error);
        alert("Failed to create transfer. Please try again.");
      });
  };

  // Edit
  const openEditModal = (transfer) => {
    setSelectedTransfer(transfer);
    setForm({
      assetId: transfer.assetId,
      fromBaseId: transfer.fromBaseId,
      toBaseId: transfer.toBaseId,
      transferredBy: transfer.transferredBy,
      transferDate: transfer.transferDate,
      status: transfer.status,
      reason: transfer.reason,
      quantity: transfer.quantity,
    });
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);
  const handleEdit = (e) => {
    e.preventDefault();
    if (!selectedTransfer) return;

    // Validate required fields
    if (
      !form.assetId ||
      !form.fromBaseId ||
      !form.toBaseId ||
      !form.transferredBy
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Map form data to backend format
    const transferData = {
      asset_id: parseInt(form.assetId),
      from_base_id: parseInt(form.fromBaseId),
      to_base_id: parseInt(form.toBaseId),
      quantity: parseInt(form.quantity) || 1,
      date: form.transferDate
        ? new Date(form.transferDate).toISOString()
        : undefined,
      transferred_by: form.transferredBy,
      reason: form.reason,
      status: form.status,
    };
    console.log("Submitting transfer update:", transferData);

    api
      .updateTransfer(selectedTransfer.id, transferData)
      .then((response) => {
        console.log("Update response:", response);
        api.getTransfers().then((data) => {
          console.log("Fresh transfers data:", data);
          console.log("Raw transfer objects:", data.transfers);
          setTransfers(
            (data.transfers || []).map((t) => {
              console.log("Raw transfer object keys:", Object.keys(t));
              console.log("Raw transfer object:", t);
              console.log("transferred_by value:", t.transferred_by);
              const mapped = {
                id: t.id,
                assetId: t.Asset?.id || t.asset_id || "",
                assetName: t.Asset?.description || t.assetName || "",
                fromBaseId: t.fromBase?.id || t.from_base_id || "",
                fromLocation: t.fromBase?.name || t.fromLocation || "",
                toBaseId: t.toBase?.id || t.to_base_id || "",
                toLocation: t.toBase?.name || t.toLocation || "",
                transferredBy: t.transferred_by || t.transferredBy || "",
                transferDate: t.date || t.transferDate || "",
                status: t.status || "In Progress",
                reason: t.reason || "",
                quantity: t.quantity || 1,
              };
              console.log("Mapped transfer:", mapped);
              return mapped;
            })
          );
          setLastUpdate(Date.now());
          setShowEditModal(false);
          setSelectedTransfer(null);
          setForm({
            assetId: "",
            fromBaseId: "",
            toBaseId: "",
            transferredBy: "",
            transferDate: "",
            status: "In Progress",
            reason: "",
            quantity: 1,
          });
          alert("Transfer updated successfully!");
        });
      })
      .catch((error) => {
        console.error("Error updating transfer:", error);
        alert("Failed to update transfer. Please try again.");
      });
  };

  // Delete
  const openDeleteModal = (transfer) => {
    setSelectedTransfer(transfer);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);
  const handleDelete = () => {
    if (!selectedTransfer) return;

    api
      .deleteTransfer(selectedTransfer.id)
      .then((response) => {
        // Refresh the transfers list
        api.getTransfers().then((data) => {
          console.log("Fresh transfers data:", data);
          console.log("Raw transfer objects:", data.transfers);
          setTransfers(
            (data.transfers || []).map((t) => {
              console.log("Raw transfer object keys:", Object.keys(t));
              console.log("Raw transfer object:", t);
              console.log("transferred_by value:", t.transferred_by);
              const mapped = {
                id: t.id,
                assetId: t.Asset?.id || t.asset_id || "",
                assetName: t.Asset?.description || t.assetName || "",
                fromBaseId: t.fromBase?.id || t.from_base_id || "",
                fromLocation: t.fromBase?.name || t.fromLocation || "",
                toBaseId: t.toBase?.id || t.to_base_id || "",
                toLocation: t.toBase?.name || t.toLocation || "",
                transferredBy: t.transferred_by || t.transferredBy || "",
                transferDate: t.date || t.transferDate || "",
                status: t.status || "In Progress",
                reason: t.reason || "",
                quantity: t.quantity || 1,
              };
              console.log("Mapped transfer:", mapped);
              return mapped;
            })
          );
        });
        setShowDeleteModal(false);
        setSelectedTransfer(null);
        alert("Transfer deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting transfer:", error);
        alert("Failed to delete transfer. Please try again.");
      });
  };

  // Form change
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Debug print before table rendering
  console.log("Rendering table with transfers:", transfers);
  console.log("Transfers array content:", JSON.stringify(transfers, null, 2));

  if (loading) return <div className="p-6">Loading transfers...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
              Transfers
            </h1>
            <p className="text-gray-600 dark:text-[#a1a1aa]">
              Manage asset transfers between locations
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              New Transfer
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-2 py-3 sm:px-4 sm:py-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transferred By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transfer Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transfers.map((transfer) => (
                  <tr
                    key={transfer.id}
                    className="text-xs sm:text-sm hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transfer.assetName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transfer.fromLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transfer.toLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transfer.transferredBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transfer.transferDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[transfer.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}>
                        {transfer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transfer.reason}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(transfer)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3">
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(transfer)}
                          className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Transfer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Transfer</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <select
                name="assetId"
                value={form.assetId}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">Select Asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.description} (SN: {asset.serial_number})
                  </option>
                ))}
              </select>
              <select
                name="fromBaseId"
                value={form.fromBaseId}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">From Base</option>
                {bases.map((base) => (
                  <option key={base.id} value={base.id}>
                    {base.name}
                  </option>
                ))}
              </select>
              <select
                name="toBaseId"
                value={form.toBaseId}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">To Base</option>
                {bases.map((base) => (
                  <option key={base.id} value={base.id}>
                    {base.name}
                  </option>
                ))}
              </select>
              <input
                name="transferredBy"
                value={form.transferredBy}
                onChange={handleFormChange}
                required
                placeholder="Transferred By"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="transferDate"
                value={formatDateForInput(form.transferDate)}
                onChange={handleFormChange}
                required
                placeholder="Transfer Date"
                type="date"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded">
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                name="reason"
                value={form.reason}
                onChange={handleFormChange}
                required
                placeholder="Reason"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="quantity"
                value={form.quantity}
                onChange={handleFormChange}
                required
                placeholder="Quantity"
                type="number"
                min="1"
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transfer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Transfer</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <select
                name="assetId"
                value={form.assetId}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">Select Asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.description} (SN: {asset.serial_number})
                  </option>
                ))}
              </select>
              <select
                name="fromBaseId"
                value={form.fromBaseId}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">From Base</option>
                {bases.map((base) => (
                  <option key={base.id} value={base.id}>
                    {base.name}
                  </option>
                ))}
              </select>
              <select
                name="toBaseId"
                value={form.toBaseId}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">To Base</option>
                {bases.map((base) => (
                  <option key={base.id} value={base.id}>
                    {base.name}
                  </option>
                ))}
              </select>
              <input
                name="transferredBy"
                value={form.transferredBy}
                onChange={handleFormChange}
                required
                placeholder="Transferred By"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="transferDate"
                value={formatDateForInput(form.transferDate)}
                onChange={handleFormChange}
                required
                placeholder="Transfer Date"
                type="date"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded">
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                name="reason"
                value={form.reason}
                onChange={handleFormChange}
                required
                placeholder="Reason"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="quantity"
                value={form.quantity}
                onChange={handleFormChange}
                required
                placeholder="Quantity"
                type="number"
                min="1"
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Delete Transfer</h2>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedTransfer?.assetName}</span>?
            </p>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;
