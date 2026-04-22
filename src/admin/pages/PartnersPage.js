import { useEffect, useState } from "react";
import { API } from "../../utils/host";

const getEmptyPartnerForm = () => ({
  id: "",
  name: "",
  mobile_number: "",
  gender: "",
  service_category_id: "",
  experience: "",
  flat_no: "",
  building_name: "",
  area_name: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  created_at: "",
  modified_at: "",
});

export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const [createForm, setCreateForm] = useState(getEmptyPartnerForm());
  const [editForm, setEditForm] = useState(getEmptyPartnerForm());

  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // ================= FETCH PARTNERS =================
  const fetchPartners = async () => {
    try {
      setLoading(true);

      const response = await fetch(API.GET_ALL_PARTNERS);
      const data = await response.json();

      console.log("Partners API response:", data);

      setPartners(data.partners_list || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      const response = await fetch(API.GET_ALL_CATEGORIES);
      const data = await response.json();

      console.log("Categories API response:", data);

      setCategories(data.category || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchCategories();
  }, []);

  // ================= HELPERS =================
  const formatText = (value) => {
    return value && String(value).trim() !== "" ? value : "-";
  };

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

  const getCategoryName = (categoryId) => {
    const found = categories.find(
      (category) => Number(category.id) === Number(categoryId),
    );
    return found ? found.name : "-";
  };

  const mapPartnerDetailsToState = (basePartner, detailsResponsePartner) => {
    const address = detailsResponsePartner?.address || {};

    return {
      id: basePartner?.id || "",
      name: detailsResponsePartner?.name || basePartner?.name || "",
      mobile_number:
        detailsResponsePartner?.mobile_number ||
        basePartner?.mobile_number ||
        "",
      gender: detailsResponsePartner?.gender || basePartner?.gender || "",
      service_category_id:
        detailsResponsePartner?.service_category_id ||
        basePartner?.service_category_id ||
        "",
      experience:
        detailsResponsePartner?.experience ?? basePartner?.experience ?? "",
      flat_no: address.flat_no || "",
      building_name: address.building_name || "",
      area_name: address.area_name || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      created_at: basePartner?.created_at || "",
      modified_at: basePartner?.modified_at || "",
    };
  };

  // ================= OPEN MODALS =================
  const handleView = async (partner) => {
    try {
      setViewLoading(true);
      setSelectedPartner(null);

      const response = await fetch(API.GET_PARTNER_DETAILS, {
        method: "GET",
        headers: {
          mobile_number: partner.mobile_number,
        },
      });

      const data = await response.json();

      console.log("Partner details API response:", data);

      if (!response.ok) {
        setSelectedPartner({
          ...partner,
          flat_no: "",
          building_name: "",
          area_name: "",
          landmark: "",
          city: "",
          state: "",
          pincode: "",
        });
        return;
      }

      setSelectedPartner(mapPartnerDetailsToState(partner, data.partner));
    } catch (error) {
      console.error("Error fetching partner details:", error);
      setSelectedPartner({
        ...partner,
        flat_no: "",
        building_name: "",
        area_name: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
      });
    } finally {
      setViewLoading(false);
    }
  };

  const handleCreateOpen = () => {
    setCreateForm(getEmptyPartnerForm());
  };

  const handleEditOpen = async (partner) => {
    try {
      setEditLoading(true);
      setEditForm(getEmptyPartnerForm());

      const response = await fetch(API.GET_PARTNER_DETAILS, {
        method: "GET",
        headers: {
          mobile_number: partner.mobile_number,
        },
      });

      const data = await response.json();

      console.log("Partner details API response:", data);

      if (!response.ok) {
        setEditForm({
          id: partner.id || "",
          name: partner.name || "",
          mobile_number: partner.mobile_number || "",
          gender: partner.gender || "",
          service_category_id: partner.service_category_id || "",
          experience: partner.experience || "",
          flat_no: "",
          building_name: "",
          area_name: "",
          landmark: "",
          city: "",
          state: "",
          pincode: "",
          created_at: partner.created_at || "",
          modified_at: partner.modified_at || "",
        });
        return;
      }

      setEditForm(mapPartnerDetailsToState(partner, data.partner));
    } catch (error) {
      console.error("Error fetching partner details for edit:", error);
      setEditForm({
        id: partner.id || "",
        name: partner.name || "",
        mobile_number: partner.mobile_number || "",
        gender: partner.gender || "",
        service_category_id: partner.service_category_id || "",
        experience: partner.experience || "",
        flat_no: "",
        building_name: "",
        area_name: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        created_at: partner.created_at || "",
        modified_at: partner.modified_at || "",
      });
    } finally {
      setEditLoading(false);
    }
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

  // ================= CREATE PARTNER =================
  const handleCreatePartner = async (e) => {
    e.preventDefault();

    if (creating) return;

    try {
      setCreating(true);

      const response = await fetch(API.ADD_PARTNER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: createForm.name.trim(),
          mobile_number: createForm.mobile_number.trim(),
          gender: createForm.gender,
          service_category_id: createForm.service_category_id
            ? Number(createForm.service_category_id)
            : null,
          experience: createForm.experience ? Number(createForm.experience) : 0,
          flat_no: createForm.flat_no?.trim?.() || "",
          building_name: createForm.building_name?.trim?.() || "",
          area_name: createForm.area_name?.trim?.() || "",
          landmark: createForm.landmark?.trim?.() || "",
          city: createForm.city?.trim?.() || "",
          state: createForm.state?.trim?.() || "",
          pincode: createForm.pincode?.trim?.() || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Failed to create partner");
        return;
      }

      await fetchPartners();

      setCreateForm(getEmptyPartnerForm());

      document.getElementById("closeCreatePartnerModalBtn").click();

      alert(data.message || "Partner created successfully");
    } catch (error) {
      console.error("Error creating partner:", error);
      alert("Something went wrong while creating partner");
    } finally {
      setCreating(false);
    }
  };

  // ================= UPDATE PARTNER =================
  const handleUpdatePartner = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const response = await fetch(API.EDIT_PARTNER, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          mobile_number: editForm.mobile_number,
        },
        body: JSON.stringify({
          name: editForm.name.trim(),
          gender: editForm.gender,
          service_category_id: Number(editForm.service_category_id),
          experience: Number(editForm.experience),
          flat_no: editForm.flat_no.trim(),
          building_name: editForm.building_name.trim(),
          area_name: editForm.area_name.trim(),
          landmark: editForm.landmark.trim(),
          city: editForm.city.trim(),
          state: editForm.state.trim(),
          pincode: editForm.pincode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Failed to update partner");
        return;
      }

      await fetchPartners();

      document.getElementById("closeEditPartnerModalBtn").click();

      alert(data.message || "Partner updated successfully");
    } catch (error) {
      console.error("Error updating partner:", error);
      alert("Something went wrong while updating partner");
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE PARTNER =================
  const handleDeletePartner = async (partner) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this partner?",
    );

    if (!confirmDelete) return;
    if (deletingId) return;

    try {
      setDeletingId(partner.id);

      const response = await fetch(API.DELETE_PARTNER, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          mobile_number: partner.mobile_number,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Failed to delete partner");
        return;
      }

      setPartners((prev) => prev.filter((item) => item.id !== partner.id));

      alert(data.message || "Partner deleted successfully");
    } catch (error) {
      console.error("Error deleting partner:", error);
      alert("Something went wrong while deleting partner");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Partners</h2>
          <p className="text-muted mb-0">Manage all partners</p>
        </div>

        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#createPartnerModal"
          onClick={handleCreateOpen}
        >
          Add New Partner
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Mobile Number</th>
                  <th>Gender</th>
                  <th>Service Category</th>
                  <th>Experience</th>
                  <th style={{ width: "250px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Loading partners...
                    </td>
                  </tr>
                ) : partners.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No partners found
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => (
                    <tr key={partner.id}>
                      <td>{partner.id}</td>
                      <td>{formatText(partner.name)}</td>
                      <td>{formatText(partner.mobile_number)}</td>
                      <td>{formatText(partner.gender)}</td>
                      <td>
                        {formatText(partner.service_category_id)} -{" "}
                        {getCategoryName(partner.service_category_id)}
                      </td>
                      <td>{formatText(partner.experience)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#viewPartnerModal"
                            onClick={() => handleView(partner)}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            data-bs-toggle="modal"
                            data-bs-target="#editPartnerModal"
                            onClick={() => handleEditOpen(partner)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeletePartner(partner)}
                            disabled={deletingId === partner.id}
                          >
                            {deletingId === partner.id
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

      {/* CREATE PARTNER MODAL */}
      <div
        className="modal fade"
        id="createPartnerModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleCreatePartner}>
              <div className="modal-header">
                <h5 className="modal-title">Add New Partner</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={createForm.name}
                    onChange={handleCreateInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobile_number"
                    value={createForm.mobile_number}
                    onChange={handleCreateInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    name="gender"
                    value={createForm.gender}
                    onChange={handleCreateInputChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Service Category</label>
                  <select
                    className="form-select"
                    name="service_category_id"
                    value={createForm.service_category_id}
                    onChange={handleCreateInputChange}
                    required
                  >
                    <option value="">Select Service Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.id} - {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Experience</label>
                  <input
                    type="number"
                    className="form-control"
                    name="experience"
                    value={createForm.experience}
                    onChange={handleCreateInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Flat No</label>
                  <input
                    type="text"
                    className="form-control"
                    name="flat_no"
                    value={createForm.flat_no}
                    onChange={handleCreateInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Building Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="building_name"
                    value={createForm.building_name}
                    onChange={handleCreateInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Area Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="area_name"
                    value={createForm.area_name}
                    onChange={handleCreateInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Landmark</label>
                  <input
                    type="text"
                    className="form-control"
                    name="landmark"
                    value={createForm.landmark}
                    onChange={handleCreateInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={createForm.city}
                    onChange={handleCreateInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={createForm.state}
                    onChange={handleCreateInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pincode"
                    value={createForm.pincode}
                    onChange={handleCreateInputChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeCreatePartnerModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* VIEW PARTNER MODAL */}
      <div
        className="modal fade"
        id="viewPartnerModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">Partner Details</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              {viewLoading ? (
                <p className="mb-0">Loading partner details...</p>
              ) : selectedPartner ? (
                <div className="row g-3">
                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">ID</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Name</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.name)}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Mobile Number</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.mobile_number)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Gender</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.gender)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Experience</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.experience)}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Service Category
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.service_category_id)} -{" "}
                        {getCategoryName(selectedPartner.service_category_id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Flat No</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.flat_no)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Building Name</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.building_name)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Area Name</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.area_name)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Landmark</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.landmark)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">City</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.city)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">State</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.state)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Pincode</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartner.pincode)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Created At</div>
                      <div className="fw-semibold">
                        {formatDateTime(selectedPartner.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Modified At</div>
                      <div className="fw-semibold">
                        {formatDateTime(selectedPartner.modified_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mb-0">No partner selected</p>
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

      {/* EDIT PARTNER MODAL */}
      <div
        className="modal fade"
        id="editPartnerModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleUpdatePartner}>
              <div className="modal-header">
                <h5 className="modal-title">Edit Partner</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                {editLoading ? (
                  <p className="mb-0">Loading partner details...</p>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label">ID</label>
                      <input
                        type="text"
                        className="form-control"
                        name="id"
                        value={editForm.id}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="mobile_number"
                        value={editForm.mobile_number}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-select"
                        name="gender"
                        value={editForm.gender}
                        onChange={handleEditInputChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Service Category</label>
                      <select
                        className="form-select"
                        name="service_category_id"
                        value={editForm.service_category_id}
                        onChange={handleEditInputChange}
                        required
                      >
                        <option value="">Select Service Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.id} - {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Experience</label>
                      <input
                        type="number"
                        className="form-control"
                        name="experience"
                        value={editForm.experience}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Flat No</label>
                      <input
                        type="text"
                        className="form-control"
                        name="flat_no"
                        value={editForm.flat_no}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Building Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="building_name"
                        value={editForm.building_name}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Area Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="area_name"
                        value={editForm.area_name}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Landmark</label>
                      <input
                        type="text"
                        className="form-control"
                        name="landmark"
                        value={editForm.landmark}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={editForm.city}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={editForm.state}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        name="pincode"
                        value={editForm.pincode}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeEditPartnerModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || editLoading}
                >
                  {saving ? "Updating..." : "Update Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
