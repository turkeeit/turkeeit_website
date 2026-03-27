import { useDispatch } from "react-redux";
import {
  removeFromCart,
  incrementCartItem,
  decrementCartItem,
} from "../redux/actions/cartActions";
import { HOST } from "../utils/host";

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div
      className="pb-4 mb-4"
      style={{
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <div className="row align-items-center">
        {/* Image */}
        <div className="col-md-5">
          <img
            src={`${HOST}${item.image}`}
            alt={item.name}
            style={{
              width: "100%",
              maxWidth: "200px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>

        {/* Details */}
        <div className="col-md-7">
          {/* Title */}
          <h3
            style={{
              fontWeight: "600",
              fontSize: "24px",
              color: "#1f1f1f",
              marginBottom: "6px",
              letterSpacing: "0.2px",
            }}
          >
            {item.name}
          </h3>

          {/* Rating */}
          <div
            style={{
              marginBottom: "12px",
              fontSize: "15px",
              color: "#555",
              fontWeight: "500",
            }}
          >
            <span
              style={{
                color: "#f4b400",
                marginRight: "6px",
                fontSize: "14px",
              }}
            >
              ★
            </span>
            4.8 Ratings
          </div>

          {/* Price */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              style={{
                background: "#f3d46a",
                padding: "6px 14px",
                fontWeight: "600",
                fontSize: "16px",
                color: "#111",
                borderRadius: "3px",
              }}
            >
              ₹ {item.price}
            </div>

            <div
              style={{
                color: "#9a9a9a",
                textDecoration: "line-through",
                fontSize: "15px",
                fontWeight: "400",
              }}
            >
              ₹ {Math.round(item.price * 1.2)}
            </div>
          </div>

          {/* Qty + Remove */}
          <div className="d-flex align-items-center">
            <div
              style={{
                background: "#f3efe5",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "22px",
                borderRadius: "8px",
              }}
            >
              <span
                style={{
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#333",
                }}
                onClick={async () => {
                  try {
                    await dispatch(decrementCartItem(item));
                  } catch (error) {
                    console.error("Decrement failed:", error);
                    alert("Failed to update quantity");
                  }
                }}
              >
                ⊖
              </span>

              <span
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  color: "#222",
                }}
              >
                {item.qty}
              </span>

              <span
                style={{
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#333",
                }}
                onClick={async () => {
                  try {
                    await dispatch(incrementCartItem(item));
                  } catch (error) {
                    console.error("Increment failed:", error);
                    alert("Failed to update quantity");
                  }
                }}
              >
                ⊕
              </span>
            </div>

            <button
              className="btn btn-danger"
              style={{
                borderRadius: "6px",
                fontWeight: "500",
                fontSize: "15px",
                padding: "8px 20px",
                marginLeft: "28px",
                background: "#ef4d5a",
                border: "none",
              }}
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await dispatch(removeFromCart(Number(item.service_id)));
                } catch (error) {
                  console.error("Remove from cart failed:", error);
                  alert("Failed to remove item from cart");
                }
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
