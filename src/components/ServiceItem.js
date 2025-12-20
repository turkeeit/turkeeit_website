import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ServiceItem({ icon, name }) {
  return (
    <div className="col-3 mt-2">
      <div className="card text-center p-1 shadow-sm rounded-3">
        <i
          className={`bi ${icon}`}
          style={{ fontSize: "18px", color: "#0d6efd" }}
        ></i>

        <div className="fw-semibold mt-1" style={{ fontSize: "10px" }}>
          {name}
        </div>
      </div>
    </div>
  );
}
