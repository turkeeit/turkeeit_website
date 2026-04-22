import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-12 col-md-3 col-lg-2 bg-dark text-white p-0">
          <Sidebar />
        </div>

        <div className="col-12 col-md-9 col-lg-10 bg-light px-4 pt-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
