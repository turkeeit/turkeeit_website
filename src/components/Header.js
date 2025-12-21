import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/app-icon.png";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  checkAlreadyLoggedIn,
  getUserDetails,
  logout,
  sendOtp,
  verifyOtp,
} from "../redux/actions/authActions";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // 1 = mobile, 2 = otp
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [userName, setUserName] = useState(null);

  const { otpSent, otpVerified, token, loading, user, error } = useSelector(
    (state) => state.auth
  );

  // closemenu
  useEffect(() => {
    const closeMenu = () => setShowProfileMenu(false);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);
  /* ---------- checked already logged in ---------- */
  useEffect(() => {
    dispatch(checkAlreadyLoggedIn());
  }, []);

  /* ---------- token Login ---------- */
  useEffect(() => {
    if (token && !user) {
      dispatch(getUserDetails(token));
    }
  }, [token]);

  /* ---------- User Already Login ---------- */
  useEffect(() => {
    if (user) {
      setUserName(user.name || "User");
      closeModal();
    }
  }, [user]);

  /* ---------- OTP SENT ---------- */
  useEffect(() => {
    if (otpSent) {
      setStep(2);
    }
  }, [otpSent]);

  const getOtpHandler = () => {
    if (mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }
    dispatch(sendOtp(mobile));
  };

  const verifyOtpHandler = () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }
    dispatch(verifyOtp(mobile, otp));
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setMobile("");
    setOtp("");
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserName(null);
    setShowProfileMenu(false);
  };

  const goToCategory = (id) => {
    navigate("/"); // go to dashboard
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100); // wait for DOM
  };

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <nav className="navbar bg-white shadow-sm px-3">
        <div className="container-fluid">
          <div className="col-2 d-flex align-items-center">
            <img src={logo} alt="Turkeeit" style={{ height: "45px" }} />
            <span className="ms-2 fw-bold">Turkeeit</span>
          </div>

          <div className="col-7 d-flex justify-content-center">
            <input className="form-control" placeholder="Search services..." />
            <button className="btn btn-primary ms-2">Search</button>
          </div>

          <div className="col-3 d-flex justify-content-end">
            {userName ? (
              <div className="position-relative">
                <div
                  className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center fw-semibold"
                  style={{ height: "36px", width: "36px", cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu(!showProfileMenu);
                  }}
                >
                  {userName?.charAt(0).toUpperCase()}
                </div>

                {showProfileMenu && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white border rounded shadow"
                    style={{ width: "160px", zIndex: 999 }}
                  >
                    <div
                      className="dropdown-item py-2 px-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        window.location.href = "/user/profile";
                      }}
                    >
                      Profile
                    </div>

                    <div
                      className="dropdown-item py-2 px-3"
                      style={{ cursor: "pointer" }}
                    >
                      My Orders
                    </div>

                    <hr className="my-1" />

                    <div
                      className="dropdown-item py-2 px-3 text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn" onClick={() => setShowModal(true)}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ================= CATEGORY NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg bg-white border-top border-bottom">
        <div className="container-fluid">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button
                className="nav-link btn px-4"
                onClick={() => goToCategory("Cleaning Services")}
              >
                {" "}
                Cleaning{" "}
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn px-4"
                onClick={() => goToCategory("Electrical Services")}
              >
                {" "}
                Electrical{" "}
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn px-4"
                onClick={() => goToCategory("Plumbing Services")}
              >
                {" "}
                Plumbing{" "}
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn px-4"
                onClick={() => goToCategory("Carpenter Services")}
              >
                {" "}
                Carpenter{" "}
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn px-4"
                onClick={() => goToCategory("Painting Services")}
              >
                {" "}
                Painting{" "}
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn px-4"
                onClick={() => goToCategory("AC Services")}
              >
                {" "}
                AC Service{" "}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* ================= SIGN IN MODAL ================= */}
      {showModal && (
        <div
          className="modal show fade d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {step === 1 ? "Sign In" : "Verify OTP"}
                </h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body">
                {error && <p className="text-danger">{error}</p>}

                {step === 1 && (
                  <>
                    <input
                      className="form-control mb-3"
                      placeholder="Enter Mobile Number"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                    <button
                      className="btn btn-primary w-100"
                      onClick={getOtpHandler}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Get OTP"}
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <input
                      className="form-control mb-3"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                      className="btn btn-success w-100"
                      onClick={verifyOtpHandler}
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
