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
    <div style={{ background: "#fff" }}>
      <Header />

      {/* ✅ MINIMUM SIDE SPACING */}
      <div
        style={{
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {Object.keys(groupedData).map((category, index) => (
          <div key={index} className="mb-3">
            {/* CATEGORY */}
            <div
              style={{
                background: "#f5d36b",
                padding: "4px 8px",
                fontWeight: "600",
                borderRadius: "4px",
                fontSize: "12px",
                display: "inline-block",
              }}
            >
              {category} Services
            </div>

            {/* SUBCATEGORY */}
            {groupedData[category].map((sub, i) => (
              <div key={i} className="mt-2">
                <h6 style={{ fontSize: "12px", fontWeight: "600" }}>
                  {sub.subcategory_name}
                </h6>

                <hr style={{ margin: "4px 0 8px" }} />

                {/* GRID */}
                <div className="row g-2">
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
              </div>
            ))}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
