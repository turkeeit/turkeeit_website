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
      {},
      {
        headers: {
          mobilenumber: mobile,
        },
      },
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
        {},
        {
          headers: {
            mobilenumber: mobile,
            otp: otp,
          },
        },
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("mobile_number", mobile); // ✅ important for cart/profile restore

      console.log("OTP verified, token received:", res.data.token);

      dispatch({
        type: "VERIFY_OTP_SUCCESS",
        payload: res.data.token,
      });
    } catch (err) {
      dispatch({
        type: "API_ERROR",
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};

// Get User Details
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
      console.log("User received:", res.data.user);

      dispatch({
        type: "GET_USER_DETAILS_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "GET_USER_DETAILS_FAIL",
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};

// Restore login from localStorage
export const checkAlreadyLoggedIn = () => (dispatch) => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  let parsedUser = null;

  try {
    parsedUser = savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    parsedUser = null;
  }

  if (token) {
    dispatch({
      type: "LOGIN_RESTORE",
      payload: {
        token,
        user: parsedUser,
      },
    });
  }
};

// Logout
export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("mobile_number"); // ✅ clear mobile also

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
      },
    );

    console.log("Update Profile Response Data:", data);

    dispatch(getUserDetails(token));

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
