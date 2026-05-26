import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";

const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function OrderConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();

  const { paymentMethod, bookingDate, bookingTime, total } =
    location.state || {};

  return (
    <>
      <Header />
      <div className="header-spacing"></div>
      <div className="container mt-5" style={{ fontFamily: FONT_FAMILY }}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div
              className="bg-white shadow-sm p-5 text-center"
              style={{ border: "1px solid #ddd", borderRadius: "12px" }}
            >
              <div
                style={{
                  fontSize: "50px",
                  color: "green",
                  marginBottom: "12px",
                }}
              >
                ✓
              </div>

              <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>
                Order Confirmed
              </h2>

              <p style={{ color: "#666", marginBottom: "20px" }}>
                Your booking has been placed successfully.
              </p>

              <p className="mb-2">
                <strong>Payment Method:</strong> {paymentMethod}
              </p>
              <p className="mb-2">
                <strong>Date:</strong> {bookingDate}
              </p>
              <p className="mb-2">
                <strong>Time:</strong> {bookingTime}
              </p>
              <p className="mb-4">
                <strong>Total:</strong> ₹ {total}
              </p>

              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn"
                  onClick={() => navigate("/")}
                  style={{
                    background: "#f4bf00",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontWeight: "600",
                  }}
                >
                  Go to Home
                </button>

                <button
                  className="btn btn-outline-dark"
                  onClick={() => navigate("/user/orders")}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontWeight: "600",
                  }}
                >
                  My Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
