import { combineReducers } from "redux";
import authReducer from "./authReducer";
import servicesReducer from "./serviceReducer";
import { cartReducer } from "./cartReducer";

export default combineReducers({
  auth: authReducer,
  services: servicesReducer,
  cart: cartReducer,
});
