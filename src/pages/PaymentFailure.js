import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";

const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function PaymentFailure() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedState = location.state || {};

  return (
    <>
      <Header />

      <div className="container mt-5" style={{ fontFamily: FONT_FAMILY }}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div
              className="bg-white shadow-sm p-5 text-center"
              style={{ border: "1px solid #ddd", borderRadius: "12px" }}
            >
              <div
                style={{ fontSize: "50px", color: "red", marginBottom: "12px" }}
              >
                ✕
              </div>

              <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>
                Payment Failed
              </h2>

              <p style={{ color: "#666", marginBottom: "20px" }}>
                Your payment was not completed. Please try again.
              </p>

              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn"
                  onClick={() =>
                    navigate("/payment-method", { state: passedState })
                  }
                  style={{
                    background: "#f4bf00",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontWeight: "600",
                  }}
                >
                  Try Again
                </button>

                <button
                  className="btn btn-outline-dark"
                  onClick={() => navigate("/")}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontWeight: "600",
                  }}
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
