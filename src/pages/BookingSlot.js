import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function BookingSlot() {
  const cartItems = useSelector((state) => state.cart.items || []);
  const { user } = useSelector((state) => state.auth || {});

  const navigate = useNavigate();
  const location = useLocation();

  const timeSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const convertSlotTo24Hour = (slot) => {
    const [time, modifier] = slot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
  };

  const getNextAvailableSlot = (date) => {
    const todayStr = getTodayDate();

    if (date !== todayStr) {
      return timeSlots[0];
    }

    const now = new Date();

    for (let i = 0; i < timeSlots.length; i++) {
      const { hours, minutes } = convertSlotTo24Hour(timeSlots[i]);
      const slotDate = new Date();
      slotDate.setHours(hours, minutes, 0, 0);

      if (slotDate > now) {
        return timeSlots[i];
      }
    }

    return "";
  };

  const todayDate = getTodayDate();
  const initialSelectedTime = getNextAvailableSlot(todayDate);

  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [selectedTime, setSelectedTime] = useState(initialSelectedTime);

  const [savedDate, setSavedDate] = useState("");
  const [savedTime, setSavedTime] = useState("");

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.qty || 1);
      return sum + price * qty;
    }, 0);
  }, [cartItems]);

  const platformFee = cartItems.length > 0 ? 100 : 0;
  const total = subtotal + platformFee;

  const isSlotDisabled = (slot) => {
    const todayStr = getTodayDate();

    if (selectedDate !== todayStr) return false;

    const now = new Date();
    const { hours, minutes } = convertSlotTo24Hour(slot);

    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0, 0);

    return slotDate <= now;
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    const nextSlot = getNextAvailableSlot(newDate);
    setSelectedTime(nextSlot);
  };

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

  const handleCancel = () => {
    const resetDate = getTodayDate();
    const resetTime = getNextAvailableSlot(resetDate);

    setSelectedDate(resetDate);
    setSelectedTime(resetTime);
    setSavedDate("");
    setSavedTime("");
    localStorage.removeItem("bookingSlot");
  };

  const handleMakePayment = () => {
    if (!savedDate || !savedTime) {
      alert("Please save date and time slot first");
      return;
    }

    navigate("/payment-method", {
      state: {
        bookingDate: savedDate,
        bookingTime: savedTime,
        orderItems: cartItems,
        subtotal,
        platformFee,
        total,
        selectedAddress: location.state?.selectedAddress || null,

        // ✅ pass current user details like address
        userName: user?.name || "User",
        user_id: user?.user_id || "-",
      },
    });
  };

  return (
    <>
      <Header />

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
              style={{
                border: "1px solid #ddd",
              }}
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

                <div className="d-flex justify-content-center gap-4 mt-5">
                  <button
                    className="btn"
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
                    className="btn"
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
              style={{
                border: "1px solid #ddd",
              }}
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
                  {cartItems.map((item, index) => {
                    const qty = Number(item.qty || 1);
                    const price = Number(item.price || 0);

                    return (
                      <div
                        key={item.service_id || index}
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
                    <span>Platform Fees</span>
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
                  style={{
                    background: "green",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0",
                    fontWeight: "600",
                    fontSize: "18px",
                    padding: "10px 24px",
                    minWidth: "180px",
                  }}
                >
                  Make Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
