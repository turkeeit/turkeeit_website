import { HOST } from "../../utils/host";
import api from "../../api/axiosClient";

export const createOrder = (cartItems, address, total) => async (dispatch) => {
  try {
    dispatch({ type: "CREATE_ORDER_REQUEST" });

    const token = localStorage.getItem("token");
    const mobileNumber = localStorage.getItem("mobile_number");

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
          mobile_number: mobileNumber,
        },
      },
    );

    dispatch({
      type: "CREATE_ORDER_SUCCESS",
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: "CREATE_ORDER_FAIL",
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

export const createRazorpayOrder = (amount) => async (dispatch) => {
  try {
    dispatch({ type: "RAZORPAY_ORDER_REQUEST" });

    const token = localStorage.getItem("token");
    const mobileNumber = localStorage.getItem("mobile_number");

    const res = await api.post(
      `${HOST}/api/createOrder`,
      { amount: amount * 100 },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          mobile_number: mobileNumber,
        },
      },
    );

    dispatch({ type: "RAZORPAY_ORDER_SUCCESS", payload: res.data });
    return res.data;
  } catch (err) {
    dispatch({
      type: "RAZORPAY_ORDER_FAIL",
      payload: err.response?.data?.error || err.message,
    });
    throw err;
  }
};

export const verifyPaymentSignature = (paymentData) => async () => {
  const token = localStorage.getItem("token");
  const mobileNumber = localStorage.getItem("mobile_number");

  const response = await api.post(`${HOST}/api/verify-signature`, paymentData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      mobile_number: mobileNumber,
    },
  });

  return response.data;
};

export const updateOrderStatus =
  (orderId, razorpayOrderId, paymentId, status, mode = "Online") =>
  async (dispatch) => {
    try {
      dispatch({ type: "SAVE_ORDER_REQUEST" });

      const token = localStorage.getItem("token");
      const mobileNumber = localStorage.getItem("mobile_number");

      await api.put(
        `${HOST}/api/updateOrderStatus`,
        {
          order_id: orderId,
          razorpay_id: razorpayOrderId,
          payment_id: paymentId,
          status: status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            mobile_number: mobileNumber,
            modeofpayment: mode,
          },
        },
      );

      dispatch({ type: "SAVE_ORDER_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "SAVE_ORDER_FAIL",
        payload: err.response?.data?.error || err.message,
      });
      throw err;
    }
  };
