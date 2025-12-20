// redux/actions/cartActions.js

export const addToCart = (item) => ({
  type: "CART_ADD_ITEM",
  payload: item,
});

export const removeFromCart = (id) => ({
  type: "CART_REMOVE_ITEM",
  payload: id,
});

export const clearCart = () => ({
  type: "CART_CLEAR",
});
