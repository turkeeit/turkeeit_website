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
      payload: err?.response?.data?.error || err.message,
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
      payload: err?.response?.data?.error || err.message,
    });
  }
};

// ================= CREATE ORDER =================
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: "CREATE_ORDER_REQUEST" });

    const token = localStorage.getItem("token");
    const mobile_number = localStorage.getItem("mobile_number");

    const res = await axios.post(`${HOST}/api/createOrder`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        mobile_number,
        "Content-Type": "application/json",
      },
    });

    console.log("create order response", res.data);

    dispatch({
      type: "CREATE_ORDER_SUCCESS",
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: "CREATE_ORDER_FAIL",
      payload: err?.response?.data?.error || err.message,
    });

    throw err;
  }
};

// ================= UPDATE ORDER STATUS =================
export const updateOrderStatus = (updateData) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_ORDER_STATUS_REQUEST" });

    const token = localStorage.getItem("token");
    const mobile_number = localStorage.getItem("mobile_number");

    console.log("updateOrderStatus payload", updateData);

    const res = await axios.put(`${HOST}/api/updateOrderStatus`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        mobile_number,
        "Content-Type": "application/json",
      },
    });

    console.log("update order status response", res.data);

    dispatch({
      type: "UPDATE_ORDER_STATUS_SUCCESS",
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: "UPDATE_ORDER_STATUS_FAIL",
      payload: err?.response?.data?.error || err.message,
    });

    throw err;
  }
};

// ================= CLEAR ORDER STATE =================
export const clearOrderState = () => {
  return {
    type: "CLEAR_ORDER_STATE",
  };
};
