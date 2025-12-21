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
      })
    );
    setShowEditModal(false);
  };

  return (
    <>
      <Header />

      <div className="container mt-4">
        <h4>My Profile</h4>

        <div className="card p-4 mt-3">
          <p>
            <b>Name:</b> {user?.name || "User"}
          </p>
          <p>
            <b>Gender:</b> {user?.gender || "-"}
          </p>
          <p>
            <b>Mobile:</b> {user?.user_id || "-"}
          </p>
          <p>
            <b>Address:</b> {user?.address || "Not added"}
          </p>

          <button
            className="btn btn-outline-primary mt-2"
            onClick={() => setShowEditModal(true)}
          >
            Edit Profile
          </button>
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
