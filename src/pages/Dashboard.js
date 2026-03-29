import Footer from "../components/Footer";
import Header from "../components/Header";
import Product from "../components/Product";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllServices } from "../redux/actions/serviceActions";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();

  const token = localStorage.getItem("token");

  const { loading, services, error } = useSelector((state) => state.services);

  // scroll and navigate
  useEffect(() => {
    const categoryId = location.state?.scrollToCategory;

    if (categoryId) {
      setTimeout(() => {
        const element = document.getElementById(categoryId);

        if (element) {
          const headerOffset = 140;
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 300);
    }
  }, [location]);

  useEffect(() => {
    dispatch(getAllServices(token));
  }, [dispatch, token]);

  // 🔥 IMPORTANT: ID generator
  const getCategoryId = (categoryName = "") => {
    return `category-${categoryName.trim().toLowerCase().replace(/\s+/g, "-")}`;
  };

  const handleClick = (serviceId) => {
    dispatch({
      type: "SET_SELECTED_SERVICE",
      payload: serviceId,
    });
    localStorage.setItem("selectedServiceId", serviceId);
    navigate("/service/details");
  };

  const filteredServices = useMemo(() => {
    if (!services) return [];

    if (!searchQuery) return services;

    return services.filter((item) => {
      const categoryName = item.category_name?.toLowerCase() || "";
      const subcategoryName = item.subcategory_name?.toLowerCase() || "";
      const serviceNames =
        item.services?.map((service) => service.name?.toLowerCase() || "") ||
        [];

      return (
        categoryName.includes(searchQuery) ||
        subcategoryName.includes(searchQuery) ||
        serviceNames.some((name) => name.includes(searchQuery))
      );
    });
  }, [services, searchQuery]);

  const groupedData = useMemo(() => {
    const result = {};

    filteredServices.forEach((item) => {
      const categoryName = item.category_name?.trim();
      if (!categoryName) return;

      if (!result[categoryName]) {
        result[categoryName] = [];
      }

      result[categoryName].push(item);
    });

    return result;
  }, [filteredServices]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <>
      <Header />
      <div
        className="container-fluid py-4 px-md-5 mt-1"
        // style={{
        //   width: "100%",
        //   maxWidth: "1500px",
        //   margin: "10 auto",
        //   padding: "20px 12px",
        // }}
      >
        {searchQuery && Object.keys(groupedData).length === 0 && (
          <div className="text-center py-5">
            <h4 style={{ color: "#333" }}>No services found</h4>
            <p style={{ color: "#666" }}>
              Try searching with another service, category, or subcategory name.
            </p>
          </div>
        )}

        {Object.keys(groupedData).map((category, index) => (
          <div
            key={index}
            id={getCategoryId(category)}
            className="mb-2"
            style={{
              scrollMarginTop: "150px",
              paddingTop: "6px",
            }}
          >
            {/* CATEGORY */}
            <div
              style={{
                background: "#f4bf00",
                padding: "6px 12px",
                fontWeight: "600",
                borderRadius: "6px",
                fontSize: "18px",
                display: "inline-block",
                color: "#3e3d3d",
                letterSpacing: "0.3px",
              }}
            >
              {category} Services
            </div>

            {/* SUBCATEGORY */}
            {groupedData[category].map((sub, i) => (
              <div key={i} className="mt-3">
                <h5
                  style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "#333",
                    marginBottom: "6px",
                  }}
                >
                  {sub.subcategory_name}
                </h5>

                <hr style={{ margin: "6px 0 12px" }} />

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

                <hr style={{ margin: "6px 0 12px" }} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}
