import axios from "axios";
import { HOST } from "../../utils/host";

export const getUserOrders = (token) => async (dispatch) => {
  try {
    dispatch({ type: "ORDERS_REQUEST" });

    const res = await axios.get(`${HOST}/api/getAllOrders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("get orders response", res.data);

    dispatch({
      type: "ORDERS_SUCCESS",
      payload: res.data.order_list || [], // ✅ fixed
    });
  } catch (err) {
    dispatch({
      type: "ORDERS_FAIL",
      payload: err.message,
    });
  }
};

// ✅ NEW ACTION (IMPORTANT)
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
      payload: res.data.order, // ✅ important
    });
  } catch (err) {
    dispatch({
      type: "ORDER_DETAILS_FAIL",
      payload: err.message,
    });
  }
};
