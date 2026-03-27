import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "../redux/actions/orderActions";
import { HOST } from "../utils/host";

export default function MyOrderDetails() {
  const dispatch = useDispatch();
  const { orderId } = useParams();

  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const getStatusText = (status) => {
    switch ((status || "").toLowerCase()) {
      case "completed":
        return { text: "Completed", color: "#1ea84a" };
      case "confirmed":
        return { text: "Confirmed", color: "#1ea84a" };
      case "cancelled":
        return { text: "Cancelled", color: "#d93025" };
      case "paid":
        return { text: "Paid", color: "#f4b400" };
      default:
        return { text: status || "Pending", color: "#666" };
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d)) return date;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
  };

  const statusObj = getStatusText(orderDetails?.status);

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
          {loading && (
            <div className="text-center py-5">
              <p>Loading order details...</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-5">
              <p style={{ color: "red" }}>{error}</p>
            </div>
          )}

          {!loading && !error && orderDetails && (
            <div className="row g-4">
              {/* Left Section */}
              <div className="col-md-7">
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #ddd",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      background: "#ecd36c",
                      display: "inline-block",
                      padding: "6px 16px",
                      fontWeight: "600",
                      fontSize: "16px",
                      marginBottom: "14px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    My Order Details
                  </div>

                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      color: "#333",
                    }}
                  >
                    #{orderDetails.order_id}
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#777",
                      marginTop: "2px",
                    }}
                  >
                    {formatDateTime(orderDetails.created_at)}
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                      color: statusObj.color,
                      fontWeight: "600",
                      marginTop: "4px",
                      marginBottom: "8px",
                    }}
                  >
                    ● {statusObj.text}
                  </div>

                  <hr style={{ marginTop: "8px", marginBottom: "10px" }} />

                  {orderDetails.order_items?.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom:
                          index !== orderDetails.order_items.length - 1
                            ? "1px solid #eee"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                        }}
                      >
                        <img
                          src={
                            item.service_image
                              ? `${HOST}${item.service_image}`
                              : "https://via.placeholder.com/90x70?text=Service"
                          }
                          alt={item.service_name}
                          style={{
                            width: "90px",
                            height: "70px",
                            objectFit: "cover",
                            border: "1px solid #ddd",
                          }}
                        />

                        <div>
                          <div
                            style={{
                              fontSize: "17px",
                              fontWeight: "600",
                              color: "#333",
                            }}
                          >
                            {item.service_name}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          background: "#ecd36c",
                          padding: "3px 18px",
                          fontWeight: "700",
                          fontSize: "18px",
                          minWidth: "92px",
                          textAlign: "center",
                        }}
                      >
                        ₹ {item.price}
                      </div>
                    </div>
                  ))}

                  {/* Timeline */}
                  <div
                    style={{
                      border: "1px solid #bdbdbd",
                      borderRadius: "10px",
                      padding: "14px 18px",
                      marginTop: "20px",
                    }}
                  >
                    <div style={{ color: "#1ea84a", marginBottom: "10px" }}>
                      ● Booked
                    </div>
                    <div style={{ color: "#1ea84a", marginBottom: "10px" }}>
                      ● Partner Assigned
                    </div>
                    <div style={{ color: "#1ea84a", marginBottom: "10px" }}>
                      ● Service Started
                    </div>
                    <div style={{ color: "#1ea84a" }}>● Service Completed</div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="col-md-5">
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #ddd",
                    padding: "16px",
                    minHeight: "100%",
                  }}
                >
                  <h5
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      color: "#333",
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "8px",
                      marginBottom: "14px",
                    }}
                  >
                    Customer Details
                  </h5>

                  <div style={{ marginBottom: "18px" }}>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "15px",
                        color: "#333",
                      }}
                    >
                      Customer
                    </div>
                    <div style={{ fontSize: "14px", color: "#666" }}>
                      {orderDetails.user_id}
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "16px",
                        color: "#333",
                        marginBottom: "6px",
                      }}
                    >
                      Address
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        lineHeight: "22px",
                      }}
                    >
                      {orderDetails.address}
                    </div>
                  </div>

                  <hr />

                  <h5
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      color: "#333",
                      marginBottom: "12px",
                    }}
                  >
                    Price Details
                  </h5>

                  <div
                    style={{
                      background: "#f3f3f3",
                      borderRadius: "10px",
                      padding: "14px",
                    }}
                  >
                    {orderDetails.order_items?.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between mb-2"
                        style={{
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        <span>
                          {item.service_name} x {item.quantity}
                        </span>
                        <span>₹ {item.total_price}</span>
                      </div>
                    ))}

                    <div
                      className="d-flex justify-content-between mb-2"
                      style={{
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      <span>Platform Fees</span>
                      <span>₹ 100</span>
                    </div>

                    <div
                      className="d-flex justify-content-between"
                      style={{
                        fontWeight: "700",
                        fontSize: "18px",
                        marginTop: "10px",
                      }}
                    >
                      <span>Total</span>
                      <span>₹ {orderDetails.total_price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
