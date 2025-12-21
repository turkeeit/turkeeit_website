import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getUserDetails,
  updateUserProfile,
} from "../redux/actions/authActions";
import { useDispatch } from "react-redux";

export default function OrderDetails() {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const baseService = useSelector((state) => state.services.serviceDetails);
  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [newAddress, setNewAddress] = useState(user?.address);

  const basePrice = Number(baseService?.price || 0);
  const additionalsTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const total = basePrice + additionalsTotal;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getUserDetails(token));
    }
  }, []);

  /* 🔐 Fetch user when profile page opens */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(getUserDetails(token));
    }
  }, [dispatch, user]);

  const handleAddressSave = () => {
    if (!newAddress.trim()) {
      alert("Address cannot be empty");
      return;
    }
    if (!user?.name || !user?.gender) {
      alert("User profile not loaded yet");
      return;
    }

    dispatch(
      updateUserProfile({
        name: user?.name,
        gender: user?.gender,
        address: newAddress, // ✅ ONLY ADDRESS
      })
    );
    setShowModal(false);
  };

  return (
    <>
      <Header />

      <div className="container mt-4">
        <h5 className="mb-3">Order Details</h5>

        <div className="row">
          {/* CART */}
          <div className="col-12 col-md-6 mb-3">
            <div className="card shadow-sm rounded-3 p-3">
              <h6 className="fw-bold mb-3">Cart</h6>

              {/* Base Service */}
              {baseService && (
                <div className="d-flex justify-content-between mb-2">
                  <div>{baseService.name}</div>
                  <div>₹{baseService.price}</div>
                </div>
              )}

              {/* Additionals */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-2 small"
                >
                  <div>{item.name}</div>
                  <div>₹{item.price}</div>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button className="btn btn-primary w-100 mt-3">Checkout</button>
            </div>
          </div>

          {/* USER DETAILS */}
          <div className="col-12 col-md-6 mb-3">
            <div className="card shadow-sm rounded-3 p-3">
              <h6 className="fw-bold mb-3">User Details</h6>

              <p className="mb-1">
                <strong>Name:</strong> {user?.name}
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> {user?.user_id}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {user?.address}
              </p>

              <button
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => setShowModal(true)}
              >
                Change Address
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Address</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="3"
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
                  Save Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
