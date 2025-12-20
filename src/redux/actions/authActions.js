import api from "../../api/axiosClient";

// Send OTP
export const sendOtp = (phone) => {
  return async (dispatch) => {
    dispatch({ type: "SEND_OTP_REQUEST" });
    try {
      await api.post("/auth/send-otp", { phone });
      dispatch({ type: "SEND_OTP_SUCCESS" });
    } catch (err) {
      dispatch({ type: "API_ERROR", payload: err.message });
    }
  };
};

// Verify OTP
export const verifyOtp = (data) => {
  return async (dispatch) => {
    try {
      const res = await api.post("/auth/verify-otp", data);
      dispatch({ type: "VERIFY_OTP_SUCCESS", payload: res.data.user });
    } catch (err) {
      dispatch({ type: "API_ERROR", payload: err.message });
    }
  };
};
