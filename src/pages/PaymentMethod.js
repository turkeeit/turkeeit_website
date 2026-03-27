import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/actions/cartActions";

const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function PaymentMethod() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const {
    bookingDate,
    bookingTime,
    orderItems = [],
    subtotal = 0,
    platformFee = 0,
    total = 0,
    selectedAddress = null,
    userName: stateUserName,
    user_id: stateUserId,
  } = location.state || {};

  const { user } = useSelector((state) => state.auth || {});

  const formatAddress = (address) => {
    if (!address) return "No address added";

    return [
      address.flat_no,
      address.building_name,
      address.area_name,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const userName = stateUserName || user?.name || "User";
  const mobileNumber = stateUserId || user?.user_id || "-";

  const handleContinue = () => {
    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    if (paymentMethod === "COD") {
      // ✅ COD confirm hote hi cart clear
      dispatch(clearCart());

      navigate("/order-confirmed", {
        state: {
          paymentMethod,
          bookingDate,
          bookingTime,
          orderItems,
          subtotal,
          platformFee,
          total,
          selectedAddress,
          bookedBy: userName,
          mobileNumber,
        },
      });
    } else {
      // ✅ online payment me abhi cart clear mat karo
      // cart successful payment ke baad clear hoga
      alert("Next step: open Razorpay for online payment");
    }
  };

  return (
    <>
      <Header />

      <div
        className="container mb-2"
        style={{
          fontFamily: FONT_FAMILY,
          marginTop: "10px",
        }}
      >
        <div className="row g-4">
          <div className="col-lg-7">
            <div
              className="bg-white shadow-sm p-4"
              style={{ border: "1px solid #ddd" }}
            >
              <h3
                style={{
                  fontWeight: "600",
                  fontSize: "22px",
                  marginBottom: "20px",
                }}
              >
                Select Payment Method
              </h3>

              <div className="mb-4">
                <div
                  className="p-3 mb-3"
                  style={{
                    border:
                      paymentMethod === "COD"
                        ? "2px solid #f4bf00"
                        : "1px solid #ddd",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="me-2"
                  />
                  <strong>Cash on Delivery</strong>
                </div>

                <div
                  className="p-3"
                  style={{
                    border:
                      paymentMethod === "ONLINE"
                        ? "2px solid #f4bf00"
                        : "1px solid #ddd",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setPaymentMethod("ONLINE")}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "ONLINE"}
                    onChange={() => setPaymentMethod("ONLINE")}
                    className="me-2"
                  />
                  <strong>Online Payment</strong>
                </div>
              </div>

              <div
                className="p-3"
                style={{
                  background: "#fafafa",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                }}
              >
                <h5 style={{ fontWeight: "600", marginBottom: "14px" }}>
                  Booking Summary
                </h5>

                <p className="mb-2">
                  <strong>Booked By:</strong> {userName}
                </p>
                <p className="mb-2">
                  <strong>Mobile Number:</strong> {mobileNumber}
                </p>
                <p className="mb-2">
                  <strong>Date:</strong> {bookingDate || "--"}
                </p>
                <p className="mb-2">
                  <strong>Time:</strong> {bookingTime || "--"}
                </p>
                <p className="mb-0">
                  <strong>Address:</strong> {formatAddress(selectedAddress)}
                </p>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button
                  className="btn"
                  onClick={() => navigate(-1)}
                  style={{
                    minWidth: "140px",
                    background: "#ddd",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontWeight: "600",
                  }}
                >
                  Back
                </button>

                <button
                  className="btn"
                  onClick={handleContinue}
                  style={{
                    minWidth: "140px",
                    background: "#008000",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div
              className="bg-white shadow-sm p-4"
              style={{ border: "1px solid #ddd" }}
            >
              <h4 style={{ fontWeight: "600", marginBottom: "16px" }}>
                Price Details
              </h4>

              <div
                style={{
                  background: "#f3f3f3",
                  borderRadius: "14px",
                  padding: "16px",
                }}
              >
                {orderItems.map((item, index) => {
                  const qty = Number(item.qty || item.quantity || 1);
                  const price = Number(item.price || 0);

                  return (
                    <div
                      key={item.service_id || item.id || index}
                      className="d-flex justify-content-between mb-2"
                    >
                      <span>
                        {item.name} x {qty}
                      </span>
                      <span>₹ {price * qty}</span>
                    </div>
                  );
                })}

                <div className="d-flex justify-content-between mb-2">
                  <span>Platform Fees</span>
                  <span>₹ {platformFee}</span>
                </div>

                <hr />

                <div
                  className="d-flex justify-content-between"
                  style={{ fontWeight: "700", fontSize: "18px" }}
                >
                  <span>Total</span>
                  <span>₹ {total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
