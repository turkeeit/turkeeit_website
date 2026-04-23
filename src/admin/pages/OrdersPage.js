import { useEffect, useState } from "react";
import { API } from "../../utils/host";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [assigning, setAssigning] = useState(false);
  const [assignForm, setAssignForm] = useState({
    order_id: "",
    partner_id: "",
  });

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(API.GET_ALL_ORDERS);
      const data = await response.json();

      console.log("Orders API response:", data);

      setOrders(data.order_list || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH PARTNERS =================
  const fetchPartners = async () => {
    try {
      const response = await fetch(API.GET_ALL_PARTNERS);
      const data = await response.json();

      console.log("Partners API response:", data);

      setPartners(data.partners_list || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
      setPartners([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPartners();
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

  // ================= VIEW ORDER =================
  const handleView = (order) => {
    setSelectedOrder(order);
  };

  // ================= OPEN ASSIGN MODAL =================
  const handleAssignOpen = (order) => {
    setAssignForm({
      order_id: order.order_id || "",
      partner_id: "",
    });
  };

  // ================= ASSIGN PARTNER =================
  const handleAssignPartner = async (e) => {
    e.preventDefault();

    if (assigning) return;

    if (!assignForm.order_id || !assignForm.partner_id) {
      alert("order_id and partner_id are required");
      return;
    }

    try {
      setAssigning(true);

      const response = await fetch(API.ASSIGN_PARTNER_TO_ORDER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: assignForm.order_id,
          partner_id: Number(assignForm.partner_id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || "Failed to assign partner");
        return;
      }

      await fetchOrders();

      setAssignForm({
        order_id: "",
        partner_id: "",
      });

      document.getElementById("closeAssignPartnerModalBtn").click();

      alert(data.message || "Partner assigned successfully");
    } catch (error) {
      console.error("Error assigning partner:", error);
      alert("Something went wrong while assigning partner");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Order List</h2>
          <p className="text-muted mb-0">Manage all orders</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Order Status</th>
                  <th>Total Price</th>
                  <th>Payment Status</th>
                  <th>Service Date</th>
                  <th style={{ width: "220px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.id}</td>
                      <td>{order.order_id}</td>
                      <td>{order.user_id}</td>
                      <td>{formatText(order.status)}</td>
                      <td>{formatText(order.total_price)}</td>
                      <td>{formatText(order.payment_status)}</td>
                      <td>{formatDate(order.service_date)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#viewOrderModal"
                            onClick={() => handleView(order)}
                          >
                            View
                          </button>

                          {order.status === "assigned" ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-success"
                              disabled
                            >
                              Assigned
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              data-bs-toggle="modal"
                              data-bs-target="#assignPartnerModal"
                              onClick={() => handleAssignOpen(order)}
                            >
                              Assign
                            </button>
                          )}
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

      {/* VIEW ORDER MODAL */}
      <div
        className="modal fade"
        id="viewOrderModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">Order Details</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {selectedOrder ? (
                <>
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">DB ID</div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.id)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">Order ID</div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.order_id)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">User ID</div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.user_id)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">Status</div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.status)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">Total Price</div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.total_price)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">
                          Payment Method
                        </div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.payment_method)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">
                          Payment Status
                        </div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.payment_status)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">
                          Service Date
                        </div>
                        <div className="fw-semibold">
                          {formatDate(selectedOrder.service_date)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">
                          Service Time
                        </div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.service_time)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">Created At</div>
                        <div className="fw-semibold">
                          {formatDateTime(selectedOrder.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">Address</div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.address)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">Payment ID</div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.payment_id)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">
                          Razorpay Order ID
                        </div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.razorpay_order_id)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">
                          Razorpay Payment ID
                        </div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.razorpay_payment_id)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="border rounded p-3">
                        <div className="small text-muted mb-1">
                          Razorpay Signature
                        </div>
                        <div className="fw-semibold">
                          {formatText(selectedOrder.razorpay_signature)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h6 className="mb-3">Order Items</h6>

                  <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Service</th>
                          <th>Service ID</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total Price</th>
                          <th>Type</th>
                          <th>Duration</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedOrder.order_items &&
                        selectedOrder.order_items.length > 0 ? (
                          selectedOrder.order_items.map((item) => (
                            <tr key={item.id}>
                              <td>{item.id}</td>
                              <td>{formatText(item.service_name)}</td>
                              <td>{formatText(item.service_id)}</td>
                              <td>{formatText(item.quantity)}</td>
                              <td>{formatText(item.price)}</td>
                              <td>{formatText(item.total_price)}</td>
                              <td>{formatText(item.service_type)}</td>
                              <td>
                                {formatText(item.duration_min)} -{" "}
                                {formatText(item.duration_max)} min
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-3">
                              No order items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p className="mb-0">No order selected</p>
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

      {/* ASSIGN PARTNER MODAL */}
      <div
        className="modal fade"
        id="assignPartnerModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleAssignPartner}>
              <div className="modal-header">
                <h5 className="modal-title">Assign Partner</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Order ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={assignForm.order_id}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Partner</label>
                  <select
                    className="form-select"
                    value={assignForm.partner_id}
                    onChange={(e) =>
                      setAssignForm((prev) => ({
                        ...prev,
                        partner_id: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select Partner</option>
                    {partners.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.name} (ID: {partner.id},{" "}
                        {partner.mobile_number})
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
                  id="closeAssignPartnerModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={assigning}
                >
                  {assigning ? "Assigning..." : "Assign Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
