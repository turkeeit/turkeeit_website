import "bootstrap/dist/css/bootstrap.min.css";
import { HOST } from "../utils/host";

export default function Product({ image, name, price, cutPrice, onClick }) {
  return (
    <div className="col-6 col-md-3 mb-4 mt-4 px-2 d-flex">
      {" "}
      {/* 🔥 more items per row */}
      <div
        className="w-100 d-flex flex-column text-center"
        onClick={onClick}
        style={{
          height: "380px", // 🔥 increased height
          padding: "15px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          background: "#fff",
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {/* IMAGE */}
        <img
          className="w-100"
          src={`${HOST}${image}`}
          alt={name}
          style={{
            height: "190px", // 🔥 taller image
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />

        {/* NAME */}
        <div
          className="fw-semibold mt-3"
          style={{
            fontSize: "20px",
            minHeight: "44px",
          }}
        >
          {name}
        </div>

        {/* PRICE */}
        <div className="text-center mt-2">
          <span
            style={{
              background: "#FFC107",
              padding: "8px 14px",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            ₹ {price}
          </span>

          {cutPrice && (
            <div
              className="text-muted mt-4"
              style={{
                textDecoration: "line-through",
                fontSize: "18px",
                color: "#888",
              }}
            >
              ₹ {cutPrice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
