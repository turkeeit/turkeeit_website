import React from "react";
import Product from "./Product";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function ProductSlider({ title, services = [] }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(`Rendering ProductSlider for ${title}:`, services);

  const handleClick = (serviceId) => {
    dispatch({
      type: "SET_SELECTED_SERVICE",
      payload: serviceId,
    });
    localStorage.setItem("selectedServiceId", serviceId);
    navigate("/service/details");
  };

  return (
    <div className="mt-3" style={{ marginLeft: "20px" }}>
      {/* Title */}
      <h6 className="mb-2">{title}</h6>

      {/* Products Row */}
      <div className="container-fluid p-0">
        <div className="row g-3 mt-2">
          {services.map((service) => {
            console.log("Rendering service:", service);

            return (
              <Product
                key={service.id}
                image={service.image_url}
                name={service.name}
                price={service.price}
                cutPrice={(Number(service.price) * 1.2).toFixed(0)}
                onClick={() => handleClick(service.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
