import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductSlider from "../components/ProductSlider";
import CarouselComponent from "./../components/CarouselComponent";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllServices } from "../redux/actions/serviceActions";
import { CATEGORY_MAP } from "./../utils/CATEGORY_MAP";
import { groupServicesByCategory } from "../utils/groupServicesByCategory";

export default function Dashboard() {
  const dispatch = useDispatch();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGVfbnVtYmVyIjoiOTg2NzMxNTM2MSIsImlhdCI6MTc2NjA1MzAyOSwiZXhwIjoxNzczODI5MDI5fQ.xl29SDnHJVDUzK6MgFV8kSypzCcFn19DH2M0C61gQUg";
  const { loading, services, error } = useSelector((state) => state.services);
  console.log("Services from Redux:", services);
  useEffect(() => {
    dispatch(getAllServices(token));
  }, [dispatch, token]);
  const groupedServices = useMemo(
    () => groupServicesByCategory(services.services),
    [services]
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <Header />
      {Object.values(groupedServices).map((category) => (
        <ProductSlider
          key={category.categoryId}
          title={CATEGORY_MAP[category.categoryId]}
          services={category.services}
        />
      ))}
      <Footer />
    </div>
  );
}
