// export const HOST = "https://turkeeit.info";
export const HOST = "http://localhost:5000";
export const RAZORPAY_KEY = "rzp_test_ZUC1pptTxiGooR";
export const CURRENCY = "INR";
export const BRAND_NAME = "Turkeeit Services";
export const DESCRIPTION = "Order Payment";
export const RAZORPAY_PAID_STATUS = "PAID";

// all API endpoints here
export const API = {
  // users
  GET_ALL_USERS: `${HOST}/api/admin/getAllUsers`,
  EDIT_USER: `${HOST}/api/admin/editUser`,
  DELETE_USER: `${HOST}/api/admin/removeUser`,
  ADD_USER: `${HOST}/api/admin/addUser`,

  // categories
  ADD_CATEGORY: `${HOST}/api/admin/addCategory`,
  GET_ALL_CATEGORIES: `${HOST}/api/admin/getAllCategories`,
  GET_CATEGORY_DETAILS: `${HOST}/api/admin/getCategoryDetails`,
  EDIT_CATEGORY: `${HOST}/api/admin/editCategory`,

  // subcategory
  ADD_SUBCATEGORY: `${HOST}/api/admin/addSubcategory`,
  GET_ALL_SUBCATEGORIES: `${HOST}/api/admin/getAllSubcategories`,
  GET_SUBCATEGORY_DETAILS: `${HOST}/api/admin/getSubcategoryDetails`,
  EDIT_SUBCATEGORY: `${HOST}/api/admin/editSubcategory`,

  // services
  GET_ALL_SERVICES: `${HOST}/api/admin/getAllServices`,
  ADD_SERVICE: `${HOST}/api/admin/addService`,
  EDIT_SERVICE: `${HOST}/api/admin/editService`,
  DELETE_SERVICE: `${HOST}/api/admin/removeService`,
  GET_SERVICE_DETAILS: `${HOST}/api/admin/getServiceDetails`,

  // service addons
  GET_ALL_SERVICE_ADDONS: `${HOST}/api/admin/service-addon/list`,
  GET_SERVICE_ADDONS_BY_MAIN_SERVICE: `${HOST}/api/admin/service-addon/by-main-service`,
  ADD_SERVICE_ADDON: `${HOST}/api/admin/service-addon/add`,
  DELETE_SERVICE_ADDON: `${HOST}/api/admin/service-addon/remove`,

  // orders
  GET_ALL_ORDERS: `${HOST}/api/admin/getAllOrders`,
  GET_ORDER_DETAILS: `${HOST}/api/admin/getOrderDetails`,
  ASSIGN_PARTNER_TO_ORDER: `${HOST}/api/admin/partner/assinged/order`,

  // partners
  GET_ALL_PARTNERS: `${HOST}/api/admin/partner/list`,
  ADD_PARTNER: `${HOST}/api/admin/partner/add`,
  EDIT_PARTNER: `${HOST}/api/admin/updatePartner`,
  DELETE_PARTNER: `${HOST}/api/admin/removePartner`,
  GET_PARTNER_DETAILS: `${HOST}/api/admin/getPartnerDetails`,

  // partner orders
  GET_ALL_PARTNER_ORDERS: `${HOST}/api/admin/partner/assinged/getAllOrders`,
  GET_PARTNER_ORDER_DETAILS: `${HOST}/api/admin/getPartnerOrderDetails`,
  DELETE_PARTNER_ORDER: `${HOST}/api/admin/partner/removePartnerOrder`,

  // payouts
  CREATE_PAYOUT: `${HOST}/api/admin/payout/create`,
  GET_ALL_PAYOUTS: `${HOST}/api/admin/payout/list`,
  GET_PAYOUT_DETAILS: `${HOST}/api/admin/payout/details`,
  MARK_PAYOUT_PAID: `${HOST}/api/admin/payout/markPaid`,
};
