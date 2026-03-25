import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../redux/actions/orderActions";
import { HOST } from "../utils/host";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.orders);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(getUserOrders(token));
  }, [dispatch]);

  const getStatusConfig = (status) => {
    switch ((status || "").toUpperCase()) {
      case "COMPLETED":
        return { text: "Completed", color: "#1ea84a", dot: "●" };
      case "CANCELLED":
        return { text: "Cancelled", color: "#e53935", dot: "●" };
      case "CONFIRMED":
        return { text: "Confirmed", color: "#1976d2", dot: "●" };
      case "PAID":
        return { text: "Paid", color: "#f4b400", dot: "●" };
      default:
        return { text: status || "Pending", color: "#6c757d", dot: "●" };
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d)) return date;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}, ${hours}:${minutes}`;
  };

  return (
    <>
      <Header />

      <div
        style={{
          background: "#f5f5f5",
          minHeight: "100vh",
          padding: "24px 0 40px",
        }}
      >
        <div className="container">
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e2e2",
              padding: "20px 28px 30px",
            }}
          >
            <div
              style={{
                background: "#ecd36c",
                display: "inline-block",
                padding: "6px 18px",
                fontWeight: "600",
                fontSize: "16px",
                marginBottom: "18px",
              }}
            >
              My Orders
            </div>

            {loading && (
              <div className="text-center py-5">
                <p style={{ margin: 0, fontSize: "15px", color: "#666" }}>
                  Loading orders...
                </p>
              </div>
            )}

            {!loading && (!orders || orders.length === 0) && (
              <div
                style={{
                  background: "#fafafa",
                  border: "1px dashed #d5d5d5",
                  padding: "50px 20px",
                  textAlign: "center",
                  color: "#666",
                }}
              >
                <h5 style={{ fontWeight: "600", marginBottom: "8px" }}>
                  No orders found
                </h5>
                <p style={{ margin: 0, fontSize: "14px" }}>
                  You have not placed any orders yet.
                </p>
              </div>
            )}

            {!loading &&
              orders?.length > 0 &&
              orders.map((order, index) => {
                const statusObj = getStatusConfig(order.status);

                return (
                  <div
                    key={order.id || order.order_id}
                    onClick={() => navigate(`/my-orders/${order.order_id}`)}
                    style={{
                      border: "1px solid #e2e2e2",
                      background: "#fff",
                      marginBottom: "14px",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Order Header */}
                    <div style={{ padding: "12px 14px 6px" }}>
                      <div
                        style={{
                          fontWeight: "700",
                          fontSize: "18px",
                          color: "#333",
                          lineHeight: "22px",
                        }}
                      >
                        #{order.order_id}
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#7a7a7a",
                          marginTop: "2px",
                        }}
                      >
                        {formatDateTime(order.created_at)}
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: statusObj.color,
                          marginTop: "2px",
                        }}
                      >
                        <span style={{ marginRight: "4px" }}>
                          {statusObj.dot}
                        </span>
                        {statusObj.text}
                      </div>
                    </div>

                    {/* Services */}
                    {order.order_items?.map((item, i) => (
                      <div key={i}>
                        <div
                          style={{
                            borderTop: "1px solid #ececec",
                            padding: "12px 14px",
                          }}
                        >
                          <div className="row align-items-center">
                            {/* Image */}
                            <div className="col-md-3 col-12 mb-3 mb-md-0">
                              <div
                                style={{
                                  width: "110px",
                                  height: "72px",
                                  overflow: "hidden",
                                  border: "1px solid #ddd",
                                  background: "#f8f8f8",
                                }}
                              >
                                <img
                                  src={
                                    item.image_url || item.image
                                      ? `${HOST}${item.image_url || item.image}`
                                      : "https://via.placeholder.com/110x72?text=Service"
                                  }
                                  alt={item.service_name || item.name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            </div>

                            {/* Service Name + Rating */}
                            <div className="col-md-6 col-12 mb-3 mb-md-0">
                              <div
                                style={{
                                  fontSize: "17px",
                                  fontWeight: "600",
                                  color: "#333",
                                  marginBottom: "6px",
                                }}
                              >
                                {item.service_name || item.name}
                              </div>

                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#333",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                <span style={{ color: "#f4b400" }}>★</span>
                                <span>4.8 Ratings</span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="col-md-3 col-12">
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                }}
                              >
                                <div
                                  style={{
                                    background: "#ecd36c",
                                    padding: "3px 14px",
                                    fontWeight: "700",
                                    fontSize: "18px",
                                    color: "#222",
                                    minWidth: "100px",
                                    textAlign: "center",
                                  }}
                                >
                                  ₹ {item.price}
                                </div>

                                {item.cutPrice || item.cut_price ? (
                                  <div
                                    style={{
                                      marginTop: "8px",
                                      fontSize: "14px",
                                      color: "#999",
                                      textDecoration: "line-through",
                                      paddingLeft: "10px",
                                    }}
                                  >
                                    ₹ {item.cutPrice || item.cut_price}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
