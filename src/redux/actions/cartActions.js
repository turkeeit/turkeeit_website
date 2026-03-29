import axios from "axios";
import { HOST } from "../../utils/host";

export const addToCart = (item) => async (dispatch) => {
  try {
    dispatch({ type: "CART_ADD_ITEM_REQUEST" });

    const token = localStorage.getItem("token");
    const mobileNumber = localStorage.getItem("mobile_number");

    const payload = {
      service_id: item.service_id,
      name: item.name,
      price: item.price,
      image_url: item.image_url || item.image,
      quantity: item.quantity || 1,
    };

    console.log("INSIDE ACTION");
    console.log("Sending payload:", payload);
    console.log("mobile_number:", mobileNumber);

    const res = await axios.post(`${HOST}/api/addToCart`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        mobile_number: mobileNumber,
        "Content-Type": "application/json",
      },
    });

    console.log("API RESPONSE:", res.data);

    dispatch({
      type: "CART_ADD_ITEM_SUCCESS",
      payload: res.data.cartItem,
    });

    return res.data;
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);

    dispatch({
      type: "CART_ADD_ITEM_FAIL",
      payload:
        err.response?.data?.error || err.response?.data?.message || err.message,
    });

    throw err;
  }
};

export const removeFromCart = (serviceId) => async (dispatch) => {
  try {
    dispatch({ type: "CART_REMOVE_ITEM_REQUEST" });

    const token = localStorage.getItem("token");
    const mobileNumber = localStorage.getItem("mobile_number");

    console.log("Removing service_id:", serviceId);
    console.log("mobile_number:", mobileNumber);

    const res = await axios.delete(`${HOST}/api/removeCartItem`, {
      headers: {
        Authorization: `Bearer ${token}`,
        mobile_number: mobileNumber,
        service_id: serviceId,
      },
    });

    console.log("REMOVE API RESPONSE:", res.data);

    dispatch({
      type: "CART_REMOVE_ITEM_SUCCESS",
      payload: serviceId,
    });

    return res.data;
  } catch (err) {
    console.log("REMOVE ERROR:", err.response?.data || err.message);

    dispatch({
      type: "CART_REMOVE_ITEM_FAIL",
      payload:
        err.response?.data?.error || err.response?.data?.message || err.message,
    });

    throw err;
  }
};

export const incrementCartItem = (item) => async (dispatch) => {
  try {
    dispatch({ type: "CART_UPDATE_QTY_REQUEST" });

    const token = localStorage.getItem("token");
    const mobileNumber = localStorage.getItem("mobile_number");

    const currentQty = Number(item.qty || item.quantity || 1);
    const newQty = currentQty + 1;

    const res = await axios.put(
      `${HOST}/api/editCartItem`,
      {
        service_id: item.service_id,
        quantity: newQty,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          mobile_number: mobileNumber,
          "Content-Type": "application/json",
        },
      },
    );

    dispatch({
      type: "CART_UPDATE_QTY_SUCCESS",
      payload: {
        service_id: item.service_id,
        quantity: newQty,
      },
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: "CART_UPDATE_QTY_FAIL",
      payload:
        err.response?.data?.error || err.response?.data?.message || err.message,
    });
    throw err;
  }
};

export const decrementCartItem = (item) => async (dispatch) => {
  try {
    dispatch({ type: "CART_UPDATE_QTY_REQUEST" });

    const token = localStorage.getItem("token");
    const mobileNumber = localStorage.getItem("mobile_number");

    const currentQty = Number(item.qty || item.quantity || 1);
    const newQty = currentQty - 1;

    const res = await axios.put(
      `${HOST}/api/editCartItem`,
      {
        service_id: item.service_id,
        quantity: newQty,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          mobile_number: mobileNumber,
          "Content-Type": "application/json",
        },
      },
    );

    if (newQty <= 0) {
      dispatch({
        type: "CART_REMOVE_ITEM_SUCCESS",
        payload: item.service_id,
      });
    } else {
      dispatch({
        type: "CART_UPDATE_QTY_SUCCESS",
        payload: {
          service_id: item.service_id,
          quantity: newQty,
        },
      });
    }

    return res.data;
  } catch (err) {
    dispatch({
      type: "CART_UPDATE_QTY_FAIL",
      payload:
        err.response?.data?.error || err.response?.data?.message || err.message,
    });
    throw err;
  }
};

export const clearCart = () => async (dispatch) => {
  try {
    dispatch({ type: "CART_CLEAR_REQUEST" });

    const token = localStorage.getItem("token");
    const mobileNumber = localStorage.getItem("mobile_number");

    console.log("CLEAR CART ACTION START");
    console.log("mobile_number:", mobileNumber);

    const res = await axios.delete(`${HOST}/api/removeAllCartItem`, {
      headers: {
        Authorization: `Bearer ${token}`,
        mobile_number: mobileNumber,
      },
    });

    console.log("CLEAR CART API RESPONSE:", res.data);

    dispatch({ type: "CART_CLEAR" });

    return res.data;
  } catch (err) {
    console.log("CLEAR CART ERROR:", err.response?.data || err.message);

    dispatch({
      type: "CART_CLEAR_FAIL",
      payload:
        err.response?.data?.error || err.response?.data?.message || err.message,
    });

    throw err;
  }
};

export const loadUserCart = () => ({
  type: "CART_LOAD_USER_CART",
});
