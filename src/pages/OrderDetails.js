import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getUserDetails } from "../redux/actions/authActions";
import { removeFromCart } from "../redux/actions/cartActions";
import { useNavigate, useLocation } from "react-router-dom";
import { HOST } from "../utils/host";
import axios from "axios";

const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function OrderDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector((state) => state.cart.items || []);
  const { user } = useSelector((state) => state.auth || {});

  const buyNow = location.state?.buyNow || false;
  const buyNowItem = location.state?.buyNowItem || null;

  const [flatNo, setFlatNo] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [areaName, setAreaName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);

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

  const clearAddressFields = () => {
    setFlatNo("");
    setBuildingName("");
    setAreaName("");
    setLandmark("");
    setStateName("");
    setCity("");
    setPincode("");
  };

  const fillAddressFields = (address) => {
    setFlatNo(address?.flat_no || "");
    setBuildingName(address?.building_name || "");
    setAreaName(address?.area_name || "");
    setLandmark(address?.landmark || "");
    setStateName(address?.state || "");
    setCity(address?.city || "");
    setPincode(address?.pincode || "");
  };

  const hasRealAddress = (address) => {
    if (!address) return false;

    return Boolean(
      address.flat_no ||
      address.building_name ||
      address.area_name ||
      address.landmark ||
      address.city ||
      address.state ||
      address.pincode,
    );
  };

  const formatAddress = (address) => {
    if (!hasRealAddress(address)) return "";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getUserDetails(token));
    }
  }, [dispatch]);

  const fetchAddress = async () => {
    try {
      setAddressLoading(true);

      const token = localStorage.getItem("token");
      const mobileNumber =
        user?.user_id || localStorage.getItem("mobile_number");

      if (!token || !mobileNumber) {
        setSelectedAddress(null);
        clearAddressFields();
        return;
      }

      const response = await axios.get(`${HOST}/api/getAddress`, {
        headers: {
          Authorization: `Bearer ${token}`,
          mobile_number: mobileNumber,
        },
      });

      const addressData = response?.data?.address || null;

      if (hasRealAddress(addressData)) {
        setSelectedAddress(addressData);
        fillAddressFields(addressData);
      } else {
        setSelectedAddress(null);
        clearAddressFields();
      }
    } catch (error) {
      console.error(
        "Error fetching address:",
        error?.response?.data || error.message,
      );
      setSelectedAddress(null);
      clearAddressFields();
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchAddress();
    }
  }, [user?.user_id]);

  const openAddressModal = () => {
    if (selectedAddress && hasRealAddress(selectedAddress)) {
      fillAddressFields(selectedAddress);
    } else {
      clearAddressFields();
    }
    setShowModal(true);
  };

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
      !flatNo.trim() ||
      !buildingName.trim() ||
      !areaName.trim() ||
      !landmark.trim() ||
      !stateName.trim() ||
      !city.trim() ||
      !pincode.trim()
    ) {
      alert("All fields required");
      return;
    }

    try {
      setAddressSaving(true);

      const token = localStorage.getItem("token");
      const mobileNumber =
        user?.user_id || localStorage.getItem("mobile_number");

      if (!token || !mobileNumber) {
        alert("User not found. Please login again.");
        return;
      }

      const payload = {
        address: {
          flat_no: flatNo.trim(),
          building_name: buildingName.trim(),
          area_name: areaName.trim(),
          landmark: landmark.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
        },
      };

      // Backend editAddress already handles both insert and update
      await axios.put(`${HOST}/api/editAddress`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          mobile_number: mobileNumber,
        },
      });

      await fetchAddress();
      setShowModal(false);
    } catch (error) {
      console.error(
        "Error saving address:",
        error?.response?.data || error.message,
      );
      alert(error?.response?.data?.message || "Failed to save address");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleBookOrder = () => {
    if (orderItems.length === 0) {
      alert("No items found");
      return;
    }

    if (!hasRealAddress(selectedAddress)) {
      alert("Please add address first");
      return;
    }

    navigate("/bookingslot", {
      state: {
        buyNow,
        orderItems,
        subtotal,
        platformFee,
        total,
        selectedAddress,
      },
    });
  };

  return (
    <>
      <Header />

      <div className="container mt-4" style={{ fontFamily: FONT_FAMILY }}>
        <div className="row">
          <div className="col-lg-7 mb-4">
            <div
              className="shadow-sm bg-white"
              style={{ border: "1px solid #ddd" }}
            >
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
                  orderItems.map((item, index) => {
                    const qty = Number(item.qty || item.quantity || 1);
                    const price = Number(item.price || 0);
                    const cutPrice = Math.round(price * 1.2);

                    return (
                      <div
                        key={item.service_id || item.id || index}
                        className="pb-4 mb-4"
                        style={{ borderBottom: "1px solid #ddd" }}
                      >
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <img
                              src={`${HOST}${item.image || item.image_url || ""}`}
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
                                Qty :
                                <span
                                  style={{
                                    fontWeight: "600",
                                    fontSize: "17px",
                                  }}
                                >
                                  {qty}
                                </span>
                              </div>

                              {!buyNow && (
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() =>
                                    dispatch(
                                      removeFromCart(
                                        item.service_id || item.id,
                                      ),
                                    )
                                  }
                                  style={{
                                    borderRadius: "10px",
                                    padding: "8px 12px",
                                    fontSize: "14px",
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

          <div className="col-lg-5 mb-4">
            <div
              className="shadow-sm bg-white p-4"
              style={{ border: "1px solid #ddd" }}
            >
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  {/* LEFT: Address */}
                  <div
                    style={{
                      color: "#555",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      maxWidth: "75%",
                    }}
                  >
                    {addressLoading
                      ? "Loading address..."
                      : formatAddress(selectedAddress) || "No address added"}
                  </div>

                  {/* RIGHT: Button */}
                  <button
                    className="btn btn-sm"
                    onClick={openAddressModal}
                    style={{
                      background: "#f4bf00",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "500",
                      fontSize: "13px",
                      padding: "6px 12px",
                      color: "#111",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {hasRealAddress(selectedAddress) ? "Edit" : "Add"}
                  </button>
                </div>
              </div>

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
                {orderItems.map((item, index) => {
                  const price = Number(item.price || 0);
                  const qty = Number(item.qty || item.quantity || 1);

                  return (
                    <div
                      key={item.service_id || item.id || index}
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
                {hasRealAddress(selectedAddress)
                  ? "Edit Address"
                  : "Add Address"}
              </div>

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

              <div
                className="modal-footer d-flex justify-content-center gap-3"
                style={{ borderTop: "1px solid #eee" }}
              >
                <button
                  className="btn"
                  onClick={handleAddressSave}
                  disabled={addressSaving}
                  style={{
                    background: "#f4bf00",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 22px",
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "#111",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    opacity: addressSaving ? 0.7 : 1,
                  }}
                >
                  {addressSaving ? "Saving..." : "Save"}
                </button>

                <button
                  className="btn"
                  onClick={() => setShowModal(false)}
                  disabled={addressSaving}
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
