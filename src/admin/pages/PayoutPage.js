import { useEffect, useState } from "react";
import { API } from "../../utils/host";

const getEmptyCreateForm = () => ({
  partner_order_id: "",
});

const getEmptyMarkPaidForm = () => ({
  payout_id: "",
  payout_method: "",
  payout_reference_id: "",
});

export default function PayoutPage() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState(null);

  const [createForm, setCreateForm] = useState(getEmptyCreateForm());
  const [markPaidForm, setMarkPaidForm] = useState(getEmptyMarkPaidForm());

  const [creating, setCreating] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const [eligiblePartnerOrders, setEligiblePartnerOrders] = useState([]);
  const [eligibleOrdersLoading, setEligibleOrdersLoading] = useState(false);

  // ================= FETCH PAYOUTS =================
  const fetchPayouts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API.GET_ALL_PAYOUTS);
      const data = await response.json();

      console.log("Payouts API response:", data);

      setPayouts(data.payouts || []);
    } catch (error) {
      console.error("Error fetching payouts:", error);
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  // ================= FETCH ELIGIBLE PARTNER ORDERS =================
  const fetchEligiblePartnerOrders = async () => {
    try {
      setEligibleOrdersLoading(true);

      const response = await fetch(API.GET_ALL_PARTNER_ORDERS);
      const data = await response.json();

      console.log("Partner orders API response:", data);

      const allPartnerOrders =
        data.partner_orders || data.orders || data.data || [];

      const createdPayoutPartnerOrderIds = new Set(
        (payouts || []).map((item) => String(item.partner_order_id || "")),
      );

      const filteredOrders = allPartnerOrders.filter((item) => {
        const orderStatus = String(item.order_status || "").toLowerCase();
        const paymentStatus = String(item.payment_status || "").toLowerCase();
        const partnerOrderId = String(item.partner_order_id || item.id || "");

        return (
          partnerOrderId &&
          orderStatus === "completed" &&
          paymentStatus === "paid" &&
          !createdPayoutPartnerOrderIds.has(partnerOrderId)
        );
      });

      setEligiblePartnerOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching eligible partner orders:", error);
      setEligiblePartnerOrders([]);
    } finally {
      setEligibleOrdersLoading(false);
    }
  };

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

  // ================= OPEN MODALS =================
  const handleCreateOpen = async () => {
    setCreateForm(getEmptyCreateForm());
    await fetchEligiblePartnerOrders();
  };

  const handleView = async (payout) => {
    try {
      setViewLoading(true);
      setSelectedPayout(null);

      const response = await fetch(API.GET_PAYOUT_DETAILS, {
        method: "GET",
        headers: {
          payout_id: payout.payout_id,
        },
      });

      const data = await response.json();

      console.log("Payout details response:", data);

      if (!response.ok) {
        alert(data.message || data.error || "Failed to fetch payout details");
        return;
      }

      setSelectedPayout(data.payout || payout);
    } catch (error) {
      console.error("Error fetching payout details:", error);
      setSelectedPayout(payout);
    } finally {
      setViewLoading(false);
    }
  };

  const handleMarkPaidOpen = (payout) => {
    setMarkPaidForm({
      payout_id: payout.payout_id || "",
      payout_method: payout.payout_method || "",
      payout_reference_id: payout.payout_reference_id || "",
    });
  };

  // ================= CREATE PAYOUT =================
  const handleCreatePayout = async (e) => {
    e.preventDefault();

    if (creating) return;

    if (!createForm.partner_order_id) {
      alert("partner_order_id is required");
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(API.CREATE_PAYOUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partner_order_id: createForm.partner_order_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || "Failed to create payout");
        return;
      }

      await fetchPayouts();

      setCreateForm(getEmptyCreateForm());
      setEligiblePartnerOrders([]);

      document.getElementById("closeCreatePayoutModalBtn").click();

      alert(data.message || "Payout created successfully");
    } catch (error) {
      console.error("Error creating payout:", error);
      alert("Something went wrong while creating payout");
    } finally {
      setCreating(false);
    }
  };

  // ================= MARK PAYOUT PAID =================
  const handleMarkPaid = async (e) => {
    e.preventDefault();

    if (markingPaid) return;

    if (
      !markPaidForm.payout_id ||
      !markPaidForm.payout_method ||
      !markPaidForm.payout_reference_id
    ) {
      alert("payout_id, payout_method and payout_reference_id are required");
      return;
    }

    try {
      setMarkingPaid(true);

      const response = await fetch(API.MARK_PAYOUT_PAID, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payout_id: markPaidForm.payout_id,
          payout_method: markPaidForm.payout_method,
          payout_reference_id: markPaidForm.payout_reference_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || "Failed to mark payout paid");
        return;
      }

      await fetchPayouts();

      setMarkPaidForm(getEmptyMarkPaidForm());

      document.getElementById("closeMarkPaidModalBtn").click();

      alert(data.message || "Payout marked as paid successfully");
    } catch (error) {
      console.error("Error marking payout paid:", error);
      alert("Something went wrong while marking payout paid");
    } finally {
      setMarkingPaid(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Payout</h2>
          <p className="text-muted mb-0">Manage all partner payouts</p>
        </div>

        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#createPayoutModal"
          onClick={handleCreateOpen}
        >
          Create Payout
        </button>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Payout ID</th>
                  <th>Partner Order ID</th>
                  <th>Order ID</th>
                  <th>Partner ID</th>
                  <th>Service</th>
                  <th>Booking Date</th>
                  <th>Partner Earning</th>
                  <th>Payout Status</th>
                  <th>Payment Status</th>
                  <th style={{ width: "220px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      Loading payouts...
                    </td>
                  </tr>
                ) : payouts.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      No payouts found
                    </td>
                  </tr>
                ) : (
                  payouts.map((payout) => (
                    <tr key={payout.payout_id}>
                      <td>{formatText(payout.payout_id)}</td>
                      <td>{formatText(payout.partner_order_id)}</td>
                      <td>{formatText(payout.order_id)}</td>
                      <td>{formatText(payout.partner_id)}</td>
                      <td>{formatText(payout.service_name)}</td>
                      <td>{formatDate(payout.booking_date)}</td>
                      <td>{formatText(payout.partner_earning)}</td>
                      <td>{formatText(payout.payout_status)}</td>
                      <td>{formatText(payout.payment_status)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#viewPayoutModal"
                            onClick={() => handleView(payout)}
                          >
                            View
                          </button>

                          {String(payout.payout_status).toLowerCase() ===
                          "paid" ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-success"
                              disabled
                            >
                              Paid
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              data-bs-toggle="modal"
                              data-bs-target="#markPaidModal"
                              onClick={() => handleMarkPaidOpen(payout)}
                            >
                              Mark Paid
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

      {/* CREATE PAYOUT MODAL */}
      <div
        className="modal fade"
        id="createPayoutModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleCreatePayout}>
              <div className="modal-header">
                <h5 className="modal-title">Create Payout</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Partner Order ID</label>
                  <select
                    className="form-select"
                    value={createForm.partner_order_id}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        partner_order_id: e.target.value,
                      }))
                    }
                    required
                    disabled={eligibleOrdersLoading}
                  >
                    <option value="">
                      {eligibleOrdersLoading
                        ? "Loading eligible partner orders..."
                        : "Select partner order id"}
                    </option>

                    {eligiblePartnerOrders.map((order) => (
                      <option
                        key={order.partner_order_id || order.id}
                        value={order.partner_order_id || order.id}
                      >
                        {(order.partner_order_id || order.id) +
                          " - " +
                          formatText(order.service_name) +
                          " - ₹" +
                          formatText(order.partner_earning)}
                      </option>
                    ))}
                  </select>

                  {!eligibleOrdersLoading &&
                    eligiblePartnerOrders.length === 0 && (
                      <div className="form-text text-danger mt-2">
                        No eligible partner orders found. Only completed and
                        paid partner orders without payout are shown here.
                      </div>
                    )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeCreatePayoutModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating || eligiblePartnerOrders.length === 0}
                >
                  {creating ? "Creating..." : "Create Payout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* VIEW PAYOUT MODAL */}
      <div
        className="modal fade"
        id="viewPayoutModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">Payout Details</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              {viewLoading ? (
                <p className="mb-0">Loading payout details...</p>
              ) : selectedPayout ? (
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Payout ID</div>
                      <div className="fw-semibold">
                        {formatText(
                          selectedPayout.payout_id || selectedPayout.id,
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Partner Order ID
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.partner_order_id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Order ID</div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.order_id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Partner ID</div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.partner_id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Service Name</div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.service_name)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Service Category
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.service_category)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Booking Date</div>
                      <div className="fw-semibold">
                        {formatDate(selectedPayout.booking_date)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Booking Time</div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.booking_time)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Payment Method
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.payment_method)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Payment Status
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.payment_status)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Total Order Amount
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.total_order_amount)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Platform Fee</div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.platform_fee)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Taxes</div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.taxes)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Partner Earning
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.partner_earning)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Payout Status</div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.payout_status)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Payout Method</div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.payout_method)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">
                        Payout Reference ID
                      </div>
                      <div className="fw-semibold">
                        {formatText(selectedPayout.payout_reference_id)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Paid At</div>
                      <div className="fw-semibold">
                        {formatDateTime(selectedPayout.paid_at)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="small text-muted mb-1">Created At</div>
                      <div className="fw-semibold">
                        {formatDateTime(selectedPayout.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mb-0">No payout selected</p>
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

      {/* MARK PAID MODAL */}
      <div
        className="modal fade"
        id="markPaidModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleMarkPaid}>
              <div className="modal-header">
                <h5 className="modal-title">Mark Payout Paid</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Payout ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={markPaidForm.payout_id}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Payout Method</label>
                  <select
                    className="form-select"
                    value={markPaidForm.payout_method}
                    onChange={(e) =>
                      setMarkPaidForm((prev) => ({
                        ...prev,
                        payout_method: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select Payout Method</option>
                    <option value="bank_transfer">bank_transfer</option>
                    <option value="upi">upi</option>
                    <option value="cash">cash</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Payout Reference ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={markPaidForm.payout_reference_id}
                    onChange={(e) =>
                      setMarkPaidForm((prev) => ({
                        ...prev,
                        payout_reference_id: e.target.value,
                      }))
                    }
                    placeholder="Enter payout reference id"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeMarkPaidModalBtn"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={markingPaid}
                >
                  {markingPaid ? "Saving..." : "Mark Paid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
