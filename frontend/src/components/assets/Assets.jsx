import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const statusColors = {
  Assigned: "bg-green-100 text-green-800",
  Available: "bg-blue-100 text-blue-800",
  Maintenance: "bg-yellow-100 text-yellow-800",
  assigned: "bg-green-100 text-green-800",
  available: "bg-blue-100 text-blue-800",
  maintenance: "bg-yellow-100 text-yellow-800",
};

const Assets = () => {
  // Replace with useAuth() if using context, or pass user as prop
  const user = JSON.parse(localStorage.getItem("kristalball_user"));
  const isAdmin = user?.role === "admin";

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    status: "Available",
    assignedTo: "",
    purchaseDate: "",
    value: "",
  });

  useEffect(() => {
    setLoading(true);
    api
      .getAssets()
      .then((data) => {
        setAssets(
          (data.assets || []).map((a) => ({
            id: a.id || a.asset_id,
            name: a.description || a.name || "",
            category: a.type || a.category || "",
            status: a.status || "Available",
            assignedTo: a.assignedTo || "-",
            purchaseDate: a.purchaseDate || a.createdAt || "",
            value: a.value || "",
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load assets");
        setLoading(false);
      });
  }, []);

  // Handlers for Add
  const openAddModal = () => {
    setForm({
      name: "",
      category: "",
      status: "Available",
      assignedTo: "",
      purchaseDate: "",
      value: "",
    });
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);
  const handleAdd = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!form.name || !form.category) {
      alert("Please fill in all required fields");
      return;
    }

    // Map form data to backend format
    const assetData = {
      name: form.name,
      description: form.description || "",
      type: form.category,
      status: form.status.toLowerCase(),
      serial_number: `${form.category.toUpperCase()}-${Date.now()}`,
      base_id: 1, // Default base ID
      value: form.value ? parseFloat(form.value) : null,
    };

    api
      .createAsset(assetData)
      .then((response) => {
        // Refresh the assets list
        api.getAssets().then((data) => {
          setAssets(
            (data.assets || []).map((a) => ({
              id: a.id || a.asset_id,
              name: a.description || a.name || "",
              category: a.type || a.category || "",
              status: a.status || "Available",
              assignedTo: a.assignedTo || "-",
              purchaseDate: a.purchaseDate || a.createdAt || "",
              value: a.value || "",
            }))
          );
        });
        setShowAddModal(false);
        setForm({
          name: "",
          category: "",
          status: "Available",
          assignedTo: "",
          purchaseDate: "",
          value: "",
        });
      })
      .catch((error) => {
        console.error("Error creating asset:", error);
      });
  };

  // Handlers for Edit
  const openEditModal = (asset) => {
    setSelectedAsset(asset);
    setForm({ ...asset });
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);
  const handleEdit = (e) => {
    e.preventDefault();
    if (!selectedAsset) return;

    // Validate required fields
    if (!form.name || !form.category) {
      alert("Please fill in all required fields");
      return;
    }

    // Map form data to backend format
    const assetData = {
      description: form.name,
      type: form.category,
      status: form.status.toLowerCase(),
      value: form.value ? parseFloat(form.value) : null,
    };

    api
      .updateAsset(selectedAsset.id, assetData)
      .then((response) => {
        // Refresh the assets list
        api.getAssets().then((data) => {
          setAssets(
            (data.assets || []).map((a) => ({
              id: a.id || a.asset_id,
              name: a.description || a.name || "",
              category: a.type || a.category || "",
              status: a.status || "Available",
              assignedTo: a.assignedTo || "-",
              purchaseDate: a.purchaseDate || a.createdAt || "",
              value: a.value || "",
            }))
          );
        });
        setShowEditModal(false);
        setSelectedAsset(null);
        setForm({
          name: "",
          category: "",
          status: "Available",
          assignedTo: "",
          purchaseDate: "",
          value: "",
        });
      })
      .catch((error) => {
        console.error("Error updating asset:", error);
      });
  };

  // Handlers for Delete
  const openDeleteModal = (asset) => {
    setSelectedAsset(asset);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);
  const handleDelete = () => {
    if (!selectedAsset) return;
    console.log("Deleting asset:", selectedAsset);

    api
      .deleteAsset(selectedAsset.id)
      .then((response) => {
        api.getAssets().then((data) => {
          console.log("Assets after delete:", data.assets); // Debug
          setAssets(
            (data.assets || []).map((a) => ({
              id: a.id || a.asset_id,
              name: a.description || a.name || "",
              category: a.type || a.category || "",
              status: a.status || "Available",
              assignedTo: a.assignedTo || "-",
              purchaseDate: a.purchaseDate || a.createdAt || "",
              value: a.value || "",
            }))
          );
        });
        setShowDeleteModal(false);
        setSelectedAsset(null);
      })
      .catch((error) => {
        console.error("Error deleting asset:", error);
      });
  };

  // Form change handler
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-6">Loading assets...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
              Assets
            </h1>
            <p className="text-gray-600 dark:text-[#a1a1aa]">
              Manage your organization's assets
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Add Asset
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
                    Asset Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[asset.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.purchaseDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.value}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(asset)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3">
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(asset)}
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

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Asset</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
                placeholder="Asset Name"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="category"
                value={form.category}
                onChange={handleFormChange}
                required
                placeholder="Category"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded">
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <input
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleFormChange}
                placeholder="Assigned To"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleFormChange}
                required
                placeholder="Purchase Date"
                type="date"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="value"
                value={form.value}
                onChange={handleFormChange}
                required
                placeholder="Value"
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

      {/* Edit Asset Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Asset</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
                placeholder="Asset Name"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="category"
                value={form.category}
                onChange={handleFormChange}
                required
                placeholder="Category"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded">
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <input
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleFormChange}
                placeholder="Assigned To"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleFormChange}
                required
                placeholder="Purchase Date"
                type="date"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="value"
                value={form.value}
                onChange={handleFormChange}
                required
                placeholder="Value"
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
            <h2 className="text-xl font-semibold mb-4">Delete Asset</h2>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedAsset?.name}</span>?
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

export default Assets;
