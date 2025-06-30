import React, { useEffect, useState } from "react";
import api from "../../services/api";

const statusColors = {
  Active: "bg-green-100 text-green-800",
  Returned: "bg-gray-100 text-gray-800",
};

const Assignments = () => {
  const user = JSON.parse(localStorage.getItem("kristalball_user"));
  const isAdmin = user?.role === "admin";

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [form, setForm] = useState({
    assetName: "",
    assignedTo: "",
    assignedBy: "",
    assignedDate: "",
    status: "Active",
    returnDate: "",
  });
  const [availableAssets, setAvailableAssets] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getAssignments(), api.getUsers()])
      .then(([assignmentsData, usersData]) => {
        setUsers(usersData.users || []);
        setAssignments(
          (assignmentsData.assignments || []).map((a) => ({
            id: a.id,
            assetName: a.Asset?.description || a.assetName || "",
            assignedTo: a.Personnel?.id || a.personnel_id || "",
            assignedBy: a.assigned_by || "",
            assignedDate: a.assigned_date || a.assignedDate || "",
            status: a.expended_date ? "Returned" : "Active",
            returnDate: a.expended_date || a.returnDate || "",
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load assignments");
        setLoading(false);
      });
  }, []);

  // Add
  const openAddModal = () => {
    setForm({
      assetName: "",
      assignedTo: "",
      assignedBy: "",
      assignedDate: "",
      status: "Active",
      returnDate: "",
    });
    api.getAssets().then((data) => {
      setAvailableAssets(data.assets || []);
      setShowAddModal(true);
    });
  };
  const closeAddModal = () => setShowAddModal(false);
  const handleAdd = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!form.assetName || !form.assignedTo || !form.assignedBy) {
      alert("Please fill in all required fields");
      return;
    }

    // Map form data to backend format
    const assignmentData = {
      asset_id: parseInt(form.assetName),
      personnel_id: parseInt(form.assignedTo),
      assigned_at: form.assignedDate || new Date().toISOString(),
      assigned_by: parseInt(form.assignedBy),
    };

    api
      .createAssignment(assignmentData)
      .then((response) => {
        // Refresh the assignments list
        api.getAssignments().then((data) => {
          setAssignments(
            (data.assignments || []).map((a) => ({
              id: a.id,
              assetName: a.Asset?.description || a.assetName || "",
              assignedTo: a.Personnel?.id || a.personnel_id || "",
              assignedBy: a.assigned_by || "",
              assignedDate: a.assigned_date || a.assignedDate || "",
              status: a.expended_date ? "Returned" : "Active",
              returnDate: a.expended_date || a.returnDate || "",
            }))
          );
        });
        setShowAddModal(false);
        setForm({
          assetName: "",
          assignedTo: "",
          assignedBy: "",
          assignedDate: "",
          status: "Active",
          returnDate: "",
        });
        alert("Assignment created successfully!");
      })
      .catch((error) => {
        console.error("Error creating assignment:", error);
        alert("Failed to create assignment. Please try again.");
      });
  };

  // Edit
  const openEditModal = (assignment) => {
    setSelectedAssignment(assignment);
    setForm({ ...assignment });
    setShowEditModal(true);
    // Fetch assets for dropdown
    api.getAssets().then((data) => {
      setAvailableAssets(data.assets || []);
    });
  };
  const closeEditModal = () => setShowEditModal(false);
  const handleEdit = (e) => {
    if (e) e.preventDefault();
    if (!selectedAssignment) return;

    // Validate required fields
    if (!form.assetName || !form.assignedTo || !form.assignedBy) {
      alert("Please fill in all required fields");
      return;
    }

    // Map form data to backend format
    const assignmentData = {
      asset_id: parseInt(form.assetName),
      personnel_id: parseInt(form.assignedTo),
      assigned_date: form.assignedDate,
      assigned_by: parseInt(form.assignedBy),
      expended_date: form.status === "Returned" ? form.returnDate : null,
    };

    api
      .updateAssignment(selectedAssignment.id, assignmentData)
      .then((response) => {
        // Refresh the assignments list
        api.getAssignments().then((data) => {
          setAssignments(
            (data.assignments || []).map((a) => ({
              id: a.id,
              assetName: a.Asset?.description || a.assetName || "",
              assignedTo: a.Personnel?.id || a.personnel_id || "",
              assignedBy: a.assigned_by || "",
              assignedDate: a.assigned_date || a.assignedDate || "",
              status: a.expended_date ? "Returned" : "Active",
              returnDate: a.expended_date || a.returnDate || "",
            }))
          );
        });
        setShowEditModal(false);
        setSelectedAssignment(null);
        setForm({
          assetName: "",
          assignedTo: "",
          assignedBy: "",
          assignedDate: "",
          status: "Active",
          returnDate: "",
        });
        alert("Assignment updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating assignment:", error);
        alert("Failed to update assignment. Please try again.");
      });
  };

  // Delete
  const openDeleteModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);
  const handleDelete = () => {
    if (!selectedAssignment) return;

    api
      .deleteAssignment(selectedAssignment.id)
      .then((response) => {
        // Refresh the assignments list
        api.getAssignments().then((data) => {
          setAssignments(
            (data.assignments || []).map((a) => ({
              id: a.id,
              assetName: a.Asset?.description || a.assetName || "",
              assignedTo: a.Personnel?.id || a.personnel_id || "",
              assignedBy: a.assigned_by || "",
              assignedDate: a.assigned_date || a.assignedDate || "",
              status: a.expended_date ? "Returned" : "Active",
              returnDate: a.expended_date || a.returnDate || "",
            }))
          );
        });
        setShowDeleteModal(false);
        setSelectedAssignment(null);
        alert("Assignment deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting assignment:", error);
        alert("Failed to delete assignment. Please try again.");
      });
  };

  // Form change
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-6">Loading assignments...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#f3f4f6]">
              Assignments
            </h1>
            <p className="text-gray-600 dark:text-[#a1a1aa]">
              Manage asset assignments to users
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              New Assignment
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
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return Date
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {assignment.assetName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {users.find(
                        (u) => u.id === parseInt(assignment.assignedTo)
                      )?.name || assignment.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {users.find(
                        (u) => u.id === parseInt(assignment.assignedBy)
                      )?.name || assignment.assignedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.assignedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[assignment.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.returnDate}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(assignment)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3">
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(assignment)}
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

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Assignment</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <select
                name="assetName"
                value={form.assetName}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">Select Asset</option>
                {availableAssets.map((asset) => (
                  <option
                    key={asset.id || asset.asset_id}
                    value={asset.id || asset.asset_id}>
                    {asset.description || asset.name} (SN: {asset.serial_number}
                    )
                  </option>
                ))}
              </select>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">Select Personnel</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <select
                name="assignedBy"
                value={form.assignedBy}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">Select Assigned By</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <input
                name="assignedDate"
                value={form.assignedDate}
                onChange={handleFormChange}
                required
                placeholder="Assigned Date"
                type="date"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded">
                <option value="Active">Active</option>
                <option value="Returned">Returned</option>
              </select>
              <input
                name="returnDate"
                value={form.returnDate}
                onChange={handleFormChange}
                required
                placeholder="Return Date"
                type="date"
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

      {/* Edit Assignment Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Assignment</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <select
                name="assetName"
                value={form.assetName}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">Select Asset</option>
                {availableAssets.map((asset) => (
                  <option
                    key={asset.id || asset.asset_id}
                    value={asset.id || asset.asset_id}>
                    {asset.description || asset.name} (SN: {asset.serial_number}
                    )
                  </option>
                ))}
              </select>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">Select Personnel</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <select
                name="assignedBy"
                value={form.assignedBy}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded">
                <option value="">Select Assigned By</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <input
                name="assignedDate"
                value={form.assignedDate}
                onChange={handleFormChange}
                required
                placeholder="Assigned Date"
                type="date"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded">
                <option value="Active">Active</option>
                <option value="Returned">Returned</option>
              </select>
              <input
                name="returnDate"
                value={form.returnDate}
                onChange={handleFormChange}
                required
                placeholder="Return Date"
                type="date"
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
            <h2 className="text-xl font-semibold mb-4">Delete Assignment</h2>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedAssignment?.assetName}</span>
              ?
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

export default Assignments;
