import { useEffect, useState } from "react";
import { API } from "../../utils/host";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalPartners: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const [usersRes, categoriesRes, ordersRes, partnersRes] =
        await Promise.all([
          fetch(API.GET_ALL_USERS),
          fetch(API.GET_ALL_CATEGORIES),
          fetch(API.GET_ALL_ORDERS),
          fetch(API.GET_ALL_PARTNERS),
        ]);

      const [usersData, categoriesData, ordersData, partnersData] =
        await Promise.all([
          usersRes.json(),
          categoriesRes.json(),
          ordersRes.json(),
          partnersRes.json(),
        ]);

      console.log("Users response:", usersData);
      console.log("Categories response:", categoriesData);
      console.log("Orders response:", ordersData);
      console.log("Partners response:", partnersData);

      setStats({
        totalUsers: (usersData.user_list || usersData.users || []).length,
        totalCategories: (categoriesData.category || []).length,
        totalOrders: (ordersData.order_list || []).length,
        totalPartners: (partnersData.partners_list || []).length,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setStats({
        totalUsers: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalPartners: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Welcome back to the admin panel</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Users</h6>
              <h3 className="mb-0">{loading ? "..." : stats.totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Categories</h6>
              <h3 className="mb-0">
                {loading ? "..." : stats.totalCategories}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Orders</h6>
              <h3 className="mb-0">{loading ? "..." : stats.totalOrders}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Partners</h6>
              <h3 className="mb-0">{loading ? "..." : stats.totalPartners}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body py-5 text-center">
          <h4 className="mb-2">Welcome to Turkeeit Admin Dashboard</h4>
          <p className="text-muted mb-0">
            Manage users, categories, services, orders, partners, and payouts
            from here.
          </p>
        </div>
      </div>
    </div>
  );
}
