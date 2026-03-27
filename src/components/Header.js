import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/app-icon.png";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  checkAlreadyLoggedIn,
  getUserDetails,
  logout,
  sendOtp,
  verifyOtp,
} from "../redux/actions/authActions";
import "./Header.css";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [userName, setUserName] = useState(null);

  const { otpSent, token, loading, user, error } = useSelector(
    (state) => state.auth,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || "",
  );

  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.qty || 1),
    0,
  );

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const closeMenu = () => setShowProfileMenu(false);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
    dispatch(checkAlreadyLoggedIn());
  }, [dispatch]);

  useEffect(() => {
    if (token && !user) {
      dispatch(getUserDetails(token));
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (user) {
      setUserName(user.name || "User");
      closeModal();
    }
  }, [user]);

  useEffect(() => {
    if (otpSent) {
      setStep(2);
    }
  }, [otpSent]);

  useEffect(() => {
    setSearchText(searchParams.get("search") || "");
  }, [searchParams]);

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

  // ✅ category id generator
  const getCategoryId = (categoryName = "") => {
    return `category-${categoryName.trim().toLowerCase().replace(/\s+/g, "-")}`;
  };

  // ✅ smooth scroll with sticky header offset
  const scrollToCategorySection = (id) => {
    const element = document.getElementById(id);

    if (!element) {
      console.log("Element not found:", id);
      return;
    }

    const headerOffset = 140; // adjust if your fixed header total height differs
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  // ✅ from same page or another page
  const goToCategory = (categoryName) => {
    const id = getCategoryId(categoryName);

    if (location.pathname === "/services") {
      scrollToCategorySection(id);
    } else {
      navigate("/services", {
        state: { scrollToCategory: id },
      });
    }
  };

  const handleSearch = () => {
    const trimmed = searchText.trim();

    if (location.pathname !== "/services") {
      if (trimmed) {
        navigate(`/services?search=${encodeURIComponent(trimmed)}`);
      } else {
        navigate("/services");
      }
      return;
    }

    if (trimmed) {
      setSearchParams({ search: trimmed });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1050,
          background: "#fff",
        }}
      >
        {/* ================= TOP NAVBAR ================= */}
        <nav
          className="navbar shadow-sm"
          style={{
            backgroundColor: "#FFC500",
            height: "75px",
          }}
        >
          <div className="container-fluid d-flex align-items-center px-4">
            <div className="col-3 d-flex align-items-center">
              <img
                src={logo}
                alt="Turkeeit"
                style={{
                  height: "50px",
                  objectFit: "contain",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/services")}
              />
              <span
                className="ms-2 fw-bold"
                style={{
                  fontSize: "20px",
                  color: "#000",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/services")}
              >
                Turkeeit
              </span>
            </div>

            <div className="col-6 d-flex justify-content-center align-items-center">
              <div className="d-flex w-75">
                <input
                  className="form-control"
                  placeholder="Search services..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  style={{
                    height: "42px",
                    fontSize: "14px",
                    borderRadius: "6px 0 0 6px",
                  }}
                />
                <button
                  className="btn"
                  onClick={handleSearch}
                  style={{
                    background: "#000",
                    color: "#fff",
                    height: "42px",
                    padding: "0 18px",
                    borderRadius: "0 6px 6px 0",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            <div className="col-3 d-flex justify-content-end align-items-center gap-3">
              {userName ? (
                <>
                  <div
                    className="position-relative"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/cart")}
                  >
                    <i className="bi bi-cart3" style={{ fontSize: "20px" }}></i>

                    {cartCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{
                          fontSize: "10px",
                          minWidth: "18px",
                          height: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </div>

                  <div className="position-relative">
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center fw-semibold"
                      style={{
                        height: "40px",
                        width: "40px",
                        background: "#000",
                        color: "#fff",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProfileMenu(!showProfileMenu);
                      }}
                    >
                      <i className="bi bi-person-fill"></i>
                    </div>

                    {showProfileMenu && (
                      <div
                        className="position-absolute end-0 mt-2 bg-white border rounded shadow"
                        style={{
                          width: "180px",
                          zIndex: 999,
                          borderRadius: "8px",
                        }}
                      >
                        <div
                          className="py-2 px-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/user/profile")}
                        >
                          Profile
                        </div>

                        <div
                          className="py-2 px-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/user/orders")}
                        >
                          My Orders
                        </div>

                        <hr className="my-1" />

                        <div
                          className="py-2 px-3 text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={handleLogout}
                        >
                          Logout
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  className="btn"
                  onClick={() => setShowModal(true)}
                  style={{
                    background: "#000",
                    color: "#fff",
                    padding: "8px 18px",
                    fontSize: "14px",
                    borderRadius: "6px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#333";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#000";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ================= CATEGORY NAVBAR ================= */}
        <nav className="navbar navbar-expand-lg bg-white border-top border-bottom">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <ul className="navbar-nav mx-auto d-flex flex-row gap-2">
              <li className="nav-item">
                <button
                  className="nav-link btn px-4 fw-medium category-btn"
                  onClick={() => goToCategory("Cleaning")}
                >
                  Cleaning
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn px-4 fw-medium"
                  onClick={() => goToCategory("Plumbing")}
                >
                  Plumbing
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn px-4 fw-medium"
                  onClick={() => goToCategory("Electrical")}
                >
                  Electrical
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn px-4 fw-medium"
                  onClick={() => goToCategory("Carpenter")}
                >
                  Carpenter
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn px-4 fw-medium"
                  onClick={() => goToCategory("Net Installation")}
                >
                  Net Installation
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn px-4 fw-medium"
                  onClick={() => goToCategory("AC Service")}
                >
                  AC Service
                </button>
              </li>
              <li className="nav-item ">
                <button
                  className="nav-link btn px-4 fw-medium"
                  onClick={() => navigate("/blogs")}
                >
                  Blogs
                </button>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <a
                href="tel:+919867315361"
                className="d-flex align-items-center gap-1 text-decoration-none text-dark fw-semibold"
              >
                <i className="bi bi-telephone-fill text-primary"></i>
                +91 98673 15361
              </a>

              <a
                href="https://wa.me/919867315361"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-1 text-decoration-none text-success fw-semibold"
              >
                <i className="bi bi-whatsapp"></i>
                WhatsApp
              </a>
            </div>
          </div>
        </nav>
      </div>

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
                      className="btn btn-otp w-100"
                      onClick={getOtpHandler}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send OTP"}
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
                      className="btn btn-verify w-100"
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
