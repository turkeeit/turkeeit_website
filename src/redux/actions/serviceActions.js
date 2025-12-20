import api from "../../api/axiosClient";

// Send OTP
export const getAllServices = (token) => {
  return async (dispatch) => {
    dispatch({ type: "GET_ALL_SERVICES_REQUEST" });
    try {
      const response = await api.get(
        "http://139.59.58.233:3000/api/getAllServices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);
      dispatch({
        type: "GET_ALL_SERVICES_SUCCESS",
        payload: response.data, // 👈 API response here
      });
    } catch (err) {
      dispatch({
        type: "GET_ALL_SERVICES_ERROR",
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};

//get service details by id

export const getServiceDetails = (serviceId, token) => {
  return async (dispatch) => {
    dispatch({ type: "GET_SERVICE_DETAILS_REQUEST" });

    try {
      const res = await api.get(
        "http://139.59.58.233:3000/api/getServiceDetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            service_id: serviceId, // 👈 HEADER
          },
        }
      );

      dispatch({
        type: "GET_SERVICE_DETAILS_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "GET_SERVICE_DETAILS_ERROR",
        payload: err.message,
      });
    }
  };
};
