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
    <div className="border-bottom pb-3 mb-3">
      <div className="row align-items-center">
        <div className="col-md-5">
          <img
            src={`${HOST}${item.image}`}
            alt={item.name}
            style={{
              width: "100%",
              maxWidth: "200px",
              height: "110px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>

        <div className="col-md-7">
          <h3 style={{ fontWeight: "700" }}>{item.name}</h3>

          <div style={{ marginBottom: "10px" }}>
            <span style={{ color: "#f4b400", marginRight: "6px" }}>★</span>
            4.8 Ratings
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              style={{
                background: "#f3d46a",
                padding: "6px 16px",
                fontWeight: "700",
                fontSize: "18px",
              }}
            >
              ₹ {item.price}
            </div>

            <div
              style={{
                color: "#999",
                textDecoration: "line-through",
                fontSize: "18px",
              }}
            >
              ₹ {Math.round(item.price * 1.2)}
            </div>
          </div>

          <div className="d-flex gap-3 align-items-center">
            <div
              style={{
                background: "#f4bf00",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                fontWeight: "600",
              }}
            >
              <span
                style={{ cursor: "pointer" }}
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
              <span>{item.qty}</span>
              <span
                style={{ cursor: "pointer" }}
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
              className="btn btn-danger btn-sm w-100"
              style={{ borderRadius: "8px", fontWeight: "600" }}
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
