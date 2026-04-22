import { useEffect, useState } from "react";
import { API } from "../../utils/host";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const [editForm, setEditForm] = useState({
    user_id: "",
    name: "",
    gender: "",
    address: {
      flat_no: "",
      building_name: "",
      area_name: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const [createForm, setCreateForm] = useState({
    user_id: "",
    name: "",
    gender: "",
    address: {
      flat_no: "",
      building_name: "",
      area_name: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  // GET API - fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(API.GET_ALL_USERS);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatAddress = (address) => {
    if (!address) return "-";

    return [
      address.flat_no,
      address.building_name,
      address.area_name,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const getEmptyUserForm = () => ({
    user_id: "",
    name: "",
    gender: "",
    address: {
      flat_no: "",
      building_name: "",
      area_name: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  // open view modal
  const handleView = (user) => {
    setSelectedUser(user);
  };

  // open edit modal and set form values
  const handleEditOpen = (user) => {
    setEditForm({
      user_id: user.user_id || "",
      name: user.name || "",
      gender: user.gender || "",
      address: {
        flat_no: user.address?.flat_no || "",
        building_name: user.address?.building_name || "",
        area_name: user.address?.area_name || "",
        landmark: user.address?.landmark || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      },
    });
  };

  // open create modal with empty form
  const handleCreateOpen = () => {
    setCreateForm(getEmptyUserForm());
  };

  // handle normal input change for edit
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle address input change for edit
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // handle normal input change for create
  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle address input change for create
  const handleCreateAddressChange = (e) => {
    const { name, value } = e.target;

    setCreateForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // create new user in DB and UI
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);

      const response = await fetch(API.ADD_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Failed to create user");
        return;
      }

      // update UI immediately
      setUsers((prevUsers) => [
        {
          user_id: createForm.user_id,
          name: createForm.name,
          gender: createForm.gender,
          address: { ...createForm.address },
        },
        ...prevUsers,
      ]);

      // reset form
      setCreateForm(getEmptyUserForm());

      // close modal
      document.getElementById("closeCreateModalBtn").click();

      alert(data.message || "User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Something went wrong while creating user");
    } finally {
      setCreating(false);
    }
  };

  // update user in DB and UI
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch(API.EDIT_USER, {
        method: "PUT", // if your backend uses POST, change this to "POST"
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update user");
        return;
      }

      // update UI immediately
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === editForm.user_id
            ? {
                ...user,
                name: editForm.name,
                gender: editForm.gender,
                address: { ...editForm.address },
              }
            : user,
        ),
      );

      // close modal
      document.getElementById("closeEditModalBtn").click();

      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Something went wrong while updating user");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(API.DELETE_USER, {
        method: "DELETE",
        headers: {
          mobile_number: user_id,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete user");
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.user_id !== user_id),
      );

      alert(data.message || "User deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting user");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Users</h2>
          <p className="text-muted mb-0">Manage all registered users</p>
        </div>

        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#createUserModal"
          onClick={handleCreateOpen}
        >
          Add New User
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Address</th>
                  <th style={{ width: "220px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.user_id}</td>
                      <td>{user.name}</td>
                      <td>{user.gender}</td>
                      <td>{formatAddress(user.address)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#viewUserModal"
                            onClick={() => handleView(user)}
                          >
                            View
                          </button>

                          <button
                            className="btn btn-sm btn-outline-secondary"
                            data-bs-toggle="modal"
                            data-bs-target="#editUserModal"
                            onClick={() => handleEditOpen(user)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteUser(user.user_id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <div
        className="modal fade"
        id="createUserModal"
        tabIndex="-1"
        aria-labelledby="createUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleCreateUser}>
              <div className="modal-header">
                <h5 className="modal-title" id="createUserModalLabel">
                  Add New User
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">User ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="user_id"
                      value={createForm.user_id}
                      onChange={handleCreateInputChange}
                      placeholder="Enter mobile number / user id"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={createForm.name}
                      onChange={handleCreateInputChange}
                      placeholder="Enter user name"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={createForm.gender}
                      onChange={handleCreateInputChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <h6 className="mt-3">Address Details</h6>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Flat No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="flat_no"
                      value={createForm.address.flat_no}
                      onChange={handleCreateAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Building Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="building_name"
                      value={createForm.address.building_name}
                      onChange={handleCreateAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Area Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="area_name"
                      value={createForm.address.area_name}
                      onChange={handleCreateAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Landmark</label>
                    <input
                      type="text"
                      className="form-control"
                      name="landmark"
                      value={createForm.address.landmark}
                      onChange={handleCreateAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={createForm.address.city}
                      onChange={handleCreateAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={createForm.address.state}
                      onChange={handleCreateAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pincode"
                      value={createForm.address.pincode}
                      onChange={handleCreateAddressChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeCreateModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      <div
        className="modal fade"
        id="viewUserModal"
        tabIndex="-1"
        aria-labelledby="viewUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title" id="viewUserModalLabel">
                User Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {selectedUser ? (
                <>
                  <div className="card border-0 bg-light mb-4">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <div className="small text-muted">User ID</div>
                          <div className="fw-semibold">
                            {selectedUser.user_id || "-"}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="small text-muted">Name</div>
                          <div className="fw-semibold">
                            {selectedUser.name || "-"}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="small text-muted">Gender</div>
                          <div className="fw-semibold">
                            {selectedUser.gender || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h6 className="mb-3">Address Details</h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="border rounded p-3 h-100">
                        <div className="small text-muted mb-1">Flat No</div>
                        <div className="fw-semibold">
                          {selectedUser.address?.flat_no || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded p-3 h-100">
                        <div className="small text-muted mb-1">
                          Building Name
                        </div>
                        <div className="fw-semibold">
                          {selectedUser.address?.building_name || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded p-3 h-100">
                        <div className="small text-muted mb-1">Area Name</div>
                        <div className="fw-semibold">
                          {selectedUser.address?.area_name || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded p-3 h-100">
                        <div className="small text-muted mb-1">Landmark</div>
                        <div className="fw-semibold">
                          {selectedUser.address?.landmark || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-3 h-100">
                        <div className="small text-muted mb-1">City</div>
                        <div className="fw-semibold">
                          {selectedUser.address?.city || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-3 h-100">
                        <div className="small text-muted mb-1">State</div>
                        <div className="fw-semibold">
                          {selectedUser.address?.state || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-3 h-100">
                        <div className="small text-muted mb-1">Pincode</div>
                        <div className="fw-semibold">
                          {selectedUser.address?.pincode || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="mb-0">No user selected</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <div
        className="modal fade"
        id="editUserModal"
        tabIndex="-1"
        aria-labelledby="editUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleUpdateUser}>
              <div className="modal-header">
                <h5 className="modal-title" id="editUserModalLabel">
                  Edit User
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">User ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="user_id"
                      value={editForm.user_id}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={editForm.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <h6 className="mt-3">Address Details</h6>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Flat No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="flat_no"
                      value={editForm.address.flat_no}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Building Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="building_name"
                      value={editForm.address.building_name}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Area Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="area_name"
                      value={editForm.address.area_name}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Landmark</label>
                    <input
                      type="text"
                      className="form-control"
                      name="landmark"
                      value={editForm.address.landmark}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={editForm.address.city}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={editForm.address.state}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pincode"
                      value={editForm.address.pincode}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeEditModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
