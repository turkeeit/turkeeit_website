import { combineReducers } from "redux";
import authReducer from "./authReducer";
import servicesReducer from "./serviceReducer";
import { cartReducer } from "./cartReducer";
import { blogReducer } from "./blogReducer";
import { razorpayReducer } from "./razorpayReducer";

export default combineReducers({
  auth: authReducer,
  services: servicesReducer,
  cart: cartReducer,
  blogsData: blogReducer,
  razorpay: razorpayReducer,
});
