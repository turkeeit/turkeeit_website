import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  getUserDetails,
  updateUserProfile,
} from "../redux/actions/authActions";
import {
  createOrder,
  updateOrderStatus,
} from "../redux/actions/razorpayActions";
import {
  BRAND_NAME,
  CURRENCY,
  DESCRIPTION,
  RAZORPAY_KEY,
  RAZORPAY_PAID_STATUS,
} from "../utils/host";

export default function OrderDetails() {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);

  // Editable states
  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editUserId, setEditUserId] = useState("");
  const [newAddress, setNewAddress] = useState("");

  // Load user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(getUserDetails(token));
  }, [dispatch]);

  // Autofill when user loads
  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditGender(user.gender || "");
      setEditUserId(user.user_id || "");
      setNewAddress(user.address || "");
    }
  }, [user]);

  // Total
  const additionalsTotal = cartItems
    .filter((item) => item.type === "additional")
    .reduce((sum, item) => sum + Number(item.price), 0);

  const total = additionalsTotal;

  // Save profile
  const handleAddressSave = () => {
    if (!editName || !editGender || !newAddress) {
      alert("All fields required");
      return;
    }

    dispatch(
      updateUserProfile({
        name: editName,
        gender: editGender,
        user_id: editUserId,
        address: newAddress,
      }),
    );

    setShowModal(false);
  };

  // Payment
  const handlePayment = async () => {
    if (!user || cartItems.length === 0) {
      alert("Please sign in & add items");
      return;
    }

    const createOrderRes = await dispatch(
      createOrder(cartItems, user.address, total),
    );

    if (!createOrderRes) return;

    const options = {
      key: RAZORPAY_KEY,
      amount: total * 100,
      currency: CURRENCY,
      name: BRAND_NAME,
      description: DESCRIPTION,
      order_id: createOrderRes.razorpay_order_id,

      handler: function (res) {
        dispatch(
          updateOrderStatus(
            createOrderRes.order_id,
            createOrderRes.razorpay_order_id,
            res.razorpay_payment_id,
            RAZORPAY_PAID_STATUS,
          ),
        );

        alert("Payment successful 🎉");
        window.location.href = "/";
      },

      prefill: {
        name: user.name,
        contact: user.user_id,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Header />

      <div className="container mt-4">
        <h5 className="mb-3">Order Details</h5>

        <div className="row">
          {/* CART */}
          <div className="col-md-6 mb-3">
            <div className="card p-3 shadow-sm">
              <h6>Cart</h6>

              {cartItems.map((item) => (
                <div key={item.id} className="d-flex justify-content-between">
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handlePayment}
              >
                Checkout
              </button>
            </div>
          </div>

          {/* USER DETAILS */}
          <div className="col-md-6 mb-3">
            <div className="card p-3 shadow-sm">
              {user ? (
                <>
                  <h6>User Details</h6>

                  <p>
                    <b>Name:</b> {user.name}
                  </p>
                  <p>
                    <b>Phone:</b> {user.user_id}
                  </p>
                  <p>
                    <b>Gender:</b> {user.gender}
                  </p>
                  <p>
                    <b>Address:</b> {user.address}
                  </p>

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowModal(true)}
                  >
                    Edit Details
                  </button>
                </>
              ) : (
                <p>Please sign in</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <select
                  className="form-control mb-2"
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <input
                  className="form-control mb-2"
                  value={editUserId}
                  disabled
                />

                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-primary" onClick={handleAddressSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
