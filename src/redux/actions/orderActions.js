import axios from "axios";
import { HOST } from "../../utils/host";

// ================= GET ALL ORDERS =================
export const getUserOrders = (token) => async (dispatch) => {
  try {
    dispatch({ type: "ORDERS_REQUEST" });

    const res = await axios.get(`${HOST}/api/getAllOrders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("get orders response", res.data);

    dispatch({
      type: "ORDERS_SUCCESS",
      payload: res.data.order_list || [],
    });
  } catch (err) {
    dispatch({
      type: "ORDERS_FAIL",
      payload: err.message,
    });
  }
};

// ================= GET ORDER DETAILS =================
export const getOrderDetails = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: "ORDER_DETAILS_REQUEST" });

    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${HOST}/api/getOrderDetails?order_id=${orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log("order details response", res.data);

    dispatch({
      type: "ORDER_DETAILS_SUCCESS",
      payload: res.data.order,
    });
  } catch (err) {
    dispatch({
      type: "ORDER_DETAILS_FAIL",
      payload: err.message,
    });
  }
};

// ================= CREATE ORDER (🔥 NEW IMPORTANT) =================
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: "CREATE_ORDER_REQUEST" });

    const token = localStorage.getItem("token");
    const mobile_number = localStorage.getItem("mobile_number");

    const res = await axios.post(`${HOST}/api/createOrder`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        mobile_number,
      },
    });

    console.log("create order response", res.data);

    dispatch({
      type: "CREATE_ORDER_SUCCESS",
      payload: res.data,
    });

    return res.data; // 👈 IMPORTANT (PaymentMethod me use karenge)
  } catch (err) {
    dispatch({
      type: "CREATE_ORDER_FAIL",
      payload: err?.response?.data?.error || err.message,
    });

    throw err; // 👈 IMPORTANT (error handle karne ke liye)
  }
};

// ================= CLEAR ORDER STATE =================
export const clearOrderState = () => {
  return {
    type: "CLEAR_ORDER_STATE",
  };
};
