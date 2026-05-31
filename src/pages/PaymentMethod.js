import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOrderStatus,
  getOrderDetails,
} from "../redux/actions/orderActions";
import { clearCart } from "../redux/actions/cartActions";
import { getUserDetails } from "../redux/actions/authActions";
import { BRAND_NAME, CURRENCY, DESCRIPTION, RAZORPAY_KEY } from "../utils/host";

const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function PaymentMethod() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, orderDetails, order } = useSelector(
    (state) => state.order || {},
  );
  const { user } = useSelector((state) => state.auth || {});

  const {
    orderId,
    razorpayOrderId: passedRazorpayOrderId,
    bookingDate,
    bookingTime,
    orderItems = [],
    subtotal = 0,
    platformFee = 0,
    total = 0,
    selectedAddress = null,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [fetchingRazorpayId, setFetchingRazorpayId] = useState(false);

  const formatAddress = (address) => {
    if (!address) return "";

    return [
      address.flat_no,
      address.building_name,
      address.area_name,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  // user details fetch
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user?.user_id) {
      dispatch(getUserDetails(token));
    }
  }, [dispatch, user?.user_id]);

  // localStorage fallback
  const latestOrderMeta = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("latestOrderMeta") || "{}");
    } catch {
      return {};
    }
  }, []);

  // DB fetch only if needed
  useEffect(() => {
    const fetchOrderDetailsIfNeeded = async () => {
      if (!orderId) return;
      if (passedRazorpayOrderId) return;
      if (
        latestOrderMeta?.orderId === orderId &&
        latestOrderMeta?.razorpayOrderId
      ) {
        return;
      }

      try {
        setFetchingRazorpayId(true);
        await dispatch(getOrderDetails(orderId));
      } catch (error) {
        console.error(
          "Failed to fetch order details:",
          error?.response?.data || error.message,
        );
      } finally {
        setFetchingRazorpayId(false);
      }
    };

    fetchOrderDetailsIfNeeded();
  }, [dispatch, orderId, passedRazorpayOrderId, latestOrderMeta]);

  // final effective razorpay id
  const effectiveRazorpayOrderId = useMemo(() => {
    return (
      passedRazorpayOrderId ||
      (latestOrderMeta?.orderId === orderId
        ? latestOrderMeta?.razorpayOrderId
        : null) ||
      order?.razorpay_order_id ||
      orderDetails?.razorpay_order_id ||
      orderDetails?.order?.razorpay_order_id ||
      orderDetails?.order_details?.razorpay_order_id ||
      null
    );
  }, [passedRazorpayOrderId, latestOrderMeta, orderId, order, orderDetails]);

  useEffect(() => {
    console.log("PaymentMethod state:", location.state);
    console.log("latestOrderMeta:", latestOrderMeta);
    console.log("redux order:", order);
    console.log("orderDetails from DB:", orderDetails);
    console.log("effectiveRazorpayOrderId:", effectiveRazorpayOrderId);
    console.log("auth user:", user);
  }, [
    location.state,
    latestOrderMeta,
    order,
    orderDetails,
    effectiveRazorpayOrderId,
    user,
  ]);

  const handleCODConfirm = async () => {
    const updatePayload = {
      order_id: orderId,
      payment_method: "COD",
      order_status: "confirmed",
      payment_status: "pending",
    };

    console.log("COD updateOrderStatus payload:", updatePayload);

    const updateResponse = await dispatch(updateOrderStatus(updatePayload));

    console.log("COD updateOrderStatus response:", updateResponse);

    dispatch(clearCart());
    localStorage.removeItem("latestOrderMeta");

    navigate("/order-confirmed", {
      state: {
        orderId,
        paymentId: updateResponse?.payment_id || null,
        paymentMethod: "COD",
        bookingDate,
        bookingTime,
        orderItems,
        subtotal,
        platformFee,
        total,
        selectedAddress,
      },
    });
  };

  const handleOnlinePayment = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    if (!RAZORPAY_KEY) {
      alert("Razorpay key is missing");
      return;
    }

    if (!effectiveRazorpayOrderId) {
      alert("Razorpay order id missing");
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: Number(total) * 100,
      currency: CURRENCY,
      name: BRAND_NAME,
      description: DESCRIPTION,
      order_id: effectiveRazorpayOrderId,
      handler: async function (res) {
        try {
          const updatePayload = {
            order_id: orderId,
            payment_method: "ONLINE",
            order_status: "confirmed",
            payment_status: "paid",
            payment_id: res?.razorpay_payment_id,
            razorpay_order_id: res?.razorpay_order_id,
            razorpay_payment_id: res?.razorpay_payment_id,
            razorpay_signature: res?.razorpay_signature,
          };

          console.log("ONLINE updateOrderStatus payload:", updatePayload);

          const updateResponse = await dispatch(
            updateOrderStatus(updatePayload),
          );

          console.log("ONLINE updateOrderStatus response:", updateResponse);

          dispatch(clearCart());
          localStorage.removeItem("latestOrderMeta");

          navigate("/order-confirmed", {
            state: {
              orderId,
              paymentId:
                res?.razorpay_payment_id || updateResponse?.payment_id || null,
              paymentMethod: "ONLINE",
              bookingDate,
              bookingTime,
              orderItems,
              subtotal,
              platformFee,
              total,
              selectedAddress,
            },
          });
        } catch (error) {
          console.error(
            "Online payment update error:",
            error?.response?.data || error.message,
          );
          alert(
            error?.response?.data?.error ||
              "Payment was successful, but order update failed",
          );
        }
      },
      prefill: {
        name: user?.name || "",
        contact: user?.user_id || user?.mobile_number || "",
      },
      theme: { color: "#f4bf00" },
      modal: {
        ondismiss: function () {
          console.log("Razorpay payment popup closed");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Razorpay payment failed:", response);
      alert("Payment failed. Please try again.");
    });

    rzp.open();
  };

  const handleContinue = async () => {
    if (!orderId) {
      alert("Order id missing. Please create order first.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    if (!bookingDate || !bookingTime) {
      alert("Booking date and time missing");
      return;
    }

    if (!selectedAddress) {
      alert("Address missing");
      return;
    }

    if (!orderItems.length) {
      alert("No items found");
      return;
    }

    if (paymentMethod === "ONLINE" && fetchingRazorpayId) {
      alert("Please wait, fetching Razorpay order id...");
      return;
    }

    try {
      if (paymentMethod === "COD") {
        await handleCODConfirm();
        return;
      }

      if (paymentMethod === "ONLINE") {
        await handleOnlinePayment();
        return;
      }
    } catch (error) {
      console.error(
        "Payment method flow error:",
        error?.response?.data || error.message,
      );
      alert(error?.response?.data?.error || "Failed to process payment method");
    }
  };

  return (
    <>
      <Header />
      <div className="header-spacing"></div>
      <div className="container mt-4 mb-4" style={{ fontFamily: FONT_FAMILY }}>
        <div className="row g-4">
          <div className="col-lg-7">
            <div
              className="bg-white shadow-sm p-4"
              style={{ border: "1px solid #ddd" }}
            >
              <h3
                style={{
                  fontWeight: "600",
                  fontSize: "22px",
                  marginBottom: "20px",
                }}
              >
                Select Payment Method
              </h3>

              <div className="mb-4">
                <div
                  className="p-3 mb-3"
                  style={{
                    border:
                      paymentMethod === "COD"
                        ? "2px solid #f4bf00"
                        : "1px solid #ddd",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="me-2"
                  />
                  <strong>Cash on Delivery</strong>
                </div>

                {/* <div
                  className="p-3"
                  style={{
                    border:
                      paymentMethod === "ONLINE"
                        ? "2px solid #f4bf00"
                        : "1px solid #ddd",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setPaymentMethod("ONLINE")}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "ONLINE"}
                    onChange={() => setPaymentMethod("ONLINE")}
                    className="me-2"
                  />
                  <strong>Online Payment</strong>
                </div> */}
              </div>

              <div
                className="p-3"
                style={{
                  background: "#fafafa",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                }}
              >
                <h5 style={{ fontWeight: "600", marginBottom: "14px" }}>
                  Booking Summary
                </h5>

                <p className="mb-2">
                  <strong>Customer Name:</strong> {user?.name || "--"}
                </p>

                <p className="mb-2">
                  <strong>Mobile:</strong>{" "}
                  {user?.user_id || user?.mobile_number || "--"}
                </p>

                <p className="mb-2">
                  <strong>Order ID:</strong> {orderId || "--"}
                </p>

                {/* <p className="mb-2">
                  <strong>Razorpay Order ID:</strong>{" "}
                  {effectiveRazorpayOrderId || "--"}
                </p> */}

                <p className="mb-2">
                  <strong>Date:</strong> {bookingDate || "--"}
                </p>

                <p className="mb-2">
                  <strong>Time:</strong> {bookingTime || "--"}
                </p>

                <p className="mb-0">
                  <strong>Address:</strong>{" "}
                  {formatAddress(selectedAddress) || "No address added"}
                </p>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button
                  className="btn"
                  onClick={() => navigate(-1)}
                  style={{
                    minWidth: "140px",
                    background: "#ddd",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontWeight: "600",
                  }}
                >
                  Back
                </button>

                <button
                  className="btn"
                  onClick={handleContinue}
                  disabled={loading || fetchingRazorpayId}
                  style={{
                    minWidth: "140px",
                    background: "#008000",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontWeight: "600",
                    color: "#fff",
                    opacity: loading || fetchingRazorpayId ? 0.7 : 1,
                  }}
                >
                  {loading || fetchingRazorpayId ? "Please wait..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div
              className="bg-white shadow-sm p-4"
              style={{ border: "1px solid #ddd" }}
            >
              <h4 style={{ fontWeight: "600", marginBottom: "16px" }}>
                Price Details
              </h4>

              <div
                style={{
                  background: "#f3f3f3",
                  borderRadius: "14px",
                  padding: "16px",
                }}
              >
                {orderItems.map((item, index) => {
                  const qty = Number(item.qty || item.quantity || 1);
                  const price = Number(item.price || 0);

                  return (
                    <div
                      key={item.service_id || item.id || index}
                      className="d-flex justify-content-between mb-2"
                    >
                      <span>
                        {item.name} x {qty}
                      </span>
                      <span>₹ {price * qty}</span>
                    </div>
                  );
                })}

                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span>₹ {platformFee}</span>
                </div>

                <hr />

                <div
                  className="d-flex justify-content-between"
                  style={{ fontWeight: "700", fontSize: "18px" }}
                >
                  <span>Total</span>
                  <span>₹ {total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
