import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {
  getUserDetails,
  updateUserProfile,
} from "../redux/actions/authActions";
import { removeFromCart } from "../redux/actions/cartActions";
import { useNavigate, useLocation } from "react-router-dom";
import { HOST } from "../utils/host";

// ADDED: typography constant for whole page
const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function OrderDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector((state) => state.cart.items || []);
  const { user } = useSelector((state) => state.auth);

  const buyNow = location.state?.buyNow || false;
  const buyNowItem = location.state?.buyNowItem || null;

  // ✅ Final items source
  const orderItems = useMemo(() => {
    if (buyNow && buyNowItem) {
      return [
        {
          ...buyNowItem,
          qty: Number(buyNowItem.qty || buyNowItem.quantity || 1),
          quantity: Number(buyNowItem.quantity || buyNowItem.qty || 1),
        },
      ];
    }
    return cartItems;
  }, [buyNow, buyNowItem, cartItems]);

  // ADDED States for all address fields
  const [flatNo, setFlatNo] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [areaName, setAreaName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editUserId, setEditUserId] = useState("");
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    if (user?.address) {
      const addr = Array.isArray(user.address) ? user.address[0] : user.address;

      setFlatNo(addr?.flat_no || "");
      setBuildingName(addr?.building_name || "");
      setAreaName(addr?.area_name || "");
      setLandmark(addr?.landmark || "");
      setStateName(addr?.state || "");
      setCity(addr?.city || "");
      setPincode(addr?.pincode || "");
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(getUserDetails(token));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditGender(user.gender || "");
      setEditUserId(user.user_id || "");
      setNewAddress(formatAddress(user.address));
    }
  }, [user]);

  function formatAddress(address) {
    if (!address) return "";

    if (typeof address === "string") return address;

    if (Array.isArray(address)) {
      return address
        .map((addr) =>
          [
            addr.flat_no,
            addr.building_name,
            addr.area_name,
            addr.landmark,
            addr.city,
            addr.state,
            addr.pincode,
          ]
            .filter(Boolean)
            .join(", "),
        )
        .join(" | ");
    }

    if (typeof address === "object") {
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
    }

    return "";
  }

  const subtotal = useMemo(() => {
    return orderItems.reduce((sum, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.qty || item.quantity || 1);
      return sum + price * qty;
    }, 0);
  }, [orderItems]);

  const platformFee = orderItems.length > 0 ? 100 : 0;
  const total = subtotal + platformFee;

  const handleAddressSave = async () => {
    if (
      !flatNo ||
      !buildingName ||
      !areaName ||
      !landmark ||
      !stateName ||
      !city ||
      !pincode
    ) {
      alert("All fields required");
      return;
    }

    await dispatch(
      updateUserProfile({
        name: editName,
        gender: editGender,
        user_id: editUserId,
        address: {
          flat_no: flatNo,
          building_name: buildingName,
          area_name: areaName,
          landmark,
          state: stateName,
          city,
          pincode,
        },
      }),
    );

    const token = localStorage.getItem("token");
    if (token) {
      await dispatch(getUserDetails(token));
    }

    setShowModal(false);
  };

  const handleBookOrder = () => {
    if (orderItems.length === 0) {
      alert("No items found");
      return;
    }

    navigate("/bookingslot", {
      state: {
        buyNow,
        orderItems,
        subtotal,
        platformFee,
        total,
      },
    });
  };

  return (
    <>
      <Header />

      <div
        className="container mt-4"
        style={{
          fontFamily: FONT_FAMILY,
        }}
      >
        <div className="row">
          {/* LEFT SECTION */}
          <div className="col-lg-7 mb-4">
            <div
              className="shadow-sm bg-white"
              style={{ border: "1px solid #ddd" }}
            >
              {/* Header */}
              <div
                style={{
                  background: "#efd36d",
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "18px",
                  letterSpacing: "0.4px",
                  color: "#1e1e1e",
                }}
              >
                Order Details
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <h4
                    style={{
                      fontWeight: "600",
                      fontSize: "20px",
                      marginBottom: "4px",
                      color: "#1f1f1f",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {buyNow ? "#BUY-NOW" : "#ORD1234"}
                  </h4>

                  <div
                    style={{
                      color: "#777",
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                  >
                    {new Date().toLocaleString()}
                  </div>
                </div>

                <hr />

                {orderItems.length === 0 ? (
                  <div
                    className="text-center py-4"
                    style={{
                      fontSize: "15px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    No items found
                  </div>
                ) : (
                  orderItems.map((item) => {
                    const qty = Number(item.qty || item.quantity || 1);
                    const price = Number(item.price || 0);
                    const cutPrice = Math.round(price * 1.2);

                    return (
                      <div
                        key={item.service_id}
                        className="pb-4 mb-4"
                        style={{ borderBottom: "1px solid #ddd" }}
                      >
                        <div className="row align-items-center">
                          {/* Image */}
                          <div className="col-md-5">
                            <img
                              src={`${HOST}${item.image || item.image_url}`}
                              alt={item.name}
                              style={{
                                width: "100%",
                                maxWidth: "220px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                            />
                          </div>

                          {/* Details */}
                          <div className="col-md-7">
                            <h2
                              style={{
                                fontWeight: "600",
                                fontSize: "22px",
                                marginBottom: "8px",
                                color: "#1f1f1f",
                                lineHeight: "1.25",
                              }}
                            >
                              {item.name}
                            </h2>

                            <div
                              style={{
                                marginBottom: "10px",
                                fontSize: "15px",
                                fontWeight: "500",
                                color: "#444",
                                lineHeight: "1.4",
                              }}
                            >
                              <span
                                style={{ color: "#f4b400", marginRight: "6px" }}
                              >
                                ★
                              </span>
                              4.8 Ratings
                            </div>

                            <div className="d-flex align-items-center gap-3 mb-3">
                              <div
                                style={{
                                  background: "#f3d46a",
                                  padding: "6px 14px",
                                  fontWeight: "600",
                                  fontSize: "16px",
                                  borderRadius: "4px",
                                  color: "#1f1f1f",
                                }}
                              >
                                ₹ {price}
                              </div>

                              <div
                                style={{
                                  color: "#999",
                                  textDecoration: "line-through",
                                  fontSize: "14px",
                                  fontWeight: "400",
                                }}
                              >
                                ₹ {cutPrice}
                              </div>
                            </div>

                            <div className="d-flex gap-4 align-items-center">
                              {/* Qty box */}
                              <div
                                style={{
                                  background: "#fff7cc",
                                  padding: "6px 14px",
                                  fontWeight: "500",
                                  fontSize: "14px",
                                  color: "#333",
                                  borderRadius: "5px",
                                  border: "1px solid #f4bf00",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "4px",
                                  minWidth: "85px",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                }}
                              >
                                Qty :{" "}
                                <span
                                  style={{
                                    fontWeight: "600",
                                    fontSize: "17px",
                                  }}
                                >
                                  {qty}
                                </span>
                              </div>

                              {/* Remove button only for cart mode */}
                              {!buyNow && (
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() =>
                                    dispatch(removeFromCart(item.service_id))
                                  }
                                  style={{
                                    borderRadius: "0",
                                    padding: "10px 18px",
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    fontFamily: FONT_FAMILY,
                                  }}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-lg-5 mb-4">
            <div
              className="shadow-sm bg-white p-4"
              style={{ border: "1px solid #ddd" }}
            >
              {/* Customer Details */}
              <h3
                style={{
                  fontWeight: "600",
                  fontSize: "20px",
                  marginBottom: "18px",
                  color: "#1a1a1a",
                  lineHeight: "1.3",
                }}
              >
                Customer Details
              </h3>
              <hr />

              <div
                style={{
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "20px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "17px",
                    color: "#222",
                    lineHeight: "1.4",
                  }}
                >
                  {user?.name || "User Name"}
                </div>

                <div
                  style={{
                    color: "#777",
                    marginTop: "4px",
                    fontSize: "14px",
                    fontWeight: "400",
                    lineHeight: "1.5",
                  }}
                >
                  {user?.user_id || ""}
                </div>

                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    marginTop: "14px",
                    marginBottom: "10px",
                    color: "#222",
                    lineHeight: "1.4",
                  }}
                >
                  Address
                </div>

                <div
                  style={{
                    color: "#555",
                    marginBottom: "16px",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  {formatAddress(user?.address) || "No address added"}
                </div>
                <button
                  className="btn w-100"
                  onClick={() => setShowModal(true)}
                  style={{
                    background: "#f4bf00",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                    fontSize: "17px",
                    padding: "10px",
                    color: "#111",
                  }}
                >
                  {formatAddress(user?.address)
                    ? "Edit Address"
                    : "Add Address"}
                </button>
              </div>

              {/* Price Details */}
              <h3
                style={{
                  fontWeight: "600",
                  fontSize: "20px",
                  marginBottom: "16px",
                  color: "#1a1a1a",
                  lineHeight: "1.3",
                }}
              >
                Price Details
              </h3>

              <div
                style={{
                  background: "#f3f3f3",
                  borderRadius: "16px",
                  padding: "18px",
                  marginBottom: "26px",
                }}
              >
                {orderItems.map((item) => {
                  const price = Number(item.price || 0);
                  const qty = Number(item.qty || item.quantity || 1);

                  return (
                    <div
                      key={item.service_id}
                      className="d-flex justify-content-between mb-2"
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        fontWeight: "400",
                        lineHeight: "1.6",
                      }}
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
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    fontWeight: "400",
                    lineHeight: "1.6",
                  }}
                >
                  <span>Platform Fees</span>
                  <span>₹ {platformFee}</span>
                </div>

                <hr />

                <div
                  className="d-flex justify-content-between"
                  style={{
                    fontWeight: "600",
                    fontSize: "18px",
                    color: "#111",
                    lineHeight: "1.4",
                  }}
                >
                  <span>Total</span>
                  <span>₹ {total}</span>
                </div>
              </div>

              <button
                className="btn d-block mx-auto"
                onClick={handleBookOrder}
                disabled={orderItems.length === 0}
                style={{
                  background: "green",
                  border: "none",
                  borderRadius: "0",
                  fontWeight: "600",
                  fontSize: "18px",
                  padding: "12px 28px",
                  color: "#fff",
                  minWidth: "200px",
                  fontFamily: FONT_FAMILY,
                  letterSpacing: "0.2px",
                }}
              >
                Book Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                fontFamily: FONT_FAMILY,
                borderRadius: "6px",
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  background: "#efd36d",
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "16px",
                  letterSpacing: "0.3px",
                }}
              >
                Edit Address
              </div>

              {/* BODY */}
              <div className="modal-body px-4 py-3">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small">
                      Flat No. / Room No
                    </label>
                    <input
                      className="form-control"
                      value={flatNo}
                      onChange={(e) => setFlatNo(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small">Building Name</label>
                    <input
                      className="form-control"
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small">Area Name</label>
                    <input
                      className="form-control"
                      value={areaName}
                      onChange={(e) => setAreaName(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small">Landmark</label>
                    <input
                      className="form-control"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small">State</label>
                    <input
                      className="form-control"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label small">City</label>
                    <input
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label small">Pincode</label>
                    <input
                      className="form-control"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div
                className="modal-footer d-flex justify-content-center gap-3"
                style={{ borderTop: "1px solid #eee" }}
              >
                <button
                  className="btn"
                  onClick={handleAddressSave}
                  style={{
                    background: "#f4bf00",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 22px",
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "#111",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  Save
                </button>

                <button
                  className="btn"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "8px 22px",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
