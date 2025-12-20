const initialState = {
  phone: "",
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
      return { ...state, loading: false, user: action.payload };

    case "API_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default authReducer;
