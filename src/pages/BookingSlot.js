import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../redux/actions/orderActions";

const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function BookingSlot() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);
  const { user } = useSelector((state) => state.auth || {});
  const { loading } = useSelector((state) => state.order || {});

  const navigate = useNavigate();
  const location = useLocation();

  // Available booking time slots shown in UI
  const timeSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

  // Returns today's date in YYYY-MM-DD format for input[type="date"]
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Converts a slot like "5:00 PM" to 24-hour parts for date comparisons
  const convertSlotTo24Hour = (slot) => {
    const [time, modifier] = slot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
  };

  // Converts UI slot like "5:00 PM" to MySQL TIME format "17:00:00"
  // This is only for API/database payload. UI display remains unchanged.
  const convertToMySQLTime = (slot) => {
    if (!slot) return "";

    const [time, modifier] = slot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  };

  // For today's date, auto-select the next available future slot
  // For future dates, return the first slot
  const getNextAvailableSlot = (date) => {
    const todayStr = getTodayDate();

    if (date !== todayStr) return timeSlots[0];

    const now = new Date();

    for (let i = 0; i < timeSlots.length; i++) {
      const { hours, minutes } = convertSlotTo24Hour(timeSlots[i]);
      const slotDate = new Date();
      slotDate.setHours(hours, minutes, 0, 0);

      if (slotDate > now) return timeSlots[i];
    }

    return "";
  };

  const todayDate = getTodayDate();
  const initialSelectedTime = getNextAvailableSlot(todayDate);

  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [selectedTime, setSelectedTime] = useState(initialSelectedTime);
  const [savedDate, setSavedDate] = useState("");
  const [savedTime, setSavedTime] = useState("");

  // Support both cart flow and direct buy now flow
  const buyNowItems = useMemo(() => {
    if (
      Array.isArray(location.state?.orderItems) &&
      location.state.orderItems.length > 0
    ) {
      return location.state.orderItems;
    }

    if (location.state?.buyNowItem) {
      return [location.state.buyNowItem];
    }

    if (location.state?.service) {
      return [location.state.service];
    }

    if (location.state?.item) {
      return [location.state.item];
    }

    return [];
  }, [location.state]);

  const finalItems = useMemo(() => {
    return cartItems.length > 0 ? cartItems : buyNowItems;
  }, [cartItems, buyNowItems]);

  // Calculate subtotal from final items
  const subtotal = useMemo(() => {
    return finalItems.reduce((sum, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.qty || item.quantity || 1);
      return sum + price * qty;
    }, 0);
  }, [finalItems]);

  const platformFee = finalItems.length > 0 ? 100 : 0;
  const total = subtotal + platformFee;

  // Disable past slots only for today
  const isSlotDisabled = (slot) => {
    const todayStr = getTodayDate();
    if (selectedDate !== todayStr) return false;

    const now = new Date();
    const { hours, minutes } = convertSlotTo24Hour(slot);
    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0, 0);

    return slotDate <= now;
  };

  // When date changes, auto-pick next valid slot for that date
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setSelectedTime(getNextAvailableSlot(newDate));
  };

  // Save selected slot to state + localStorage for current booking flow
  const handleSave = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    setSavedDate(selectedDate);
    setSavedTime(selectedTime);

    localStorage.setItem(
      "bookingSlot",
      JSON.stringify({
        date: selectedDate,
        time: selectedTime,
      }),
    );

    alert("Booking slot saved");
  };

  // Reset booking slot selection and clear related temporary localStorage data
  const handleCancel = () => {
    const resetDate = getTodayDate();
    const resetTime = getNextAvailableSlot(resetDate);

    setSelectedDate(resetDate);
    setSelectedTime(resetTime);
    setSavedDate("");
    setSavedTime("");

    localStorage.removeItem("bookingSlot");
    localStorage.removeItem("latestOrderMeta");
  };

  // Converts selected address object into a single backend-friendly string
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

  // Read already-created pending order meta from localStorage
  const getStoredLatestOrderMeta = () => {
    try {
      const raw = localStorage.getItem("latestOrderMeta");
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error("Failed to parse latestOrderMeta:", error);
      return null;
    }
  };

  // Get existing pending order id if already created earlier in same flow
  const getExistingPendingOrderId = () => {
    const stateOrderId =
      location.state?.orderId || location.state?.pendingOrderId;
    if (stateOrderId) return stateOrderId;

    const latestOrderMeta = getStoredLatestOrderMeta();
    if (latestOrderMeta?.orderId) return latestOrderMeta.orderId;

    return null;
  };

  // Creates order before navigating to payment page
  const handleMakePayment = async () => {
    if (!savedDate || !savedTime) {
      alert("Please save date and time slot first");
      return;
    }

    const selectedAddress = location.state?.selectedAddress || null;

    if (!selectedAddress) {
      alert("Please select address first");
      return;
    }

    if (!finalItems.length) {
      alert("No items found for booking");
      return;
    }

    try {
      const mysqlServiceTime = convertToMySQLTime(savedTime);

      if (!mysqlServiceTime) {
        alert("Invalid time slot selected");
        return;
      }

      const existingOrderId = getExistingPendingOrderId();

      const payload = {
        ...(existingOrderId && { order_id: existingOrderId }),
        address: formatAddress(selectedAddress),
        total_price: Number(total),
        service_date: savedDate,
        service_time: mysqlServiceTime,
        cart_items: finalItems.map((item) => ({
          service_id: item.service_id || item.id,
          quantity: Number(item.qty || item.quantity || 1),
          price: Number(item.price || 0),
        })),
      };

      console.log("existing pending order id:", existingOrderId);
      console.log("createOrder payload:", payload);

      const response = await dispatch(createOrder(payload));

      console.log("createOrder response:", response);

      if (!response?.order_id) {
        alert("Order creation failed");
        return;
      }

      const latestOrderMeta = {
        orderId: response.order_id || existingOrderId || null,
        razorpayOrderId: response.razorpay_order_id || null,
      };

      localStorage.setItem("latestOrderMeta", JSON.stringify(latestOrderMeta));
      console.log("saved latestOrderMeta:", latestOrderMeta);

      navigate("/payment-method", {
        state: {
          orderId: response.order_id || existingOrderId,
          razorpayOrderId: response.razorpay_order_id || null,
          bookingDate: savedDate,
          bookingTime: savedTime,
          orderItems: finalItems,
          subtotal,
          platformFee,
          total,
          selectedAddress,
          userName: user?.name || "User",
          user_id: user?.user_id || "",
          isBuyNow: cartItems.length === 0,
        },
      });
    } catch (error) {
      console.error(
        "Create order error:",
        error?.response?.data || error.message,
      );
      alert(error?.response?.data?.error || "Failed to create order");
    }
  };

  return (
    <>
      <Header />
      <div className="header-spacing"></div>
      <div
        className="container mb-4"
        style={{
          fontFamily: FONT_FAMILY,
          marginTop: "40px",
        }}
      >
        <div className="row g-4">
          <div className="col-lg-7">
            <div
              className="bg-white shadow-sm"
              style={{ border: "1px solid #ddd" }}
            >
              <div
                style={{
                  background: "#efd36d",
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                Book Date and Time Slot
              </div>

              <div className="p-4">
                <h3
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#555",
                    marginBottom: "16px",
                  }}
                >
                  Select Date
                </h3>

                <div className="d-flex justify-content-center mb-4">
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    min={todayDate}
                    onChange={handleDateChange}
                    style={{
                      maxWidth: "260px",
                      height: "46px",
                      borderRadius: "10px",
                      fontSize: "15px",
                    }}
                  />
                </div>

                <h3
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#555",
                    marginBottom: "16px",
                  }}
                >
                  Select Time
                </h3>

                <hr />

                <div className="d-flex flex-wrap gap-4 justify-content-center mt-4">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTime === slot;
                    const disabled = isSlotDisabled(slot);

                    return (
                      <button
                        key={slot}
                        className="btn"
                        onClick={() => !disabled && setSelectedTime(slot)}
                        disabled={disabled}
                        style={{
                          minWidth: "90px",
                          border: "1px solid #999",
                          background: disabled
                            ? "#e9ecef"
                            : isSelected
                              ? "#f4bf00"
                              : "#fff",
                          color: disabled ? "#999" : "#111",
                          fontWeight: "600",
                          borderRadius: "8px",
                          padding: "8px 14px",
                          cursor: disabled ? "not-allowed" : "pointer",
                          opacity: disabled ? 0.7 : 1,
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                {!selectedTime && (
                  <p
                    className="text-center mt-3 mb-0"
                    style={{ color: "red", fontWeight: "500" }}
                  >
                    No time slots available for today. Please select another
                    date.
                  </p>
                )}

                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mt-5">
                  <button
                    className="btn w-100 w-sm-auto"
                    onClick={handleCancel}
                    style={{
                      minWidth: "160px",
                      background: "#ddd",
                      color: "#333",
                      borderRadius: "10px",
                      fontWeight: "600",
                      padding: "10px 20px",
                      border: "none",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn w-100 w-sm-auto"
                    onClick={handleSave}
                    style={{
                      minWidth: "160px",
                      background: "#f4bf00",
                      color: "#111",
                      borderRadius: "10px",
                      fontWeight: "600",
                      padding: "10px 20px",
                      border: "none",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div
              className="bg-white shadow-sm p-3"
              style={{ border: "1px solid #ddd" }}
            >
              <div
                style={{
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "14px",
                  marginBottom: "18px",
                }}
              >
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  Booked Date and Time
                </h4>

                <div style={{ fontSize: "16px", marginBottom: "10px" }}>
                  <strong>Date :</strong>{" "}
                  {savedDate || selectedDate || "--/--/----"}
                </div>

                <div style={{ fontSize: "16px" }}>
                  <strong>Time Slot :</strong>{" "}
                  {savedTime || selectedTime || "--"}
                </div>
              </div>

              <div>
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "14px",
                  }}
                >
                  Price Details
                </h4>

                <div
                  style={{
                    background: "#f3f3f3",
                    borderRadius: "14px",
                    padding: "16px",
                    marginBottom: "24px",
                  }}
                >
                  {finalItems.map((item, index) => {
                    const qty = Number(item.qty || item.quantity || 1);
                    const price = Number(item.price || 0);

                    return (
                      <div
                        key={item.service_id || item.id || index}
                        className="d-flex justify-content-between mb-2"
                        style={{ fontSize: "15px", color: "#666" }}
                      >
                        <span>
                          {item.name} x {qty}
                        </span>
                        <span>₹ {price * qty}</span>
                      </div>
                    );
                  })}

                  <div
                    className="d-flex justify-content-between mb-2"
                    style={{ fontSize: "15px", color: "#666" }}
                  >
                    <span>Tax</span>
                    <span>₹ {platformFee}</span>
                  </div>

                  <hr />

                  <div
                    className="d-flex justify-content-between"
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#111",
                    }}
                  >
                    <span>Total</span>
                    <span>₹ {total}</span>
                  </div>
                </div>

                <button
                  className="btn d-block mx-auto"
                  onClick={handleMakePayment}
                  disabled={loading}
                  style={{
                    background: "green",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0",
                    fontWeight: "600",
                    fontSize: "18px",
                    padding: "10px 24px",
                    minWidth: "180px",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Please wait..." : "Make Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
