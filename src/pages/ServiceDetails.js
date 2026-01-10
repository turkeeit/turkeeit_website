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
    (state) => state.services
  );
  const cartItems = useSelector((state) => state.cart.items);

  const basePrice = Number(serviceDetails?.price || 0);

  const additionalsTotal = cartItems
    .filter((item) => item.type === "additional")
    .reduce((sum, item) => sum + Number(item.price), 0);

  const totalPrice = basePrice + additionalsTotal;

  const serviceId =
    selectedServiceId || localStorage.getItem("selectedServiceId");

  const [modalService, setModalService] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    console.log("Fetching service details for serviceId:", serviceId);
    if (serviceId) {
      dispatch(getServiceDetails(serviceId, token));
      dispatch(getAllServices(token));
    }
  }, [dispatch, serviceId, token]);

  useEffect(() => {
    if (!serviceDetails) return;
    console.log("service details...", serviceDetails);
    console.log("Cart Items:", cartItems);
    const alreadyInCart = cartItems.some(
      (item) => String(item.service_id) === String(serviceDetails.id)
    );
    console.log("hasmainservice", alreadyInCart);
    if (!alreadyInCart) {
      dispatch(
        addToCart({
          service_id: serviceDetails.id,
          name: serviceDetails.name,
          price: Number(serviceDetails.price),
          image: serviceDetails.image_url,
          quantity: 1,
          type: "service",
        })
      );
    }
  }, [serviceDetails, cartItems, dispatch]);

  const groupedServices = useMemo(
    () => groupServicesByCategory(services.services),
    [services]
  );
  if (loading || !serviceDetails) return <p>Loading...</p>;

  const addToCartHandler = (cartItems) => {
    console.log("Navigating to Order Details with cart items:", cartItems);
    navigate("/order/details");
  };

  const openServiceDetails = async (id) => {
    try {
      setModalLoading(true);

      const res = await api.post(
        `${HOST}/api/getServiceDetails`,
        {
          service_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setModalService(res.data);
      setModalLoading(false);

      const modalEl = document.getElementById("serviceDetailsModal");
      if (!modalEl || !window.bootstrap) return;

      const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    } catch (err) {
      setModalLoading(false);
      console.error("Modal service fetch failed", err);
    }
  };

  return (
    <>
      <Header />
      <ServiceDetailsModal service={modalService} loading={modalLoading} />
      <div className="p-3">
        <h5 className="">{serviceDetails?.name}</h5>

        {/* Rating + Price */}
        <div className="d-flex justify-content-start align-items-center mb-3">
          <span className="small text-muted">
            <i className="bi bi-star-fill text-warning"></i> 4.8 Ratings
          </span>
          <div>
            <span className="btn btn-primary btn-sm ms-2">
              <i className="bi bi-currency-rupee"></i> {serviceDetails?.price}
            </span>
            <span className="text-decoration-line-through text-muted ms-2">
              <i className="bi bi-currency-rupee"></i> {serviceDetails?.price}
            </span>
          </div>
        </div>

        <div className="row">
          {/* Included Services */}
          {/* Service Details */}
          <div className="col-4">
            {/* Includes */}
            <div className="mb-3">
              <h6 className="fw-semibold">Service Includes</h6>
              <ul className="list-none m-0 small mb-0 ">
                {serviceDetails?.service_includes?.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-base py-1"
                  >
                    <span className="text-lg">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Excludes */}
            <div className="mb-3">
              <h6 className="fw-semibold">Service Excludes</h6>
              <ul className="list-none m-0 small mb-0 ">
                {serviceDetails?.service_excludes?.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-base py-1"
                  >
                    <span className="text-lg">❌</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Time Duration */}
            <div className="mb-3">
              <h6 className="fw-semibold">Time Duration</h6>
              <div className="small">
                {serviceDetails?.duration_min} – {serviceDetails?.duration_max}{" "}
                minutes
              </div>
            </div>

            {/* Notes */}
            {serviceDetails?.notes && (
              <div>
                <h6 className="fw-semibold">Notes</h6>
                <div className="small">{serviceDetails.notes}</div>
              </div>
            )}
          </div>

          {/* Additional Items */}
          <div className="col-5">
            <h5 className="fw-bold mb-2">Additionals</h5>
            <div className="row g-2">
              {Object.values(groupedServices)
                .filter(
                  (category) =>
                    String(category.categoryId) ===
                    String(serviceDetails?.category_id)
                )
                .map((category) =>
                  category.services
                    .filter((item) => item.id !== serviceDetails?.id)
                    .map((item) => {
                      const inCart = cartItems.some(
                        (cartItem) => cartItem.service_id === item.id
                      );
                      return (
                        <AdditionalItem
                          key={item.id}
                          image={`${HOST}${item.image_url}`}
                          name={item.name}
                          price={`${item.price}`}
                          cutPrice={`${Math.round(item.price * 1.2)}`}
                          inCart={inCart}
                          onAdd={() =>
                            dispatch(
                              addToCart({
                                service_id: item.id,
                                name: item.name,
                                price: Number(item.price),
                                image: item.image_url,
                                quantity: 1,
                                type: "additional",
                              })
                            )
                          }
                          onRemove={() => dispatch(removeFromCart(item.id))}
                          openServiceDetails={() => openServiceDetails(item.id)}
                        />
                      );
                    })
                )}
            </div>
          </div>

          {/* Cart */}
          <div className="col-3">
            <h5 className="fw-bold mb-2">Cart</h5>
            <div className="card shadow-sm rounded-3 p-2">
              {cartItems.map((item) => (
                <div className="d-flex justify-content-between small mb-1">
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
              <hr className="my-1" />
              <div className="d-flex justify-content-between fw-bold small">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
              <button
                className="btn btn-sm btn-primary w-100 mt-2"
                onClick={() => addToCartHandler(cartItems)}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
