const initialState = {
  blogs: [],
  blogDetails: {},
  loading: false,
  error: null,
};

export const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_BLOGS_REQUEST":
    case "GET_BLOG_DETAILS_REQUEST":
      return { ...state, loading: true, error: null };

    case "GET_BLOGS_SUCCESS":
      return { ...state, loading: false, blogs: action.payload };

    case "GET_BLOG_DETAILS_SUCCESS":
      return { ...state, loading: false, blogDetails: action.payload };

    case "GET_BLOGS_ERROR":
    case "GET_BLOG_DETAILS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
