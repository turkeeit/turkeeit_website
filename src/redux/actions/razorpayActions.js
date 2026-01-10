import { HOST } from "../../utils/host";
import api from "../../api/axiosClient";

export const createOrder = (cartItems, address, total) => async (dispatch) => {
  try {
    dispatch({ type: "CREATE_ORDER_REQUEST" });
    console.log("inside order create action");
    console.log(cartItems, address, total);
    const token = localStorage.getItem("token");
    console.log(`${HOST}/api/createOrder`);
    const response = await api.post(
      `${HOST}/api/createOrder`,
      {
        cart_items: cartItems,
        address: address,
        total_price: total,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({
      type: "CREATE_ORDER_SUCCESS",
      payload: response.data,
    });
    console.log(`create order api call response`, response.data);
    return response.data;
  } catch (error) {
    dispatch({
      type: "CREATE_ORDER_FAIL",
      payload: error.message,
    });
  }
};
export const createRazorpayOrder = (amount) => async (dispatch) => {
  try {
    dispatch({ type: "RAZORPAY_ORDER_REQUEST" });

    const token = localStorage.getItem("token");

    const res = await fetch(`${HOST}/api/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: amount * 100 }),
    });

    const data = await res.json();

    dispatch({ type: "RAZORPAY_ORDER_SUCCESS", payload: data });
    return data;
  } catch (err) {
    dispatch({ type: "RAZORPAY_ORDER_FAIL", payload: err.message });
  }
};

export const updateOrderStatus =
  (orderId, razorpayOrderId, paymentId, status) => async (dispatch) => {
    try {
      console.log(
        `orderId = ${orderId}, razorpayOrderId=${razorpayOrderId},  paymentId=${paymentId}, status=${status}`
      );
      dispatch({ type: "SAVE_ORDER_REQUEST" });

      const token = localStorage.getItem("token");

      const response = await api.put(
        `${HOST}/api/updateOrderStatus`,
        {
          order_id: orderId,
          razorpay_id: razorpayOrderId,
          payment_id: paymentId,
          status: status,
          mode_of_payment: "Online",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("order update respo[nse", response);
      dispatch({ type: "SAVE_ORDER_SUCCESS" });
    } catch (err) {
      dispatch({ type: "SAVE_ORDER_FAIL", payload: err.message });
    }
  };
