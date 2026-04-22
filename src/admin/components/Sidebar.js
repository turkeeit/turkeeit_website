import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `nav-link px-3 py-2 rounded mb-2 ${
      isActive ? "bg-primary text-white" : "text-white-50"
    }`;

  return (
    <div className="d-flex flex-column h-100 p-3">
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Turkeeit</h3>
        <small className="text-white-50">Admin Panel</small>
      </div>

      <nav className="nav flex-column">
        <NavLink to="/admin/turkeeit/dashboard" end className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/turkeeit/dashboard/users" className={linkClass}>
          Users
        </NavLink>

        <NavLink to="/admin/turkeeit/dashboard/category" className={linkClass}>
          Category
        </NavLink>

        <NavLink
          to="/admin/turkeeit/dashboard/subcategory"
          className={linkClass}
        >
          Subcategory
        </NavLink>

        <NavLink to="/admin/turkeeit/dashboard/services" className={linkClass}>
          Services
        </NavLink>

        <NavLink to="/admin/turkeeit/dashboard/orders" className={linkClass}>
          Order List
        </NavLink>

        <NavLink to="/admin/turkeeit/dashboard/partners" className={linkClass}>
          Partners
        </NavLink>

        <NavLink
          to="/admin/turkeeit/dashboard/partner-orders"
          className={linkClass}
        >
          Partner Orders
        </NavLink>

        <NavLink to="/admin/turkeeit/dashboard/payout" className={linkClass}>
          Payout
        </NavLink>
      </nav>
    </div>
  );
}
