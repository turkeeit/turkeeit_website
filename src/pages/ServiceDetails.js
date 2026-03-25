import { useState } from "react";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AdditionalItem from "../components/AdditionalItem";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllServices,
  getServiceDetails,
} from "../redux/actions/serviceActions";
import { groupServicesByCategory } from "../utils/groupServicesByCategory";
import { addToCart, removeFromCart } from "../redux/actions/cartActions";
import ServiceDetailsModal from "../components/ServiceDetailsModal";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { HOST } from "../utils/host";

export default function ServiceDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const { selectedServiceId, services, serviceDetails, loading } = useSelector(
    (state) => state.services,
  );

  const cartItems = useSelector((state) => state.cart.items);

  const [modalService, setModalService] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [inCart, setInCart] = useState(false);

  // 🔥 LOGIN POPUP STATE
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const serviceId =
    selectedServiceId || localStorage.getItem("selectedServiceId");

  useEffect(() => {
    if (serviceId) {
      dispatch(getServiceDetails(serviceId, token));
      dispatch(getAllServices(token));
    }
  }, [dispatch, serviceId, token]);

  useEffect(() => {
    if (!serviceDetails) return;

    const alreadyInCart = cartItems.some(
      (item) => String(item.service_id) === String(serviceDetails.id),
    );

    setInCart(alreadyInCart);
  }, [serviceDetails, cartItems]);

  const groupedServices = useMemo(
    () => groupServicesByCategory(services.services),
    [services],
  );

  if (loading || !serviceDetails) return <p>Loading...</p>;

  // 🔥 SAFE ADD TO CART FUNCTION
  const handleAddToCart = async (item) => {
    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    try {
      await dispatch(addToCart(item));
      alert("Added to cart successfully");
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add to cart");
    }
  };

  const openServiceDetails = async (id) => {
    try {
      setModalLoading(true);

      const res = await api.get(`${HOST}/api/getServiceDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
          service_id: id,
          "Content-Type": "application/json",
        },
      });

      setModalService(res.data);
      setModalLoading(false);

      const modalEl = document.getElementById("serviceDetailsModal");
      if (!modalEl || !window.bootstrap) return;

      const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    } catch (err) {
      setModalLoading(false);
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <ServiceDetailsModal service={modalService} loading={modalLoading} />

      <div
        style={{
          margin: "0 auto",
          padding: "18px 20px",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "18px",
          }}
        >
          <div className="row g-4 px-2">
            {/* LEFT + CENTER SECTION */}
            <div className="col-lg-8">
              <div className="row g-4">
                {/* LEFT IMAGES */}
                <div className="col-md-6">
                  <div>
                    <img
                      src={`${HOST}${serviceDetails?.image_url}`}
                      alt={serviceDetails?.name}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>

                  <div className="row g-2 mt-1">
                    {[1, 2].map((_, i) => (
                      <div className="col-6" key={i}>
                        <img
                          src={`${HOST}${serviceDetails?.image_url}`}
                          alt={`thumb-${i}`}
                          style={{
                            width: "100%",
                            height: "95px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* CENTER DETAILS */}
                <div className="col-md-6 text-center mb-2">
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      marginBottom: "6px",
                      color: "#2b2b2b",
                      // marginTop: "10px",
                    }}
                  >
                    {serviceDetails?.name}
                  </h2>

                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#222",
                      marginBottom: "14px",
                    }}
                  >
                    <span style={{ color: "#f4b400", marginRight: "6px" }}>
                      ★
                    </span>
                    <span style={{ fontSize: "15px" }}>4.8 Ratings</span>
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <div
                      style={{
                        display: "inline-block",
                        background: "#f3d46a",
                        padding: "10px 18px",
                        fontWeight: "700",
                        fontSize: "18px",
                        borderRadius: "2px",
                        color: "#111",
                      }}
                    >
                      ₹ {serviceDetails?.price}
                    </div>

                    <div
                      style={{
                        marginTop: "12px",
                        color: "#9a9a9a",
                        fontSize: "18px",
                        textDecoration: "line-through",
                      }}
                    >
                      ₹ {Number(serviceDetails?.price || 0) + 640}
                    </div>
                  </div>

                  <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
                    <button
                      className="btn"
                      onClick={() => {
                        if (!token) {
                          setShowLoginPopup(true);
                          return;
                        }

                        const buyNowItem = {
                          service_id: serviceDetails?.id,
                          name: serviceDetails?.name,
                          price: Number(serviceDetails?.price),
                          image: serviceDetails?.image_url,
                          image_url: serviceDetails?.image_url,
                          qty: 1,
                          quantity: 1,
                        };

                        navigate("/order/details", {
                          state: {
                            buyNow: true,
                            buyNowItem,
                          },
                        });
                      }}
                      style={{
                        minWidth: "98px",
                        padding: "10px 20px",
                        border: "1px solid #8d8d8d",
                        background: "#fff",
                        borderRadius: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Buy Now
                    </button>

                    {!inCart ? (
                      <button
                        className="btn"
                        onClick={() =>
                          handleAddToCart({
                            service_id: serviceDetails?.id,
                            name: serviceDetails?.name,
                            price: Number(serviceDetails?.price),
                            image_url: serviceDetails?.image_url,
                            quantity: 1,
                          })
                        }
                        style={{
                          minWidth: "120px",
                          padding: "10px 20px",
                          background: "#f4bf00",
                          border: "none",
                          borderRadius: "10px",
                          fontWeight: "600",
                          color: "#222",
                        }}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          dispatch(removeFromCart(serviceDetails?.id))
                        }
                        style={{
                          minWidth: "120px",
                          padding: "10px 20px",
                          borderRadius: "10px",
                          fontWeight: "600",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* BOTTOM DETAILS */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-2">Service Includes</h6>
                  <div
                    className="small"
                    style={{ color: "#444", lineHeight: "1.5" }}
                  >
                    {serviceDetails?.service_includes?.map((item, i) => (
                      <div key={i}>✔ {item}</div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h6 className="fw-bold mb-1">Time Duration</h6>
                    <div
                      className="small"
                      style={{
                        color: "#444",
                        fontWeight: "500",
                        lineHeight: "1.5",
                      }}
                    >
                      {serviceDetails?.duration_min} –{" "}
                      {serviceDetails?.duration_max} minutes
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <h6 className="fw-bold mb-2">Service Excludes</h6>
                  <div
                    className="small"
                    style={{ color: "#444", lineHeight: "1.5" }}
                  >
                    {serviceDetails?.service_excludes?.map((item, i) => (
                      <div key={i}>❌ {item}</div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h6 className="fw-bold mb-1">Notes</h6>
                    <div
                      className="small"
                      style={{ color: "#555", lineHeight: "1.5" }}
                    >
                      Please ensure water availability and unclogged sink before
                      the service.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div
              className="col-lg-4"
              style={{
                borderLeft: "1px solid #d9d9d9",
                paddingLeft: "24px",
              }}
            >
              <div
                style={{
                  background: "#efd36d",
                  padding: "10px 14px",
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: "18px",
                  borderRadius: "2px",
                  marginBottom: "20px",
                  width: "100%",
                  minWidth: "165px",
                }}
              >
                Additional
              </div>

              <div className="row g-2">
                {serviceDetails?.service_addon?.map((item) => {
                  const addonInCart = cartItems.some(
                    (cartItem) => cartItem.service_id === Number(item.id),
                  );

                  return (
                    <div className="col-6 px-2 " key={item.id}>
                      <div
                        className="text-center mt-1"
                        onClick={() => openServiceDetails(item.id)}
                        style={{
                          background: "#fff",
                          border: "1px solid #d9d9d9",
                          borderRadius: "14px",
                          padding: "8px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                          cursor: "pointer",
                          height: "100%",
                        }}
                      >
                        <img
                          src={`${HOST}${item.image_url}`}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "95px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            marginBottom: "5px",
                          }}
                        />

                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#222",
                            minHeight: "40px",
                            lineHeight: "1.35",
                            textAlign: "center",
                          }}
                        >
                          {item.name}
                        </div>

                        <div
                          className="text-center mt-1"
                          style={{
                            display: "inline-block",
                            background: "#f4bf00",
                            borderRadius: "8px",
                            padding: "5px 12px",
                            fontWeight: "700",
                            marginTop: "8px",
                            fontSize: "16px",
                          }}
                        >
                          ₹ {item.price}
                        </div>

                        <div
                          className="text-center mt-1"
                          style={{
                            fontSize: "16px",
                            color: "#9b9b9b",
                            textDecoration: "line-through",
                            marginTop: "8px",
                            textAlign: "center",
                          }}
                        >
                          ₹ {Math.round(item.price * 1.2)}
                        </div>

                        <div className="mt-2">
                          {!addonInCart ? (
                            <button
                              className="btn btn-sm w-100"
                              style={{
                                background: "#f4bf00",
                                border: "none",
                                borderRadius: "5px",
                                fontWeight: "600",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart({
                                  service_id: Number(item.id),
                                  name: item.name,
                                  price: Number(item.price),
                                  image: item.image_url,
                                  quantity: 1,
                                  type: "additional",
                                });
                              }}
                            >
                              Add
                            </button>
                          ) : (
                            <button
                              className="btn btn-danger btn-sm w-100"
                              style={{ borderRadius: "8px", fontWeight: "600" }}
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await dispatch(
                                    removeFromCart(Number(item.id)),
                                  );
                                } catch (error) {
                                  console.error(
                                    "Remove from cart failed:",
                                    error,
                                  );
                                  alert("Failed to remove item from cart");
                                }
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 LOGIN POPUP */}
      {showLoginPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              width: "300px",
            }}
          >
            <h6>Please Login</h6>
            <p style={{ fontSize: "13px" }}>
              Please login first to add items to cart
            </p>

            <div className="d-flex justify-content-center gap-2 mt-3">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setShowLoginPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
