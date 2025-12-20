// redux/reducers/cartReducer.js

const initialState = {
  items: [], // [{ id, name, price, image, qty }]
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const exists = state.items.find((item) => item.id === action.payload.id);

      if (exists) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
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
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "CART_CLEAR":
      return initialState;

    default:
      return state;
  }
};
