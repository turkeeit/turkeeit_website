import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
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

function App() {
  return (
    <div className="page-wrapper">
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
        <Route path="/user/orders/:orderId" element={<MyOrderDetails />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blog-details/:id" element={<BlogDetailsPage />} />
        <Route path="/payment-method" element={<PaymentMethod />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
      </Routes>
    </div>
  );
}

export default App;
