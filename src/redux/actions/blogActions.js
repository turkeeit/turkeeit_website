import { HOST } from "../../utils/host";
import api from "../../api/axiosClient";

export const getAllBlogs = () => {
  return async (dispatch) => {
    dispatch({ type: "GET_BLOGS_REQUEST" });

    try {
      const res = await api.get(`${HOST}/api/blogs`);

      dispatch({
        type: "GET_BLOGS_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "GET_BLOGS_ERROR",
        payload: err.message,
      });
    }
  };
};

export const getBlogById = (blogId) => {
  return async (dispatch) => {
    dispatch({ type: "GET_BLOG_DETAILS_REQUEST" });

    try {
      const res = await api.get(`${HOST}/api/blogs/${blogId}`);
      console.log("Blog Details Response:", res.data);

      dispatch({
        type: "GET_BLOG_DETAILS_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "GET_BLOG_DETAILS_ERROR",
        payload: err.message,
      });
    }
  };
};
