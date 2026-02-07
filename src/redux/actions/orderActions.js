import axios from "axios";
import { HOST } from "../../utils/host";

export const getUserOrders = (token) => async (dispatch) => {
  try {
    dispatch({ type: "ORDERS_REQUEST" });

    const res = await axios.get(`${HOST}/api/getAllOrders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({
      type: "ORDERS_SUCCESS",
      payload: res.data,
    });
    console.log("get orders response", res.data);
    dispatch({
      type: "ORDERS_SUCCESS",
      payload: res.data.order_list, // ✅ FIX HERE
    });
  } catch (err) {
    dispatch({ type: "ORDERS_FAIL" });
  }
};
