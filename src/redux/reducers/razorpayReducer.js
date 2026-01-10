const initialState = {
  loading: false,
  order: null,
  error: null,
  saved: false,
};

export const razorpayReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RAZORPAY_ORDER_REQUEST":
      return { ...state, loading: true };

    case "RAZORPAY_ORDER_SUCCESS":
      return { loading: false, order: action.payload, error: null };

    case "RAZORPAY_ORDER_FAIL":
      return { loading: false, order: null, error: action.payload };

    case "SAVE_ORDER_REQUEST":
      return { ...state, loading: true };

    case "SAVE_ORDER_SUCCESS":
      return { ...state, loading: false, saved: true };

    case "SAVE_ORDER_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
