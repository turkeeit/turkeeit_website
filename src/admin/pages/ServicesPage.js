import { useEffect, useState } from "react";
import { API } from "../../utils/host";

const getEmptyServiceForm = () => ({
  id: "",
  name: "",
  price: "",
  image_url: "",
  subcategory_id: "",
  notes: "",
  performed_by: "",
  duration_min: "",
  duration_max: "",
  tools_used: "",
  service_type: "main",

  service_includes: [""],
  service_excludes: [""],
});

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  const [createForm, setCreateForm] = useState(getEmptyServiceForm());
  const [editForm, setEditForm] = useState(getEmptyServiceForm());

  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ================= FETCH SERVICES =================
  const fetchServices = async () => {
    try {
      setLoading(true);

      const response = await fetch(API.GET_ALL_SERVICES);
      const data = await response.json();

      console.log("Services API response:", data);

      const flatServices = [];

      (data || []).forEach((group) => {
        (group.services || []).forEach((service) => {
          flatServices.push({
            ...service,
            category_name: group.category_name,
            subcategory_name: group.subcategory_name,

            service_includes:
              Array.isArray(service.service_includes) &&
              service.service_includes.length > 0
                ? service.service_includes
                : [],

            service_excludes:
              Array.isArray(service.service_excludes) &&
              service.service_excludes.length > 0
                ? service.service_excludes
                : [],
          });
        });
      });

      setServices(flatServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH SUBCATEGORIES =================
  const fetchSubcategories = async () => {
    try {
      const response = await fetch(API.GET_ALL_SUBCATEGORIES);
      const data = await response.json();

      setSubcategories(data.subcategories || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchSubcategories();
  }, []);

  const formatText = (value) => {
    return value && String(value).trim() !== "" ? value : "-";
  };

  // ================= OPEN MODALS =================
  const handleView = (service) => {
    setSelectedService(service);
  };

  const handleCreateOpen = () => {
    setCreateForm(getEmptyServiceForm());
  };

  const handleEditOpen = (service) => {
    setEditForm({
      id: service.id || "",
      name: service.name || "",
      price: service.price || "",
      image_url: service.image_url || "",
      subcategory_id: service.subcategory_id || "",
      notes: service.notes || "",
      performed_by: service.performed_by || "",
      duration_min: service.duration_min || "",
      duration_max: service.duration_max || "",
      tools_used: service.tools_used || "",
      service_type: service.service_type || "main",

      service_includes:
        Array.isArray(service.service_includes) &&
        service.service_includes.length > 0
          ? service.service_includes
          : [""],

      service_excludes:
        Array.isArray(service.service_excludes) &&
        service.service_excludes.length > 0
          ? service.service_excludes
          : [""],
    });
  };

  // ================= CREATE INCLUDE/EXCLUDE =================

  const handleCreateArrayChange = (type, index, value) => {
    setCreateForm((prev) => {
      const updated = [...prev[type]];
      updated[index] = value;

      return {
        ...prev,
        [type]: updated,
      };
    });
  };

  const addCreateArrayField = (type) => {
    setCreateForm((prev) => ({
      ...prev,
      [type]: [...prev[type], ""],
    }));
  };

  const removeCreateArrayField = (type, index) => {
    setCreateForm((prev) => {
      const updated = prev[type].filter((_, i) => i !== index);

      return {
        ...prev,
        [type]: updated.length > 0 ? updated : [""],
      };
    });
  };

  // ================= EDIT INCLUDE/EXCLUDE =================

  const handleEditArrayChange = (type, index, value) => {
    setEditForm((prev) => {
      const updated = [...prev[type]];
      updated[index] = value;

      return {
        ...prev,
        [type]: updated,
      };
    });
  };

  const addEditArrayField = (type) => {
    setEditForm((prev) => ({
      ...prev,
      [type]: [...prev[type], ""],
    }));
  };

  const removeEditArrayField = (type, index) => {
    setEditForm((prev) => {
      const updated = prev[type].filter((_, i) => i !== index);

      return {
        ...prev,
        [type]: updated.length > 0 ? updated : [""],
      };
    });
  };

  // ================= INPUT CHANGES =================
  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= CREATE SERVICE =================
  const handleCreateService = async (e) => {
    e.preventDefault();

    if (creating) return;

    try {
      setCreating(true);

      const response = await fetch(API.ADD_SERVICE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: createForm.name.trim(),
          price: Number(createForm.price),
          image_url: createForm.image_url.trim(),
          subcategory_id: Number(createForm.subcategory_id),
          notes: createForm.notes.trim(),
          performed_by: createForm.performed_by.trim(),
          duration_min: createForm.duration_min
            ? Number(createForm.duration_min)
            : 0,
          duration_max: createForm.duration_max
            ? Number(createForm.duration_max)
            : 0,
          tools_used: createForm.tools_used.trim(),
          service_type: createForm.service_type,

          service_includes: createForm.service_includes.filter(
            (item) => item.trim() !== "",
          ),

          service_excludes: createForm.service_excludes.filter(
            (item) => item.trim() !== "",
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Failed to create service");
        return;
      }

      await fetchServices();

      setCreateForm(getEmptyServiceForm());

      document.getElementById("closeCreateServiceModalBtn").click();

      alert(data.message || "Service created successfully");
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Something went wrong while creating service");
    } finally {
      setCreating(false);
    }
  };

  // ================= UPDATE SERVICE =================
  const handleUpdateService = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const response = await fetch(API.EDIT_SERVICE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(editForm.id),
          name: editForm.name.trim(),
          price: Number(editForm.price),
          image_url: editForm.image_url.trim(),
          subcategory_id: Number(editForm.subcategory_id),
          notes: editForm.notes.trim(),
          performed_by: editForm.performed_by.trim(),
          duration_min: editForm.duration_min
            ? Number(editForm.duration_min)
            : 0,
          duration_max: editForm.duration_max
            ? Number(editForm.duration_max)
            : 0,
          tools_used: editForm.tools_used.trim(),
          service_type: editForm.service_type,

          service_includes: editForm.service_includes.filter(
            (item) => item.trim() !== "",
          ),

          service_excludes: editForm.service_excludes.filter(
            (item) => item.trim() !== "",
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Failed to update service");
        return;
      }

      await fetchServices();

      document.getElementById("closeEditServiceModalBtn").click();

      alert(data.message || "Service updated successfully");
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Something went wrong while updating service");
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE SERVICE =================
  const handleDeleteService = async (serviceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmDelete) return;
    if (deletingId) return;

    try {
      setDeletingId(serviceId);

      const response = await fetch(API.DELETE_SERVICE, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: serviceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Failed to delete service");
        return;
      }

      setServices((prev) => prev.filter((service) => service.id !== serviceId));

      alert(data.message || "Service deleted successfully");
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Something went wrong while deleting service");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Services</h2>
          <p className="text-muted mb-0">Manage all services</p>
        </div>

        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#createServiceModal"
          onClick={handleCreateOpen}
        >
          Add New Service
        </button>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Type</th>
                  <th style={{ width: "260px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Loading services...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No services found
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.id}>
                      <td>{service.id}</td>
                      <td>{service.name}</td>
                      <td>₹{service.price}</td>
                      <td>{service.category_name}</td>
                      <td>{service.subcategory_name}</td>
                      <td>{service.service_type}</td>

                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#viewServiceModal"
                            onClick={() => handleView(service)}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            data-bs-toggle="modal"
                            data-bs-target="#editServiceModal"
                            onClick={() => handleEditOpen(service)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteService(service.id)}
                            disabled={deletingId === service.id}
                          >
                            {deletingId === service.id
                              ? "Deleting..."
                              : "Delete"}
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

      {/* KEEP YOUR EXISTING CREATE MODAL */}
      {/* KEEP YOUR EXISTING VIEW MODAL */}
      {/* KEEP YOUR EXISTING EDIT MODAL */}

      {/* YOUR EXISTING JSX REMAINS SAME */}

      {/* CREATE SERVICE MODAL */}
      <div
        className="modal fade"
        id="createServiceModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleCreateService}>
              <div className="modal-header">
                <h5 className="modal-title">Add New Service</h5>
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
                    <label className="form-label">Service Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={createForm.name}
                      onChange={handleCreateInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={createForm.price}
                      onChange={handleCreateInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Service Type</label>
                    <select
                      className="form-select"
                      name="service_type"
                      value={createForm.service_type}
                      onChange={handleCreateInputChange}
                      required
                    >
                      <option value="main">main</option>
                      <option value="additional">additional</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="image_url"
                      value={createForm.image_url}
                      onChange={handleCreateInputChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Subcategory</label>
                    <select
                      className="form-select"
                      name="subcategory_id"
                      value={createForm.subcategory_id}
                      onChange={handleCreateInputChange}
                      required
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Performed By</label>
                    <input
                      type="text"
                      className="form-control"
                      name="performed_by"
                      value={createForm.performed_by}
                      onChange={handleCreateInputChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Duration Min</label>
                    <input
                      type="number"
                      className="form-control"
                      name="duration_min"
                      value={createForm.duration_min}
                      onChange={handleCreateInputChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Duration Max</label>
                    <input
                      type="number"
                      className="form-control"
                      name="duration_max"
                      value={createForm.duration_max}
                      onChange={handleCreateInputChange}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Tools Used</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      name="tools_used"
                      value={createForm.tools_used}
                      onChange={handleCreateInputChange}
                    ></textarea>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="notes"
                      value={createForm.notes}
                      onChange={handleCreateInputChange}
                    ></textarea>
                  </div>
                  {/* SERVICE INCLUDES */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Service Includes
                    </label>

                    {createForm.service_includes.map((item, index) => (
                      <div className="d-flex gap-2 mb-2" key={index}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Include Point ${index + 1}`}
                          value={item}
                          onChange={(e) =>
                            handleCreateArrayChange(
                              "service_includes",
                              index,
                              e.target.value,
                            )
                          }
                        />

                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>
                            removeCreateArrayField("service_includes", index)
                          }
                        >
                          -
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => addCreateArrayField("service_includes")}
                    >
                      + Add Include Point
                    </button>
                  </div>

                  {/* SERVICE EXCLUDES */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Service Excludes
                    </label>

                    {createForm.service_excludes.map((item, index) => (
                      <div className="d-flex gap-2 mb-2" key={index}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Exclude Point ${index + 1}`}
                          value={item}
                          onChange={(e) =>
                            handleCreateArrayChange(
                              "service_excludes",
                              index,
                              e.target.value,
                            )
                          }
                        />

                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>
                            removeCreateArrayField("service_excludes", index)
                          }
                        >
                          -
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => addCreateArrayField("service_excludes")}
                    >
                      + Add Exclude Point
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeCreateServiceModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* VIEW SERVICE MODAL */}
      <div
        className="modal fade"
        id="viewServiceModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">Service Details</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {selectedService ? (
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">ID</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Name</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.name)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Price</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.price)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Category</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.category_name)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Subcategory</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.subcategory_name)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Service Type</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.service_type)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Image URL</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.image_url)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Performed By</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.performed_by)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Duration Min</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.duration_min)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Duration Max</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.duration_max)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Tools Used</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.tools_used)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Notes</div>
                      <div className="fw-semibold">
                        {formatText(selectedService.notes)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="small text-muted mb-2">
                        Service Includes
                      </div>

                      {selectedService?.service_includes?.length > 0 ? (
                        <ul className="mb-0 ps-3">
                          {selectedService.service_includes.map(
                            (item, index) => (
                              <li key={index}>{item}</li>
                            ),
                          )}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="small text-muted mb-2">
                        Service Excludes
                      </div>

                      {selectedService?.service_excludes?.length > 0 ? (
                        <ul className="mb-0 ps-3">
                          {selectedService.service_excludes.map(
                            (item, index) => (
                              <li key={index}>{item}</li>
                            ),
                          )}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mb-0">No service selected</p>
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

      {/* EDIT SERVICE MODAL */}
      <div
        className="modal fade"
        id="editServiceModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleUpdateService}>
              <div className="modal-header">
                <h5 className="modal-title">Edit Service</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Service ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="id"
                      value={editForm.id}
                      readOnly
                    />
                  </div>

                  <div className="col-md-5">
                    <label className="form-label">Service Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={editForm.price}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      name="service_type"
                      value={editForm.service_type}
                      onChange={handleEditInputChange}
                    >
                      <option value="main">main</option>
                      <option value="additional">additional</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="image_url"
                      value={editForm.image_url}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Subcategory</label>
                    <select
                      className="form-select"
                      name="subcategory_id"
                      value={editForm.subcategory_id}
                      onChange={handleEditInputChange}
                      required
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Performed By</label>
                    <input
                      type="text"
                      className="form-control"
                      name="performed_by"
                      value={editForm.performed_by}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Duration Min</label>
                    <input
                      type="number"
                      className="form-control"
                      name="duration_min"
                      value={editForm.duration_min}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Duration Max</label>
                    <input
                      type="number"
                      className="form-control"
                      name="duration_max"
                      value={editForm.duration_max}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Tools Used</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      name="tools_used"
                      value={editForm.tools_used}
                      onChange={handleEditInputChange}
                    ></textarea>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="notes"
                      value={editForm.notes}
                      onChange={handleEditInputChange}
                    ></textarea>
                  </div>

                  {/* SERVICE INCLUDES */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Service Includes
                    </label>

                    {editForm.service_includes.map((item, index) => (
                      <div className="d-flex gap-2 mb-2" key={index}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Include Point ${index + 1}`}
                          value={item}
                          onChange={(e) =>
                            handleEditArrayChange(
                              "service_includes",
                              index,
                              e.target.value,
                            )
                          }
                        />

                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>
                            removeEditArrayField("service_includes", index)
                          }
                        >
                          -
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => addEditArrayField("service_includes")}
                    >
                      + Add Include Point
                    </button>
                  </div>

                  {/* SERVICE EXCLUDES */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Service Excludes
                    </label>

                    {editForm.service_excludes.map((item, index) => (
                      <div className="d-flex gap-2 mb-2" key={index}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Exclude Point ${index + 1}`}
                          value={item}
                          onChange={(e) =>
                            handleEditArrayChange(
                              "service_excludes",
                              index,
                              e.target.value,
                            )
                          }
                        />

                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>
                            removeEditArrayField("service_excludes", index)
                          }
                        >
                          -
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => addEditArrayField("service_excludes")}
                    >
                      + Add Exclude Point
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeEditServiceModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
