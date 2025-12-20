import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ServiceDetails from "./pages/ServiceDetails";
import OrderDetails from "./pages/OrderDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/service/details" element={<ServiceDetails />} />
        <Route path="/order/details" element={<OrderDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
