import Footer from "../components/Footer";
import Header from "../components/Header";
import Product from "../components/Product";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllServices } from "../redux/actions/serviceActions";

export default function Dashboard() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { loading, services, error } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(getAllServices(token));
  }, [dispatch, token]);

  // 🔥 Group by category
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <Header />

      {/* 🔥 CATEGORY LOOP */}
      {Object.keys(groupedData).map((category, index) => (
        <div key={index} className="px-3 mt-4">
          {/* ✅ CATEGORY TITLE */}
          <div
            style={{
              background: "#f5d36b",
              padding: "10px",
              fontWeight: "600",
              width: "250px",
              borderRadius: "4px",
            }}
          >
            {category} Services
          </div>

          {/* 🔥 SUBCATEGORY LOOP */}
          {groupedData[category].map((sub, i) => (
            <div key={i} className="mt-4">
              {/* ✅ SUBCATEGORY TITLE */}
              <h5 className="fw-semibold mb-2">{sub.subcategory_name}</h5>

              <hr />

              {/* ✅ SERVICES GRID */}
              <div className="row">
                {sub.services.map((service) => (
                  <Product
                    key={service.id}
                    image={service.image_url}
                    name={service.name}
                    price={service.price}
                    cutPrice={service.cutPrice || service.price + 500}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <Footer />
    </div>
  );
}
