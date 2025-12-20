import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getServiceDetails } from "../redux/actions/serviceActions";
import { useDispatch } from "react-redux";
import ServiceDetailsModal from "./ServiceDetailsModal";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdditionalItem({
  image,
  name,
  price,
  cutPrice,
  onAdd,
  inCart,
  onRemove,
  openServiceDetails,
}) {
  return (
    <div className="col-6 col-md-3 mt-2">
      <div
        className="card p-2 shadow-sm rounded-3 h-100 text-center"
        onClick={openServiceDetails}
      >
        {/* Image */}
        <img
          src={image}
          alt={name}
          className="img-fluid rounded mb-1"
          style={{
            height: "80px",
            objectFit: "cover",
          }}
        />

        {/* Name */}
        <div className="fw-semibold" style={{ fontSize: "11px" }}>
          {name}
        </div>

        {/* Price */}
        <div style={{ fontSize: "11px" }}>
          <span className="fw-bold text-primary">
            <i className="bi bi-currency-rupee"></i>
            {price}
          </span>

          {cutPrice && (
            <span className="text-muted text-decoration-line-through ms-1">
              <i className="bi bi-currency-rupee"></i>
              {cutPrice}
            </span>
          )}
        </div>

        {/* Add Button */}
        {!inCart ? (
          <button
            className="btn btn-primary btn-sm w-100 mt-2"
            style={{ fontSize: "10px", padding: "2px 0" }}
            onClick={(e) => {
              e.stopPropagation(); // 🔥 KEY LINE
              onAdd();
            }}
          >
            Add
          </button>
        ) : (
          <button
            className="btn btn-danger btn-sm w-100 mt-2"
            style={{ fontSize: "10px", padding: "2px 0" }}
            onClick={(e) => {
              e.stopPropagation(); // 🔥 KEY LINE
              onRemove();
            }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
