import Footer from "../components/Footer";
import Header from "../components/Header";
import Product from "../components/Product";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllServices } from "../redux/actions/serviceActions";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const { loading, services, error } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(getAllServices(token));
  }, [dispatch, token]);

  const handleClick = (serviceId) => {
    console.log("Product clicked, serviceId:", serviceId);
    dispatch({
      type: "SET_SELECTED_SERVICE",
      payload: serviceId,
    });
    localStorage.setItem("selectedServiceId", serviceId);
    navigate("/service/details");
  };

  const groupedData = useMemo(() => {
    const result = {};
    services?.forEach((item) => {
      if (!result[item.category_name]) {
        result[item.category_name] = [];
      }
      result[item.category_name].push(item);
    });
    return result;
  }, [services]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div
      style={{
        background: "#f7f7f7",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <Header />

      <div
        style={{
          width: "100%",
          maxWidth: "1500px", // increased width
          margin: "0 auto",
          padding: "20px 12px", // reduced left-right space
        }}
      >
        {Object.keys(groupedData).map((category, index) => (
          <div key={index} className="mb-4">
            {/* CATEGORY */}
            <div
              style={{
                background: "#f4bf00",
                padding: "6px 14px",
                fontWeight: "600",
                borderRadius: "6px",
                fontSize: "20px",
                display: "inline-block",
                color: "#222",
                letterSpacing: "0.3px",
              }}
            >
              {category} Services
            </div>

            {/* SUBCATEGORY */}
            {groupedData[category].map((sub, i) => (
              <div key={i} className="mt-4">
                <h5
                  style={{
                    fontWeight: "600",
                    fontSize: "22px",
                    color: "#333",
                    marginBottom: "6px",
                  }}
                >
                  {sub.subcategory_name}
                </h5>

                <hr
                  style={{
                    margin: "6px 0 12px",
                    borderColor: "#e0e0e0",
                  }}
                />

                {/* GRID */}
                <div className="row g-4">
                  {sub.services.map((service) => (
                    <Product
                      key={service.id}
                      image={service.image_url}
                      name={service.name}
                      price={service.price}
                      cutPrice={service.cutPrice || service.price + 500}
                      onClick={() => handleClick(service.id)}
                    />
                  ))}
                </div>
                <hr
                  style={{
                    margin: "6px 0 12px",
                    borderColor: "#2d2c2c",
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
