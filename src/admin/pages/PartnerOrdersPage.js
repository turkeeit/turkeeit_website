import { useEffect, useState } from "react";
import { API } from "../../utils/host";

export default function PartnerOrdersPage() {
  const [partnerOrders, setPartnerOrders] = useState([]);
  const [selectedPartnerOrder, setSelectedPartnerOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ================= FETCH ALL PARTNER ORDERS =================
  const fetchPartnerOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(API.GET_ALL_PARTNER_ORDERS);
      const data = await response.json();

      console.log("Partner Orders API response:", data);

      setPartnerOrders(data.partner_orders || []);
    } catch (error) {
      console.error("Error fetching partner orders:", error);
      setPartnerOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerOrders();
  }, []);

  // ================= HELPERS =================
  const formatText = (value) => {
    return value !== null && value !== undefined && String(value).trim() !== ""
      ? value
      : "-";
  };

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
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

  // ================= VIEW SINGLE PARTNER ORDER =================
  const handleView = async (partnerOrder) => {
    try {
      setViewLoading(true);
      setSelectedPartnerOrder(null);

      const response = await fetch(API.GET_PARTNER_ORDER_DETAILS, {
        method: "GET",
        headers: {
          partner_order_id: partnerOrder.id,
        },
      });

      const data = await response.json();

      console.log("Partner order details response:", data);

      if (!response.ok) {
        alert(
          data.error || data.message || "Failed to fetch partner order details",
        );
        return;
      }

      setSelectedPartnerOrder(data.partner_order || null);
    } catch (error) {
      console.error("Error fetching partner order details:", error);
      alert("Something went wrong while fetching partner order details");
    } finally {
      setViewLoading(false);
    }
  };

  // ================= DELETE PARTNER ORDER =================
  const handleDelete = async (partnerOrder) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this partner order?",
    );

    if (!confirmDelete) return;
    if (deletingId) return;

    try {
      setDeletingId(partnerOrder.id);

      const response = await fetch(API.DELETE_PARTNER_ORDER, {
        method: "DELETE",
        headers: {
          partner_order_id: partnerOrder.id,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Failed to delete partner order");
        return;
      }

      setPartnerOrders((prev) =>
        prev.filter((item) => item.id !== partnerOrder.id),
      );

      alert(data.message || "Partner order deleted successfully");
    } catch (error) {
      console.error("Error deleting partner order:", error);
      alert("Something went wrong while deleting partner order");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Partner Orders</h2>
          <p className="text-muted mb-0">Manage all assigned partner orders</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Partner Order ID</th>
                  <th>Order ID</th>
                  <th>Partner ID</th>
                  <th>User ID</th>
                  <th>Service Name</th>
                  <th>Order Status</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th style={{ width: "220px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      Loading partner orders...
                    </td>
                  </tr>
                ) : partnerOrders.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No partner orders found
                    </td>
                  </tr>
                ) : (
                  partnerOrders.map((partnerOrder) => (
                    <tr key={partnerOrder.id}>
                      <td>{formatText(partnerOrder.id)}</td>
                      <td>{formatText(partnerOrder.order_id)}</td>
                      <td>{formatText(partnerOrder.partner_id)}</td>
                      <td>{formatText(partnerOrder.user_id)}</td>
                      <td>{formatText(partnerOrder.service_name)}</td>
                      <td>{formatText(partnerOrder.order_status)}</td>
                      <td>{formatText(partnerOrder.total_amount)}</td>
                      <td>{formatText(partnerOrder.payment_status)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#viewPartnerOrderModal"
                            onClick={() => handleView(partnerOrder)}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(partnerOrder)}
                            disabled={deletingId === partnerOrder.id}
                          >
                            {deletingId === partnerOrder.id
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

      {/* VIEW MODAL */}
      <div
        className="modal fade"
        id="viewPartnerOrderModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">Partner Order Details</h5>
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
                <p className="mb-0">Loading partner order details...</p>
              ) : selectedPartnerOrder ? (
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Partner Order ID
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Order ID</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.order_id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Partner ID</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.partner_id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">User ID</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.user_id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Service ID</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.service_id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Service Name</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.service_name)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Service Category
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.service_category)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Booking Date</div>
                      <div className="fw-semibold">
                        {formatDate(selectedPartnerOrder.booking_date)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Booking Time</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.booking_time)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Order Status</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.order_status)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Total Amount</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.total_amount)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Partner Earning
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.partner_earning)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Admin Commission
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.admin_commission)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Payment Mode</div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.payment_mode)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Payment Status
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.payment_status)}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Service Address
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPartnerOrder.service_address)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Created At</div>
                      <div className="fw-semibold">
                        {formatDateTime(selectedPartnerOrder.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Modified At</div>
                      <div className="fw-semibold">
                        {formatDateTime(selectedPartnerOrder.modified_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mb-0">No partner order selected</p>
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
    </div>
  );
}
