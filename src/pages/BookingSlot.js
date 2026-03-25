import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function BookingSlot() {
  const cartItems = useSelector((state) => state.cart.items || []);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("9:00 AM");

  const timeSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

  // ✅ LOAD FROM LOCALSTORAGE (FIX FOR REFRESH)
  useEffect(() => {
    const saved = localStorage.getItem("bookingSlot");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedDate(parsed.date || "");
      setSelectedTime(parsed.time || "9:00 AM");
    }
  }, []);
  // ✅ AUTO SAVE WHEN CHANGE
  useEffect(() => {
    localStorage.setItem(
      "bookingSlot",
      JSON.stringify({
        date: selectedDate,
        time: selectedTime,
      }),
    );
  }, [selectedDate, selectedTime]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.qty || 1);
      return sum + price * qty;
    }, 0);
  }, [cartItems]);

  const platformFee = cartItems.length > 0 ? 100 : 0;
  const total = subtotal + platformFee;

  const handleSave = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }

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
    setSelectedDate("");
    setSelectedTime("");
    localStorage.removeItem("bookingSlot"); // ✅ important
  };

  const handleMakePayment = () => {
    alert("Next step: payment");
  };

  return (
    <>
      <Header />

      <div className="container mt-4 mb-4" style={{ fontFamily: FONT_FAMILY }}>
        <div className="row g-4">
          {/* LEFT */}
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
                {/* Select Date */}
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
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      maxWidth: "260px",
                      height: "46px",
                      borderRadius: "10px",
                      fontSize: "15px",
                    }}
                  />
                </div>

                {/* Select Time */}
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

                    return (
                      <button
                        key={slot}
                        className="btn"
                        onClick={() => setSelectedTime(slot)}
                        style={{
                          minWidth: "90px",
                          border: "1px solid #999",
                          background: isSelected ? "#f4bf00" : "#fff",
                          color: "#111",
                          fontWeight: "600",
                          borderRadius: "8px",
                          padding: "8px 14px",
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

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

          {/* RIGHT */}
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
                  <strong>Date :</strong> {selectedDate || "--/--/----"}
                </div>

                <div style={{ fontSize: "16px" }}>
                  <strong>Time Slot :</strong> {selectedTime || "--"}
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
                  {cartItems.map((item) => {
                    const qty = Number(item.qty || 1);
                    const price = Number(item.price || 0);

                    return (
                      <div
                        key={item.service_id}
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
