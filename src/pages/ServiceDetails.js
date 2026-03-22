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
  const handleAddToCart = (item) => {
    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    dispatch(addToCart(item));
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

      <div style={{ margin: "0 auto", padding: "20px" }}>
        <div
          style={{ padding: "12px", borderRadius: "6px", background: "#fff" }}
        >
          <div className="row">
            {/* LEFT */}
            <div className="col-md-4">
              <img
                src={`${HOST}${serviceDetails?.image_url}`}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />

              <div className="d-flex gap-2 mt-2 flex-wrap">
                {[1, 2, 3, 4].map((_, i) => (
                  <img
                    key={i}
                    src={`${HOST}${serviceDetails?.image_url}`}
                    style={{
                      width: "48%",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                ))}
              </div>

              <div className="mt-3">
                <h6 className="fw-bold">Service Includes</h6>
                <ul className="small m-0">
                  {serviceDetails?.service_includes?.map((item, i) => (
                    <li key={i}>✔ {item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-2">
                <h6 className="fw-bold">Service Excludes</h6>
                <ul className="small m-0">
                  {serviceDetails?.service_excludes?.map((item, i) => (
                    <li key={i}>❌ {item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-2 small">
                <strong>Time Duration:</strong> {serviceDetails?.duration_min} –{" "}
                {serviceDetails?.duration_max} minutes
              </div>
            </div>

            {/* CENTER */}
            <div className="col-md-4">
              <h5 className="fw-bold">{serviceDetails?.name}</h5>

              <div className="small text-muted mb-4 mt-4">⭐ 4.8 Ratings</div>

              <div className="mb-4 mt-4">
                <span className="btn btn-warning btn-sm fw-bold">
                  ₹ {serviceDetails?.price}
                </span>
                <span className="text-muted text-decoration-line-through ms-2">
                  ₹ {serviceDetails?.price + 600}
                </span>
              </div>

              <div className="d-flex gap-4" style={{ marginTop: "50px" }}>
                <button className="btn btn-outline-secondary btn-sm">
                  Buy Now
                </button>

                {!inCart ? (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                      handleAddToCart({
                        service_id: serviceDetails?.id,
                        name: serviceDetails?.name,
                        price: Number(serviceDetails?.price),
                        image: serviceDetails?.image_url,
                        quantity: 1,
                        type: "additional",
                      })
                    }
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => dispatch(removeFromCart(serviceDetails?.id))}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-md-4">
              <div
                style={{
                  background: "#f5d36b",
                  padding: "6px",
                  textAlign: "center",
                  borderRadius: "4px",
                }}
              >
                Additional
              </div>

              <div className="row g-2 mt-2">
                {serviceDetails?.service_addon?.map((item) => {
                  const inCart = cartItems.some(
                    (cartItem) => cartItem.service_id === Number(item.id),
                  );

                  return (
                    <div className="col-12" key={item.id}>
                      <AdditionalItem
                        image={`${HOST}${item.image_url}`}
                        name={item.name}
                        price={item.price}
                        cutPrice={Math.round(item.price * 1.2)}
                        inCart={inCart}
                        onAdd={() =>
                          handleAddToCart({
                            service_id: Number(item.id),
                            name: item.name,
                            price: Number(item.price),
                            image: item.image_url,
                            quantity: 1,
                            type: "additional",
                          })
                        }
                        onRemove={() =>
                          dispatch(removeFromCart(Number(item.id)))
                        }
                        openServiceDetails={() => openServiceDetails(item.id)}
                      />
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
