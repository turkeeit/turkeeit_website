import { useEffect, useState } from "react";
import { API } from "../../utils/host";

export default function SubcategoryPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    category_id: "",
  });

  const [createForm, setCreateForm] = useState({
    name: "",
    category_id: "",
  });

  // fetch subcategories
  const fetchSubcategories = async () => {
    try {
      setLoading(true);

      const res = await fetch(API.GET_ALL_SUBCATEGORIES);
      const data = await res.json();

      setSubcategories(data.subcategories || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  // fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(API.GET_ALL_CATEGORIES);
      const data = await res.json();

      setCategories(data.category || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const handleCreateOpen = () => {
    setCreateForm({
      name: "",
      category_id: "",
    });
  };

  const handleEditOpen = (subcategory) => {
    setEditForm({
      id: subcategory.id || "",
      name: subcategory.name || "",
      category_id: subcategory.category_id || "",
    });
  };

  const handleView = (subcategory) => {
    setSelected(subcategory);
  };

  // create subcategory
  const handleCreate = async (e) => {
    e.preventDefault();

    if (creating) return;

    if (!createForm.name || !createForm.category_id) {
      alert("Please fill all fields");
      return;
    }

    try {
      setCreating(true);

      const res = await fetch(API.ADD_SUBCATEGORY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: createForm.name.trim(),
          category_id: Number(createForm.category_id),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.message || "Failed to create subcategory");
        return;
      }

      await fetchSubcategories();

      setCreateForm({
        name: "",
        category_id: "",
      });

      document.getElementById("closeCreateSubcategoryModalBtn").click();

      alert(data.message || "Subcategory created successfully");
    } catch (err) {
      console.error("Create subcategory error:", err);
      alert("Something went wrong while creating subcategory");
    } finally {
      setCreating(false);
    }
  };

  // update subcategory
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (saving) return;

    if (!editForm.id || !editForm.name || !editForm.category_id) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(API.EDIT_SUBCATEGORY, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(editForm.id),
          name: editForm.name.trim(),
          category_id: Number(editForm.category_id),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.message || "Failed to update subcategory");
        return;
      }

      await fetchSubcategories();

      document.getElementById("closeEditSubcategoryModalBtn").click();

      alert(data.message || "Subcategory updated successfully");
    } catch (err) {
      console.error("Update subcategory error:", err);
      alert("Something went wrong while updating subcategory");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Subcategory</h2>
          <p className="text-muted mb-0">Manage all subcategories</p>
        </div>

        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#createSubcategoryModal"
          onClick={handleCreateOpen}
        >
          Add New Subcategory
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Subcategory Name</th>
                  <th>Category</th>
                  <th style={{ width: "180px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Loading subcategories...
                    </td>
                  </tr>
                ) : subcategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No subcategories found
                    </td>
                  </tr>
                ) : (
                  subcategories.map((subcategory) => (
                    <tr key={subcategory.id}>
                      <td>{subcategory.id}</td>
                      <td>{subcategory.name}</td>
                      <td>{subcategory.category_name}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#viewSubcategoryModal"
                            onClick={() => handleView(subcategory)}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            data-bs-toggle="modal"
                            data-bs-target="#editSubcategoryModal"
                            onClick={() => handleEditOpen(subcategory)}
                          >
                            Edit
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

      {/* Create Modal */}
      <div
        className="modal fade"
        id="createSubcategoryModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleCreate}>
              <div className="modal-header">
                <h5 className="modal-title">Add New Subcategory</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Subcategory Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter subcategory name"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={createForm.category_id}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        category_id: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeCreateSubcategoryModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <div
        className="modal fade"
        id="viewSubcategoryModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">Subcategory Details</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {selected ? (
                <div className="row g-3">
                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">ID</div>
                      <div className="fw-semibold">{selected.id || "-"}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Name</div>
                      <div className="fw-semibold">{selected.name || "-"}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Category</div>
                      <div className="fw-semibold">
                        {selected.category_name || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mb-0">No subcategory selected</p>
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

      {/* Edit Modal */}
      <div
        className="modal fade"
        id="editSubcategoryModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleUpdate}>
              <div className="modal-header">
                <h5 className="modal-title">Edit Subcategory</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.id}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Subcategory Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={editForm.category_id}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        category_id: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeEditSubcategoryModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
