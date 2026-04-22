import { useEffect, useState } from "react";
import { API } from "../../utils/host";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
  });

  const [createForm, setCreateForm] = useState({
    name: "",
  });

  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  // fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(API.GET_ALL_CATEGORIES);
      const data = await response.json();

      setCategories(data.category || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleView = (category) => {
    setSelectedCategory(category);
  };

  const handleEditOpen = (category) => {
    setEditForm({
      id: category.id || "",
      name: category.name || "",
    });
  };

  const handleCreateOpen = () => {
    setCreateForm({
      name: "",
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // create category
  const handleCreateCategory = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);

      const response = await fetch(API.ADD_CATEGORY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Failed to create category");
        return;
      }

      // best way: refetch so created_at and modified_at also come properly
      await fetchCategories();

      setCreateForm({ name: "" });

      document.getElementById("closeCreateCategoryModalBtn").click();

      alert(data.message || "Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Something went wrong while creating category");
    } finally {
      setCreating(false);
    }
  };

  // edit category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch(API.EDIT_CATEGORY, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Failed to update category");
        return;
      }

      // refetch for updated modified_at
      await fetchCategories();

      document.getElementById("closeEditCategoryModalBtn").click();

      alert(data.message || "Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Something went wrong while updating category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Category</h2>
          <p className="text-muted mb-0">Manage all categories</p>
        </div>

        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#createCategoryModal"
          onClick={handleCreateOpen}
        >
          Add New Category
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Category ID</th>
                  <th>Name</th>
                  <th>Created</th>
                  <th>Modified</th>
                  <th style={{ width: "180px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Loading categories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td>{formatDateTime(category.created_at)}</td>
                      <td>{formatDateTime(category.modified_at)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#viewCategoryModal"
                            onClick={() => handleView(category)}
                          >
                            View
                          </button>

                          <button
                            className="btn btn-sm btn-outline-secondary"
                            data-bs-toggle="modal"
                            data-bs-target="#editCategoryModal"
                            onClick={() => handleEditOpen(category)}
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

      {/* Create Category Modal */}
      <div
        className="modal fade"
        id="createCategoryModal"
        tabIndex="-1"
        aria-labelledby="createCategoryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleCreateCategory}>
              <div className="modal-header">
                <h5 className="modal-title" id="createCategoryModalLabel">
                  Add New Category
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={createForm.name}
                    onChange={handleCreateInputChange}
                    placeholder="Enter category name"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeCreateCategoryModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* View Category Modal */}
      <div
        className="modal fade"
        id="viewCategoryModal"
        tabIndex="-1"
        aria-labelledby="viewCategoryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title" id="viewCategoryModalLabel">
                Category Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {selectedCategory ? (
                <div className="row g-3">
                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Category ID</div>
                      <div className="fw-semibold">
                        {selectedCategory.id || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Name</div>
                      <div className="fw-semibold">
                        {selectedCategory.name || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Created At</div>
                      <div className="fw-semibold">
                        {formatDateTime(selectedCategory.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Modified At</div>
                      <div className="fw-semibold">
                        {formatDateTime(selectedCategory.modified_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mb-0">No category selected</p>
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

      {/* Edit Category Modal */}
      <div
        className="modal fade"
        id="editCategoryModal"
        tabIndex="-1"
        aria-labelledby="editCategoryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleUpdateCategory}>
              <div className="modal-header">
                <h5 className="modal-title" id="editCategoryModalLabel">
                  Edit Category
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Category ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="id"
                    value={editForm.id}
                    onChange={handleEditInputChange}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditInputChange}
                    placeholder="Enter category name"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeEditCategoryModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
