import { useEffect, useState } from "react";
import { API } from "../../utils/host";

export default function ServiceAddonsPage() {
  const [services, setServices] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    main_service_id: "",
    addon_service_id: "",
  });

  const [filterMainServiceId, setFilterMainServiceId] = useState("");

  const mainServices = services.filter(
    (service) => service.service_type === "main",
  );

  const additionalServices = services.filter(
    (service) => service.service_type === "additional",
  );

  const fetchServices = async () => {
    try {
      const response = await fetch(API.GET_ALL_SERVICES);
      const data = await response.json();

      const flatServices = [];

      (data || []).forEach((group) => {
        (group.services || []).forEach((service) => {
          flatServices.push(service);
        });
      });

      setServices(flatServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
  };

  const fetchMappings = async () => {
    try {
      setLoading(true);

      let url = API.GET_ALL_SERVICE_ADDONS;

      if (filterMainServiceId) {
        url = `${API.GET_SERVICE_ADDONS_BY_MAIN_SERVICE}?main_service_id=${filterMainServiceId}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to fetch mappings");
        setMappings([]);
        return;
      }

      setMappings(data.data || []);
    } catch (error) {
      console.error("Error fetching mappings:", error);
      setMappings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    fetchMappings();
  }, [filterMainServiceId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMapping = async (e) => {
    e.preventDefault();

    if (saving) return;

    if (!form.main_service_id || !form.addon_service_id) {
      alert("Please select both main service and additional service");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(API.ADD_SERVICE_ADDON, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          main_service_id: Number(form.main_service_id),
          addon_service_id: Number(form.addon_service_id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add mapping");
        return;
      }

      setForm({
        main_service_id: "",
        addon_service_id: "",
      });

      await fetchMappings();

      alert(data.message || "Service addon mapping added successfully");
    } catch (error) {
      console.error("Error adding mapping:", error);
      alert("Something went wrong while adding mapping");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMapping = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this mapping?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const response = await fetch(API.DELETE_SERVICE_ADDON, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to remove mapping");
        return;
      }

      setMappings((prev) => prev.filter((item) => item.id !== id));

      alert(data.message || "Mapping removed successfully");
    } catch (error) {
      console.error("Error deleting mapping:", error);
      alert("Something went wrong while deleting mapping");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Service Addons</h2>
          <p className="text-muted mb-0">
            Manage main service and additional service mappings
          </p>
        </div>
      </div>

      {/* Add Mapping Form */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="mb-3">Add New Mapping</h5>

          <form onSubmit={handleAddMapping}>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Main Service</label>
                <select
                  className="form-select"
                  name="main_service_id"
                  value={form.main_service_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Main Service</option>
                  {mainServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.id} - {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-5">
                <label className="form-label">Additional Service</label>
                <select
                  className="form-select"
                  name="addon_service_id"
                  value={form.addon_service_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Additional Service</option>
                  {additionalServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.id} - {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Add Mapping"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Filter */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Filter by Main Service</label>
              <select
                className="form-select"
                value={filterMainServiceId}
                onChange={(e) => setFilterMainServiceId(e.target.value)}
              >
                <option value="">All Main Services</option>
                {mainServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.id} - {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => setFilterMainServiceId("")}
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mapping Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="mb-3">Service Addon Mapping List</h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Main Service ID</th>
                  <th>Main Service Name</th>
                  <th>Addon Service ID</th>
                  <th>Addon Service Name</th>
                  <th>Created At</th>
                  <th style={{ width: "120px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Loading mappings...
                    </td>
                  </tr>
                ) : mappings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No mappings found
                    </td>
                  </tr>
                ) : (
                  mappings.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.main_service_id}</td>
                      <td>{item.main_service_name}</td>
                      <td>{item.addon_service_id}</td>
                      <td>{item.addon_service_name}</td>
                      <td>{item.created_at}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteMapping(item.id)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id ? "Removing..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
