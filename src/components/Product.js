import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Product({ image, name, price, cutPrice, onClick }) {
  return (
    <div className="col-6 col-md-2 mb-2">
      <div className="border rounded-2 p-1 text-center">
        {/* Image */}
        <div
          style={{ width: "80%", margin: "0 auto" }}
          role="button"
          onClick={onClick}
        >
          <img
            src={`http://139.59.58.233:3000${image}`}
            className="w-100 rounded"
            style={{
              height: "65px",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Name */}
        <div className="small fw-semibold mt-1 text-truncate">{name}</div>

        {/* Price */}
        <div className="small fw-bold text-primary">
          ₹{price}
          {cutPrice && (
            <span className="text-muted fw-normal text-decoration-line-through ms-1">
              ₹{cutPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
