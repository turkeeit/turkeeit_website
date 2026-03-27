import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  getUserDetails,
  updateUserProfile,
} from "../redux/actions/authActions";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});

  const [mobileNumber, setMobileNumber] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState("");

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

  const handleSave = () => {
    if (!editName.trim()) {
      alert("Name is required");
      return;
    }

    dispatch(
      updateUserProfile({
        name: editName,
        gender: editGender,
      }),
    );

    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditName(user?.name || "");
    setEditGender(user?.gender || "");
    setMobileNumber(
      user?.user_id || localStorage.getItem("mobile_number") || "",
    );
    setIsEditMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mobile_number");
    window.location.href = "/login";
  };

  return (
    <>
      <Header />

      <div
        style={{
          background: "#f5f5f5",
          minHeight: "100vh",
          padding: "30px 0",
        }}
      >
        <div className="container">
          <div className="row g-3">
            {/* LEFT PROFILE CARD */}
            <div className="col-md-3">
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #ddd",
                  minHeight: "100%",
                }}
              >
                <div
                  style={{
                    background: "#ead06a",
                    padding: "10px",
                    fontWeight: "600",
                    textAlign: "center",
                    fontSize: "16px",
                  }}
                >
                  My Profile
                </div>

                <div className="text-center py-4 px-3">
                  <i
                    className="bi bi-person-circle"
                    style={{
                      fontSize: "72px",
                      color: "#8c8c8c",
                      lineHeight: 1,
                    }}
                  ></i>

                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "14px",
                      color: "#6c757d",
                      fontWeight: "500",
                    }}
                  >
                    {user?.name || "User Name"}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT DETAILS SECTION */}
            <div className="col-md-9">
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #ddd",
                  padding: "20px",
                  minHeight: "420px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "28px",
                      fontWeight: "500",
                      color: "#555",
                    }}
                  >
                    Personal Details
                  </h4>

                  {!isEditMode && (
                    <button
                      onClick={() => setIsEditMode(true)}
                      style={{
                        background: "#f4c400",
                        border: "none",
                        padding: "4px 18px",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        color: "#666",
                        marginBottom: "8px",
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
                        height: "42px",
                        border: "none",
                        background: "#e9e9e9",
                        padding: "0 12px",
                        outline: "none",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        color: "#666",
                        marginBottom: "8px",
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
                          height: "42px",
                          border: "none",
                          background: "#e9e9e9",
                          padding: "0 12px",
                          outline: "none",
                          fontSize: "14px",
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
                          height: "42px",
                          border: "none",
                          background: "#e9e9e9",
                          padding: "0 12px",
                          outline: "none",
                          fontSize: "14px",
                        }}
                      />
                    )}
                  </div>

                  <div className="col-md-6 mb-4">
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        color: "#666",
                        marginBottom: "8px",
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
                        height: "42px",
                        border: "none",
                        background: "#e9e9e9",
                        padding: "0 12px",
                        outline: "none",
                        fontSize: "14px",
                        color: "#555",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    marginTop: "40px",
                  }}
                >
                  {isEditMode && (
                    <>
                      <button
                        onClick={handleSave}
                        style={{
                          background: "#f4c400",
                          border: "none",
                          padding: "7px 18px",
                          minWidth: "85px",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        Save
                      </button>

                      <button
                        onClick={handleCancel}
                        style={{
                          background: "#fff",
                          border: "1px solid #cfcfcf",
                          padding: "7px 18px",
                          minWidth: "85px",
                          fontSize: "14px",
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
