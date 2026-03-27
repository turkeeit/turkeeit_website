const initialState = {
  orders: [],
  orderDetails: null,
  order: null, // ✅ new
  success: false, // ✅ new
  loading: false,
  error: null,
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ORDERS_REQUEST":
    case "ORDER_DETAILS_REQUEST":
    case "CREATE_ORDER_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
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

    case "CREATE_ORDER_SUCCESS":
      return {
        ...state,
        loading: false,
        order: action.payload,
        success: true,
      };

    case "ORDERS_FAIL":
    case "ORDER_DETAILS_FAIL":
    case "CREATE_ORDER_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    case "CLEAR_ORDER_STATE":
      return {
        ...state,
        loading: false,
        error: null,
        success: false,
        order: null,
      };

    default:
      return state;
  }
};
