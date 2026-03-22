import "bootstrap/dist/css/bootstrap.min.css";
import { HOST } from "../utils/host";

export default function Product({ image, name, price, cutPrice, onClick }) {
  return (
    <div className="col-6 col-md-2">
      {" "}
      {/* 🔥 more items per row */}
      <div
        onClick={onClick}
        style={{
          borderRadius: "8px",
          border: "1px solid #e6e6e6",
          background: "#fff",
          padding: "6px", // minimal padding
          cursor: "pointer",
          height: "160px", // 🔥 very small
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* IMAGE */}
        <img
          src={`${HOST}${image}`}
          alt={name}
          style={{
            width: "100%",
            height: "55px", // 🔥 very small image
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />

        {/* NAME */}
        <div
          style={{
            fontSize: "11px",
            fontWeight: "600",
            textAlign: "center",
            minHeight: "26px",
          }}
        >
          {name}
        </div>

        {/* PRICE */}
        <div className="text-center">
          <span
            style={{
              background: "#FFC107",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: "600",
            }}
          >
            ₹ {price}
          </span>

          {cutPrice && (
            <div
              style={{
                fontSize: "9px",
                color: "#888",
                textDecoration: "line-through",
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
