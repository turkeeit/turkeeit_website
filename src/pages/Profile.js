import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  getUserDetails,
  updateUserProfile,
} from "../redux/actions/authActions";
import axios from "axios";
import { HOST } from "../utils/host";

const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

const maleIcon = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
const femaleIcon = "https://cdn-icons-png.flaticon.com/512/4140/4140047.png";
const defaultIcon = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});

  const [mobileNumber, setMobileNumber] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState("");

  const [flatNo, setFlatNo] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [areaName, setAreaName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [addressLoading, setAddressLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !user?.user_id) {
      dispatch(getUserDetails(token));
    }
  }, [dispatch, user?.user_id]);

  useEffect(() => {
    setEditName(user?.name || "");
    setEditGender(user?.gender || "");
    setMobileNumber(
      user?.user_id || localStorage.getItem("mobile_number") || "",
    );
  }, [user]);

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

  const hasRealAddress = () => {
    return Boolean(
      flatNo ||
      buildingName ||
      areaName ||
      landmark ||
      city ||
      stateName ||
      pincode,
    );
  };

  const formatAddress = () => {
    if (!hasRealAddress()) return "";

    return [flatNo, buildingName, areaName, landmark, city, stateName, pincode]
      .filter(Boolean)
      .join(", ");
  };

  const getProfileImage = () => {
    const gender = (editGender || user?.gender || "").toLowerCase();

    if (gender === "male") return maleIcon;
    if (gender === "female") return femaleIcon;
    return defaultIcon;
  };

  const fetchAddress = async () => {
    try {
      setAddressLoading(true);

      const token = localStorage.getItem("token");
      const mobile =
        user?.user_id || localStorage.getItem("mobile_number") || "";

      if (!token || !mobile) {
        clearAddressFields();
        return;
      }

      const response = await axios.get(`${HOST}/api/getAddress`, {
        headers: {
          Authorization: `Bearer ${token}`,
          mobile_number: mobile,
        },
      });

      const addressData = response?.data?.address || null;

      if (addressData) {
        fillAddressFields(addressData);
      } else {
        clearAddressFields();
      }
    } catch (error) {
      console.error(
        "Error fetching address:",
        error?.response?.data || error.message,
      );
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

  const handleSave = async () => {
    if (!editName.trim()) {
      alert("Name is required");
      return;
    }

    if (
      !flatNo.trim() ||
      !buildingName.trim() ||
      !areaName.trim() ||
      !landmark.trim() ||
      !stateName.trim() ||
      !city.trim() ||
      !pincode.trim()
    ) {
      alert("All address fields are required");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");
      const mobile =
        user?.user_id || localStorage.getItem("mobile_number") || "";

      if (!token || !mobile) {
        alert("User not found. Please login again.");
        return;
      }

      await dispatch(
        updateUserProfile({
          name: editName.trim(),
          gender: editGender,
        }),
      );

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

      await axios.put(`${HOST}/api/editAddress`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          mobile_number: mobile,
        },
      });

      await dispatch(getUserDetails(token));
      await fetchAddress();

      setIsEditMode(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error(
        "Profile update error:",
        error?.response?.data || error.message,
      );
      alert(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setEditName(user?.name || "");
    setEditGender(user?.gender || "");
    setMobileNumber(
      user?.user_id || localStorage.getItem("mobile_number") || "",
    );

    await fetchAddress();
    setIsEditMode(false);
  };

  return (
    <>
      <Header />

      <div
        style={{
          background: "#fff",
          minHeight: "100vh",
          padding: "30px 0",
          fontFamily: FONT_FAMILY,
        }}
      >
        <div className="container">
          <div className="row g-3">
            {/* LEFT PROFILE CARD */}
            <div className="col-md-3">
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e2e2",
                  width: "100%",
                  maxWidth: "320px",
                  height: "180px",
                  overflow: "hidden",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    background: "#ead06a",
                    padding: "10px",
                    fontWeight: "600",
                    textAlign: "center",
                    fontSize: "18px",
                  }}
                >
                  My Profile
                </div>

                <div
                  style={{
                    padding: "20px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "62px",
                      height: "62px",
                      minWidth: "62px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "#f4cf2f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        marginBottom: "4px",
                        lineHeight: "1.2",
                      }}
                    >
                      Hello,
                    </div>

                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#111",
                        lineHeight: "1.3",
                        wordBreak: "break-word",
                      }}
                    >
                      {editName || user?.name || "User Name"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT DETAILS SECTION */}
            <div className="col-md-9">
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e2e2",
                  borderRadius: "2px",
                  padding: "16px 24px",
                  minHeight: "300px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #ececec",
                    paddingBottom: "14px",
                    marginBottom: "24px",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "#2f2f2f",
                      letterSpacing: "0.2px",
                    }}
                  >
                    Personal Details
                  </h4>

                  {!isEditMode && (
                    <button
                      onClick={() => setIsEditMode(true)}
                      style={{
                        background: "#f4c400",
                        border: "1px solid #f4c400",
                        borderRadius: "8px",
                        padding: "8px 20px",
                        fontWeight: "700",
                        fontSize: "16px",
                        color: "#111",
                        lineHeight: 1.2,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="row gx-3 gy-2 px-2">
                  <div className="col-md-6">
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#303030",
                        marginBottom: "7px",
                        letterSpacing: "0.2px",
                      }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      disabled={!isEditMode}
                      style={{
                        width: "100%",
                        height: "44px",
                        border: isEditMode
                          ? "1px solid #d6d6d6"
                          : "1px solid #ececec",
                        background: isEditMode ? "#ffffff" : "#f5f5f5",
                        borderRadius: "8px",
                        padding: "0 14px",
                        outline: "none",
                        fontSize: "14px",
                        color: "#222",
                        boxShadow: isEditMode
                          ? "inset 0 1px 2px rgba(0,0,0,0.03)"
                          : "none",
                        transition: "all 0.2s ease",
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#303030",
                        marginBottom: "7px",
                        letterSpacing: "0.2px",
                      }}
                    >
                      Gender
                    </label>

                    {isEditMode ? (
                      <select
                        value={editGender}
                        onChange={(e) => setEditGender(e.target.value)}
                        style={{
                          width: "100%",
                          height: "44px",
                          border: "1px solid #d6d6d6",
                          background: "#ffffff",
                          borderRadius: "8px",
                          padding: "0 14px",
                          outline: "none",
                          fontSize: "14px",
                          color: "#222",
                          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={editGender}
                        disabled
                        readOnly
                        style={{
                          width: "100%",
                          height: "44px",
                          border: "1px solid #ececec",
                          background: "#f5f5f5",
                          borderRadius: "8px",
                          padding: "0 14px",
                          outline: "none",
                          fontSize: "14px",
                          color: "#222",
                        }}
                      />
                    )}
                  </div>

                  <div className="col-md-6">
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#303030",
                        marginBottom: "7px",
                        letterSpacing: "0.2px",
                      }}
                    >
                      Mobile Number
                    </label>

                    <input
                      type="text"
                      value={mobileNumber}
                      disabled
                      readOnly
                      style={{
                        width: "100%",
                        height: "44px",
                        border: "1px solid #ececec",
                        background: "#f5f5f5",
                        borderRadius: "8px",
                        padding: "0 14px",
                        outline: "none",
                        fontSize: "14px",
                        color: "#666",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#303030",
                        marginBottom: "7px",
                        letterSpacing: "0.2px",
                      }}
                    >
                      Flat No. / Room No
                    </label>
                    <input
                      type="text"
                      value={flatNo}
                      onChange={(e) => setFlatNo(e.target.value)}
                      disabled={!isEditMode || addressLoading}
                      style={{
                        width: "100%",
                        height: "44px",
                        border:
                          isEditMode && !addressLoading
                            ? "1px solid #d6d6d6"
                            : "1px solid #ececec",
                        background:
                          isEditMode && !addressLoading ? "#ffffff" : "#f5f5f5",
                        borderRadius: "8px",
                        padding: "0 14px",
                        outline: "none",
                        fontSize: "14px",
                        color: "#222",
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#303030",
                        marginBottom: "7px",
                        letterSpacing: "0.2px",
                      }}
                    >
                      Building Name
                    </label>
                    <input
                      type="text"
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      disabled={!isEditMode || addressLoading}
                      style={{
                        width: "100%",
                        height: "44px",
                        border:
                          isEditMode && !addressLoading
                            ? "1px solid #d6d6d6"
                            : "1px solid #ececec",
                        background:
                          isEditMode && !addressLoading ? "#ffffff" : "#f5f5f5",
                        borderRadius: "8px",
                        padding: "0 14px",
                        outline: "none",
                        fontSize: "14px",
                        color: "#222",
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#303030",
                        marginBottom: "7px",
                        letterSpacing: "0.2px",
                      }}
                    >
                      Area Name
                    </label>
                    <input
                      type="text"
                      value={areaName}
                      onChange={(e) => setAreaName(e.target.value)}
                      disabled={!isEditMode || addressLoading}
                      style={{
                        width: "100%",
                        height: "44px",
                        border:
                          isEditMode && !addressLoading
                            ? "1px solid #d6d6d6"
                            : "1px solid #ececec",
                        background:
                          isEditMode && !addressLoading ? "#ffffff" : "#f5f5f5",
                        borderRadius: "8px",
                        padding: "0 14px",
                        outline: "none",
                        fontSize: "14px",
                        color: "#222",
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#303030",
                        marginBottom: "7px",
                        letterSpacing: "0.2px",
                      }}
                    >
                      Landmark
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      disabled={!isEditMode || addressLoading}
                      style={{
                        width: "100%",
                        height: "44px",
                        border:
                          isEditMode && !addressLoading
                            ? "1px solid #d6d6d6"
                            : "1px solid #ececec",
                        background:
                          isEditMode && !addressLoading ? "#ffffff" : "#f5f5f5",
                        borderRadius: "8px",
                        padding: "0 14px",
                        outline: "none",
                        fontSize: "14px",
                        color: "#222",
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#303030",
                        marginBottom: "7px",
                        letterSpacing: "0.2px",
                      }}
                    >
                      State
                    </label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      disabled={!isEditMode || addressLoading}
                      style={{
                        width: "100%",
                        height: "44px",
                        border:
                          isEditMode && !addressLoading
                            ? "1px solid #d6d6d6"
                            : "1px solid #ececec",
                        background:
                          isEditMode && !addressLoading ? "#ffffff" : "#f5f5f5",
                        borderRadius: "8px",
                        padding: "0 14px",
                        outline: "none",
                        fontSize: "14px",
                        color: "#222",
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#303030",
                        marginBottom: "7px",
                        letterSpacing: "0.2px",
                      }}
                    >
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!isEditMode || addressLoading}
                      style={{
                        width: "100%",
                        height: "44px",
                        border:
                          isEditMode && !addressLoading
                            ? "1px solid #d6d6d6"
                            : "1px solid #ececec",
                        background:
                          isEditMode && !addressLoading ? "#ffffff" : "#f5f5f5",
                        borderRadius: "8px",
                        padding: "0 14px",
                        outline: "none",
                        fontSize: "14px",
                        color: "#222",
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#303030",
                        marginBottom: "7px",
                        letterSpacing: "0.2px",
                      }}
                    >
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      disabled={!isEditMode || addressLoading}
                      style={{
                        width: "100%",
                        height: "44px",
                        border:
                          isEditMode && !addressLoading
                            ? "1px solid #d6d6d6"
                            : "1px solid #ececec",
                        background:
                          isEditMode && !addressLoading ? "#ffffff" : "#f5f5f5",
                        borderRadius: "8px",
                        padding: "0 14px",
                        outline: "none",
                        fontSize: "14px",
                        color: "#222",
                      }}
                    />
                  </div>

                  {!isEditMode && (
                    <div className="col-12">
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#303030",
                          marginBottom: "7px",
                          letterSpacing: "0.2px",
                        }}
                      >
                        Full Address
                      </label>
                      <div
                        style={{
                          background: "#f5f5f5",
                          border: "1px solid #ececec",
                          minHeight: "64px",
                          padding: "14px 16px",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#444",
                          lineHeight: "1.7",
                        }}
                      >
                        {addressLoading
                          ? "Loading address..."
                          : formatAddress() || "No address added"}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "28px",
                    paddingTop: "6px",
                  }}
                >
                  {isEditMode && (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                          background: "#f4c400",
                          border: "1px solid #f4c400",
                          borderRadius: "8px",
                          padding: "10px 20px",
                          minWidth: "96px",
                          fontWeight: "700",
                          fontSize: "14px",
                          color: "#111",
                          opacity: saving ? 0.7 : 1,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        }}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        style={{
                          background: "#fff",
                          border: "1px solid #d0d0d0",
                          borderRadius: "8px",
                          padding: "10px 20px",
                          minWidth: "96px",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#555",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
