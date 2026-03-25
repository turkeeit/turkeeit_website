const initialState = {
  phone: "",
  user: null,
  token: localStorage.getItem("token"),
  user: null,
  loading: false,
  error: null,
  otpSent: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SEND_OTP_REQUEST":
      return { ...state, loading: true };

    case "SEND_OTP_SUCCESS":
      return { ...state, loading: false, otpSent: true };

    case "VERIFY_OTP_SUCCESS":
      return {
        ...state,
        loading: false,
        otpVerified: true,
        token: action.payload,
      };
    case "GET_USER_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
      };
    case "GET_USER_DETAILS_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "LOGIN_RESTORE":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        otpVerified: true,
      };
    case "LOGOUT":
      return {
        ...initialState,
        token: null,
        user: null,
        error: null,
      };
    case "UPDATE_PROFILE_REQUEST":
      return { ...state, loading: true };

    case "UPDATE_PROFILE_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload, // updated user
      };

    case "UPDATE_PROFILE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "API_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default authReducer;
