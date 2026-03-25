const initialState = {
  orders: [],
  orderDetails: null, // ✅ added
  loading: false,
  error: null,
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ORDERS_REQUEST":
    case "ORDER_DETAILS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "ORDERS_SUCCESS":
      return {
        ...state,
        loading: false,
        orders: action.payload,
      };

    case "ORDER_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        orderDetails: action.payload,
      };

    case "ORDERS_FAIL":
    case "ORDER_DETAILS_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
