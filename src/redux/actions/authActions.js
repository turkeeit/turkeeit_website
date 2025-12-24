import api from "../../api/axiosClient";
import { HOST } from "../../utils/host";

// Send OTP
export const sendOtp = (mobile) => async (dispatch) => {
  try {
    dispatch({ type: "SEND_OTP_REQUEST" });
    console.log("Sending OTP to mobile number:", mobile);
    console.log(`${HOST}/api/sendOtp`);
    await api.post(
      `${HOST}/api/sendOtp`,
      {
        mobile_number: mobile,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({ type: "SEND_OTP_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "OTP_FAIL",
      payload: error.response?.data?.message || "OTP failed",
    });
  }
};

// Verify OTP
export const verifyOtp = (mobile, otp) => {
  console.log(mobile, otp);
  return async (dispatch) => {
    try {
      const res = await api.post(
        `${HOST}/api/verifyOtp`,
        {
          mobile_number: mobile,
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", res.data.token);
      console.log("OTP verified, token received:", res.data.token);
      dispatch({ type: "VERIFY_OTP_SUCCESS", payload: res.data.token });
    } catch (err) {
      dispatch({ type: "API_ERROR", payload: err.message });
    }
  };
};

// Verify OTP
export const getUserDetails = (token) => {
  console.log("get user details with token:", token);
  return async (dispatch) => {
    try {
      const res = await api.get(`${HOST}/api/getUserDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      console.log("OTP verified, user received:", res.data.user);
      dispatch({ type: "GET_USER_DETAILS_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "GET_USER_DETAILS_FAIL", payload: err.message });
    }
  };
};

export const checkAlreadyLoggedIn = () => (dispatch) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token) {
    dispatch({
      type: "LOGIN_RESTORE",
      payload: {
        token,
        user: user ? user : null,
      },
    });
  }
};

//logout
export const logout = () => (dispatch) => {
  // Clear storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  dispatch({ type: "LOGOUT" });
};

export const updateUserProfile = (profileData) => async (dispatch) => {
  console.log("Updating user profile with data:", profileData);
  try {
    dispatch({ type: "UPDATE_PROFILE_REQUEST" });

    const token = localStorage.getItem("token");

    const { data } = await api.put(
      `${HOST}/api/updateUserDetails`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Update Profile Response Data:", data);
    dispatch({
      type: "UPDATE_PROFILE_SUCCESS",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "UPDATE_PROFILE_FAIL",
      payload: error.response?.data?.message || "Profile update failed",
    });
  }
};
