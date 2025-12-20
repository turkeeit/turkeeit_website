const initialState = {
  loading: false,
  services: [],
  error: null,
};

const servicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SELECTED_SERVICE":
      return { ...state, selectedServiceId: action.payload };
    case "GET_SERVICE_DETAILS_REQUEST":
      return { ...state, loading: true };

    case "GET_SERVICE_DETAILS_SUCCESS":
      return { ...state, loading: false, serviceDetails: action.payload };

    case "GET_SERVICE_DETAILS_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "GET_ALL_SERVICES_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "GET_ALL_SERVICES_SUCCESS":
      return {
        ...state,
        loading: false,
        services: action.payload, // 👈 data stored here
      };

    case "GET_ALL_SERVICES_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default servicesReducer;
