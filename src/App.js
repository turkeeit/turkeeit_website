import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ServiceDetails from "./pages/ServiceDetails";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/service/details" element={<ServiceDetails />} />
      <Route path="/order/details" element={<OrderDetails />} />
      <Route path="/user/profile" element={<Profile />} />
      <Route path="/blogs" element={<BlogPage />} />
      <Route path="/blog-details/:id" element={<BlogDetailsPage />} />
    </Routes>
  );
}

export default App;
