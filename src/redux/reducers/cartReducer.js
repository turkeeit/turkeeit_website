// redux/reducers/cartReducer.js

const initialState = {
  items: [], // [{ id, name, price, image, qty }]
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      console.log("cart item added reducer");
      console.log(state.items);
      const exists = state.items.find(
        (item) => item.service_id === action.payload.service_id
      );

      if (exists) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.service_id === action.payload.service_id
              ? { ...item, qty: item.qty + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: 1 }],
      };
    }

    case "CART_REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.service_id !== action.payload),
      };

    case "CART_CLEAR":
      return initialState;

    default:
      return state;
  }
};
