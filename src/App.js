import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ServiceDetails from "./pages/ServiceDetails";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import MyOrders from "./pages/MyOrders";
import CartPage from "./pages/CartPage";
import BookingSlot from "./pages/BookingSlot";
import MyOrderDetails from "./pages/MyOrderDetails";
import PaymentMethod from "./pages/PaymentMethod";
import OrderConfirmed from "./pages/OrderConfirmed";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import AdminLayout from "./admin/components/AdminLayout";
import AdminHome from "./admin/pages/AdminHome";
import UsersPage from "./admin/pages/UsersPage";
import CategoryPage from "./admin/pages/CategoryPage";
import SubcategoryPage from "./admin/pages/SubcategoryPage";
import ServicesPage from "./admin/pages/ServicesPage";
import OrdersPage from "./admin/pages/OrdersPage";
import PartnersPage from "./admin/pages/PartnersPage";
import PartnerOrdersPage from "./admin/pages/PartnerOrdersPage";
import PayoutPage from "./admin/pages/PayoutPage";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith(
    "/admin/turkeeit/dashboard",
  );

  return (
    <div className={isAdminRoute ? "" : "page-wrapper"}>
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Dashboard />} />
        <Route path="/service/details" element={<ServiceDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order/details" element={<OrderDetails />} />
        <Route path="/bookingslot" element={<BookingSlot />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/orders" element={<MyOrders />} />
        {/* Path for MyOrderDetails ??? */}
        <Route
          path="/user/order/details/:orderId"
          element={<MyOrderDetails />}
        />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blog-details/:id" element={<BlogDetailsPage />} />
        <Route path="/payment-method" element={<PaymentMethod />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />

        {/* ✅ NEW ADMIN ROUTES */}
        <Route path="/admin/turkeeit/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="subcategory" element={<SubcategoryPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="partner-orders" element={<PartnerOrdersPage />} />
          <Route path="payout" element={<PayoutPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
