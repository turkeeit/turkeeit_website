import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../redux/actions/orderActions";
import { clearCart } from "../redux/actions/cartActions";

const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.order || {});

  const {
    bookingDate,
    bookingTime,
    orderItems = [],
    subtotal = 0,
    platformFee = 0,
    total = 0,
    selectedAddress = null,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const formatAddress = (address) => {
    if (!address) return "";

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

  const handleContinue = async () => {
    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    if (!bookingDate || !bookingTime) {
      alert("Booking date and time missing");
      return;
    }

    if (!selectedAddress) {
      alert("Address missing");
      return;
    }

    if (!orderItems.length) {
      alert("No items found");
      return;
    }

    try {
      const payload = {
        address: formatAddress(selectedAddress),
        total_price: total,
        cart_items: orderItems.map((item) => ({
          service_id: item.service_id || item.id,
          quantity: Number(item.qty || item.quantity || 1),
          price: Number(item.price || 0),
        })),
        service_date: bookingDate,
        service_time: bookingTime,
        payment_method: paymentMethod,
      };

      const response = await dispatch(createOrder(payload));

      if (paymentMethod === "COD") {
        dispatch(clearCart());

        navigate("/order-confirmed", {
          state: {
            orderId: response?.order_id,
            paymentMethod,
            bookingDate,
            bookingTime,
            orderItems,
            subtotal,
            platformFee,
            total,
            selectedAddress,
          },
        });
      } else {
        alert("Next step: online payment integration");
      }
    } catch (error) {
      console.error(
        "Create order error:",
        error?.response?.data || error.message,
      );
      alert(error?.response?.data?.error || "Failed to create order");
    }
  };

  return (
    <>
      <Header />

      <div className="container mt-4 mb-4" style={{ fontFamily: FONT_FAMILY }}>
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
                  <strong>Date:</strong> {bookingDate || "--"}
                </p>
                <p className="mb-2">
                  <strong>Time:</strong> {bookingTime || "--"}
                </p>
                <p className="mb-0">
                  <strong>Address:</strong>{" "}
                  {formatAddress(selectedAddress) || "No address added"}
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
                  disabled={loading}
                  style={{
                    minWidth: "140px",
                    background: "#008000",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontWeight: "600",
                    color: "#fff",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Please wait..." : "Confirm"}
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
