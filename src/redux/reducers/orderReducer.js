const initialState = {
  orders: [],
  loading: false,
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ORDERS_REQUEST":
      return { ...state, loading: true };

    case "ORDERS_SUCCESS":
      return {
        loading: false,
        orders: action.payload,
      };

    case "ORDERS_FAIL":
      return { ...state, loading: false };

    default:
      return state;
  }
};
