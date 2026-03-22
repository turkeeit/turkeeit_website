import "bootstrap/dist/css/bootstrap.min.css";
import { HOST } from "../utils/host";

export default function Product({ image, name, price, cutPrice, onClick }) {
  return (
    <div className="col-6 col-md-3 mb-4 d-flex">
      <div
        className="w-100 text-center d-flex flex-column justify-content-between"
        style={{
          height: "280px", // 🔥 increased height
          borderRadius: "14px",
          border: "1px solid #ddd",
          background: "#fff",
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          padding: "12px",
        }}
      >
        {/* Image */}
        <div
          role="button"
          onClick={onClick}
          style={{
            overflow: "hidden",
            borderRadius: "10px",
          }}
        >
          <img
            src={`${HOST}${image}`}
            alt={name}
            className="w-100"
            style={{
              height: "150px", // 🔥 bigger image
              objectFit: "cover",
            }}
          />
        </div>

        {/* Name */}
        <div
          className="fw-semibold mt-2"
          style={{
            fontSize: "20px", // 🔥 bigger text
            minHeight: "40px", // keeps alignment same
          }}
        >
          {name}
        </div>

        {/* Price Section */}
        <div className="d-flex flex-column align-items-center">
          {/* Price Badge */}
          <div
            style={{
              background: "#FFC107",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px", // 🔥 bigger price
              padding: "6px 14px",
            }}
          >
            ₹ {price}
          </div>

          {/* Cut Price */}
          {cutPrice && (
            <div
              className="text-muted mt-1"
              style={{
                textDecoration: "line-through",
                fontSize: "18px",
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
