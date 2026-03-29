import "bootstrap/dist/css/bootstrap.min.css";
import { HOST } from "../utils/host";
import "./Product.css";

export default function Product({ image, name, price, cutPrice, onClick }) {
  return (
    <div className="product-grid-item mb-2 px-2 d-flex">
      <div
        className="w-100 d-flex flex-column text-center"
        onClick={onClick}
        style={{
          height: "180px",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #e5e5e5",
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          cursor: "pointer",
          transition: "0.25s",
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
            height: "85px",
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />

        {/* NAME */}
        <div
          className="mt-2"
          style={{
            fontSize: "14px",
            fontWeight: "600",
            lineHeight: "1.2",
            minHeight: "28px",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
          }}
        >
          {name}
        </div>

        {/* PRICE */}
        <div className="mt-1 d-flex justify-content-center align-items-center gap-2">
          <span
            style={{
              background: "#FFC500",
              padding: "5px 8px",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "12px",
            }}
          >
            ₹ {price}
          </span>

          {cutPrice && (
            <span
              className="text-muted text-decoration-line-through"
              style={{ fontSize: "12px" }}
            >
              ₹ {cutPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
