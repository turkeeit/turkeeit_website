import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import {
  getUserDetails,
  updateUserProfile,
} from "../redux/actions/authActions";
// import { updateUserProfile } from "../redux/actions/authActions";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editAddress, setEditAddress] = useState("");

  /* 🔐 Fetch user when profile page opens */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(getUserDetails(token));
    }
  }, [dispatch, user]);

  /* 🧠 Sync form fields when user data arrives */
  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditGender(user.gender || "");
      setEditAddress(user.address || "");
    }
  }, [user]);

  /* 💾 Save profile */
  const saveProfileHandler = () => {
    if (!editName.trim()) {
      alert("Name is required");
      return;
    }

    dispatch(
      updateUserProfile({
        name: editName,
        gender: editGender,
        address: editAddress,
      }),
    );
    setShowEditModal(false);
  };

  return (
    <>
      <Header />

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-3">
            <div className="card shadow-sm" style={{ borderRadius: "12px" }}>
              {/* Header */}
              <div
                className="p-3 text-center"
                style={{ background: "#FFC500" }}
              >
                <h5 className="m-0">My Profile</h5>
              </div>

              {/* Body */}
              <div className="p-3 text-center">
                <i
                  className="bi bi-person-circle mb-3"
                  style={{ fontSize: "70px", color: "#6c757d" }}
                />

                <div className="text-start ps-3 ml-2">
                  <p>
                    <b style={{ color: "#444" }}>Name:</b>{" "}
                    <span className="text-muted">{user?.name || "User"}</span>
                  </p>
                  <p>
                    <b style={{ color: "#444" }}>Gender:</b>{" "}
                    <span className="text-muted">{user?.gender || "-"}</span>
                  </p>
                  <p>
                    <b style={{ color: "#444" }}>Mobile:</b>{" "}
                    <span className="text-muted">{user?.user_id || "-"}</span>
                  </p>
                  <p>
                    <b style={{ color: "#444" }}>Address:</b>{" "}
                    <span className="text-muted">
                      {user?.address || "Not added"}
                    </span>
                  </p>
                </div>

                <button
                  className="btn w-100"
                  style={{
                    backgroundColor: "#FFC500",
                    color: "#212529",
                    fontWeight: "bold",
                  }}
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="card shadow-sm" style={{ borderRadius: "12px" }}>
              <div
                className="p-3 text-center"
                style={{ background: "#FFC500" }}
              >
                <h5 className="m-0">Personal Details</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {showEditModal && (
        <div
          className="modal show fade d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Profile</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                />
              </div>

              <div className="modal-body">
                {/* NAME */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                {/* GENDER */}
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* ADDRESS */}
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="Enter your full address"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saveProfileHandler}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
