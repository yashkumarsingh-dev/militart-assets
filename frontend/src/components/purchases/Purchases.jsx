import React, { useEffect, useState } from "react";
import api from "../../services/api";

const statusColors = {
  Approved: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Rejected: "bg-red-100 text-red-800",
};

const Purchases = () => {
  const user = JSON.parse(localStorage.getItem("kristalball_user"));
  const isAdmin = user?.role === "admin";

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [form, setForm] = useState({
    itemName: "",
    requestedBy: "",
    requestedDate: "",
    status: "Pending",
    amount: "",
    approvedBy: "",
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    setLoading(true);
    api
      .getPurchases()
      .then((data) => {
        setPurchases(
          (data.purchases || []).map((p) => ({
            id: p.id,
            itemName: p.asset_type || "",
            requestedBy: p.requested_by || "",
            requestedDate: p.date || "",
            status: p.status || "Pending",
            amount: p.quantity || "",
            approvedBy: p.approved_by || "",
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load purchases");
        setLoading(false);
      });
  }, []);

  // Utility function to format ISO date to yyyy-MM-dd
  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    // Handles both ISO and yyyy-MM-dd
    if (isoString.length > 10) {
      return isoString.split("T")[0];
    }
    return isoString;
  };

  // Utility function to format ISO date to yyyy-MM-dd
  const formatDateForDisplay = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  // Add
  const openAddModal = () => {
    setForm({
      itemName: "",
      requestedBy: "",
      requestedDate: "",
      status: "Pending",
      amount: "",
      approvedBy: "",
    });
    api.getAssets().then((data) => {
      setAssets(data.assets || []);
      setShowAddModal(true);
    });
  };
  const closeAddModal = () => setShowAddModal(false);
  const handleAdd = async (e) => {
    if (e) e.preventDefault();
    if (adding) return;
    setAddError(""); // Clear previous error
    if (!form.itemName || !form.requestedBy || !form.amount) {
      setAddError("Please fill in all required fields");
      return;
    }

    setAdding(true);
    const purchaseData = {
      asset_id: parseInt(form.itemName),
      quantity: parseInt(form.amount) || 1,
      base_id: 1, // Default base ID - you might want to make this dynamic
      date: form.requestedDate || new Date().toISOString(),
      requested_by: form.requestedBy,
      status: form.status || "Pending",
      approved_by: form.approvedBy || null,
    };

    try {
      await api.createPurchase(purchaseData);
      const data = await api.getPurchases();
      setPurchases(
        (data.purchases || []).map((p) => ({
          id: p.id,
          itemName: p.asset_type || "",
          requestedBy: p.requested_by || "",
          requestedDate: p.date || "",
          status: p.status || "Pending",
          amount: p.quantity || "",
          approvedBy: p.approved_by || "",
        }))
      );
      setShowAddModal(false);
      setForm({
        itemName: "",
        requestedBy: "",
        requestedDate: "",
        status: "Pending",
        amount: "",
        approvedBy: "",
      });
      // Optionally show a success message here
    } catch (error) {
      setAddError(
        error?.message?.includes("403")
          ? "You do not have permission to add purchases. Please log in as an admin, base commander, or logistics officer."
          : "Failed to create purchase request. Please try again."
      );
      // Do not close the modal, let user fix and retry
    } finally {
      setAdding(false);
    }
  };

  // Edit
  const openEditModal = (purchase) => {
    setSelectedPurchase(purchase);
    setForm({ ...purchase });
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);
  const handleEdit = (e) => {
    if (e) e.preventDefault();
    if (!selectedPurchase) return;

    // Validate required fields
    if (!form.itemName || !form.requestedBy || !form.amount) {
      alert("Please fill in all required fields");
      return;
    }

    // Map form data to backend format
    const purchaseData = {
      asset_type: form.itemName,
      quantity: parseInt(form.amount) || 1,
      date: form.requestedDate
        ? new Date(form.requestedDate).toISOString()
        : undefined,
      requested_by: form.requestedBy,
      status: form.status,
      approved_by: form.approvedBy || null,
    };
    console.log("Submitting purchase update:", purchaseData);

    api
      .updatePurchase(selectedPurchase.id, purchaseData)
      .then((response) => {
        // Refresh the purchases list
        api.getPurchases().then((data) => {
          setPurchases(
            (data.purchases || []).map((p) => ({
              id: p.id,
              itemName: p.asset_type || "",
              requestedBy: p.requested_by || "",
              requestedDate: p.date || "",
              status: p.status || "Pending",
              amount: p.quantity || "",
              approvedBy: p.approved_by || "",
            }))
          );
        });
        setShowEditModal(false);
        setSelectedPurchase(null);
        setForm({
          itemName: "",
          requestedBy: "",
          requestedDate: "",
          status: "Pending",
          amount: "",
          approvedBy: "",
        });
        alert("Purchase request updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating purchase:", error);
        alert("Failed to update purchase request. Please try again.");
      });
  };

  // Delete
  const openDeleteModal = (purchase) => {
    setSelectedPurchase(purchase);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);
  const handleDelete = () => {
    if (!selectedPurchase) return;

    api
      .deletePurchase(selectedPurchase.id)
      .then((response) => {
        // Refresh the purchases list
        api.getPurchases().then((data) => {
          setPurchases(
            (data.purchases || []).map((p) => ({
              id: p.id,
              itemName: p.asset_type || "",
              requestedBy: p.requested_by || "",
              requestedDate: p.date || "",
              status: p.status || "Pending",
              amount: p.quantity || "",
              approvedBy: p.approved_by || "",
            }))
          );
        });
        setShowDeleteModal(false);
        setSelectedPurchase(null);
        // Optionally show a success message here
      })
      .catch((error) => {
        // Optionally show an error message here
      });
  };

  // Form change
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-6">Loading purchases...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
              Purchases
            </h1>
            <p className="text-gray-600 dark:text-[#a1a1aa]">
              Manage purchase requests and orders
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              New Purchase Request
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approved By
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {purchase.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.requestedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateForDisplay(purchase.requestedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[purchase.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}>
                        {purchase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.approvedBy}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(purchase)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3">
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(purchase)}
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

      {/* Add Purchase Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Purchase</h2>
            {addError && <div className="text-red-600 mb-2">{addError}</div>}
            <form onSubmit={handleAdd} className="space-y-4">
              <select
                name="itemName"
                value={form.itemName}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">Select Asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.description || asset.name} (SN: {asset.serial_number}
                    )
                  </option>
                ))}
              </select>
              <input
                name="requestedBy"
                value={form.requestedBy}
                onChange={handleFormChange}
                required
                placeholder="Requested By"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="requestedDate"
                value={formatDateForInput(form.requestedDate)}
                onChange={handleFormChange}
                required
                placeholder="Requested Date"
                type="date"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded">
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                name="amount"
                value={form.amount}
                onChange={handleFormChange}
                required
                placeholder="Amount"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="approvedBy"
                value={form.approvedBy}
                onChange={handleFormChange}
                placeholder="Approved By"
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                  disabled={adding}>
                  {adding ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Purchase Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Purchase</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <input
                name="itemName"
                value={form.itemName}
                onChange={handleFormChange}
                required
                placeholder="Item Name"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="requestedBy"
                value={form.requestedBy}
                onChange={handleFormChange}
                required
                placeholder="Requested By"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="requestedDate"
                value={formatDateForInput(form.requestedDate)}
                onChange={handleFormChange}
                required
                placeholder="Requested Date"
                type="date"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded">
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                name="amount"
                value={form.amount}
                onChange={handleFormChange}
                required
                placeholder="Amount"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="approvedBy"
                value={form.approvedBy}
                onChange={handleFormChange}
                placeholder="Approved By"
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
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Delete Purchase</h2>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedPurchase?.itemName}</span>?
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

export default Purchases;
