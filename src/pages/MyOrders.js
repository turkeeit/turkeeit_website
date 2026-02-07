import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../redux/actions/orderActions";

export default function MyOrders() {
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(getUserOrders(token));
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PAID":
        return "bg-warning";
      case "CONFIRMED":
        return "bg-primary";
      case "COMPLETED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <>
      <Header />

      <div className="container mt-4">
        <h4 className="mb-4">My Orders</h4>

        {loading && <p>Loading orders...</p>}

        {!loading && orders?.length === 0 && <p>No orders found</p>}

        <div className="row">
          {orders?.map((order) => (
            <div className="col-md-6 mb-3" key={order.id}>
              <div className="card shadow-sm p-3">
                <h6 className="fw-bold">Order ID: {order.order_id}</h6>

                <p className="mb-1">
                  <b>Amount:</b> ₹{order.total_price}
                </p>

                <p className="mb-1">
                  <b>Address:</b> {order.address}
                </p>

                <p className="mb-1">
                  <b>Date:</b> {new Date(order.created_at).toLocaleString()}
                </p>

                <p className="mb-1">
                  <b>Payment ID:</b> {order.payment_id}
                </p>

                <p className="mb-1">
                  <b>Status:</b>{" "}
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </p>

                <hr />

                <h6>Services</h6>

                {order.order_items?.map((item, i) => (
                  <div key={i} className="small d-flex justify-content-between">
                    <span>{item.service_name || item.name}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
