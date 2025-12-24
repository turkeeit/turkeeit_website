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

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGVfbnVtYmVyIjoiOTg2NzMxNTM2MSIsImlhdCI6MTc2NjA1MzAyOSwiZXhwIjoxNzczODI5MDI5fQ.xl29SDnHJVDUzK6MgFV8kSypzCcFn19DH2M0C61gQUg";
  const { selectedServiceId, services, serviceDetails, loading } = useSelector(
    (state) => state.services
  );
  const cartItems = useSelector((state) => state.cart.items);

  const basePrice = Number(serviceDetails?.price || 0);
  const additionalsTotal = cartItems.reduce(
    (total, item) => total + Number(item.price),
    0
  );
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

  const groupedServices = useMemo(
    () => groupServicesByCategory(services.services),
    [services]
  );
  if (loading || !serviceDetails) return <p>Loading...</p>;

  const openServiceDetails = async (id) => {
    try {
      setModalLoading(true);

      const res = await api.get(`${HOST}/api/getServiceDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
          service_id: id,
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
              <ul className="small mb-0">
                {serviceDetails?.service_includes?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Excludes */}
            <div className="mb-3">
              <h6 className="fw-semibold">Service Excludes</h6>
              <ul className="small mb-0">
                {serviceDetails?.service_excludes?.map((item, index) => (
                  <li key={index}>{item}</li>
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
                        (cartItem) => cartItem.id === item.id
                      );
                      return (
                        <AdditionalItem
                          key={item.id}
                          image={`http://139.59.58.233:3000${item.image_url}`}
                          name={item.name}
                          price={`${item.price}`}
                          cutPrice={`${Math.round(item.price * 1.2)}`}
                          inCart={inCart}
                          onAdd={() =>
                            dispatch(
                              addToCart({
                                id: item.id,
                                name: item.name,
                                price: Number(item.price),
                                image: item.image_url,
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
              <div className="d-flex justify-content-between small mb-1">
                <span>Base Price</span>
                <span>₹{serviceDetails?.price}</span>
              </div>
              <div className="d-flex justify-content-between small mb-1">
                <span>Additionals</span>
                <span>₹{additionalsTotal}</span>
              </div>
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
                onClick={() => navigate("/order/details")}
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
