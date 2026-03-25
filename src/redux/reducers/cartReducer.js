const getCurrentUserId = () => {
  try {
    return (
      localStorage.getItem("mobile_number") ||
      localStorage.getItem("user_id") ||
      localStorage.getItem("token") ||
      "guest"
    );
  } catch (error) {
    console.log("Error getting current user id", error);
    return "guest";
  }
};

const getCartStorageKey = () => {
  const userId = getCurrentUserId();
  return `cartItems_${userId}`;
};

const getCartFromStorage = () => {
  try {
    const cartKey = getCartStorageKey();
    const savedCart = localStorage.getItem(cartKey);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.log("Error reading cart from localStorage", error);
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    const cartKey = getCartStorageKey();
    localStorage.setItem(cartKey, JSON.stringify(items));
  } catch (error) {
    console.log("Error saving cart to localStorage", error);
  }
};

const initialState = {
  items: getCartFromStorage(),
  loading: false,
  error: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CART_LOAD_USER_CART":
      return {
        ...state,
        items: getCartFromStorage(),
      };

    case "CART_ADD_ITEM_REQUEST":
    case "CART_UPDATE_QTY_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "CART_ADD_ITEM_SUCCESS": {
      const cartItem = action.payload;

      const newItem = {
        service_id: Number(cartItem.service_id),
        name: cartItem.name,
        price: Number(cartItem.price || 0),
        image: cartItem.image || cartItem.image_url || "",
        image_url: cartItem.image_url || cartItem.image || "",
        qty: Number(cartItem.qty || cartItem.quantity || 1),
        quantity: Number(cartItem.quantity || cartItem.qty || 1),
        id: cartItem.id,
        user_id: cartItem.user_id,
      };

      const exists = state.items.find(
        (item) => Number(item.service_id) === Number(newItem.service_id),
      );

      let updatedItems;

      if (exists) {
        updatedItems = state.items.map((item) =>
          Number(item.service_id) === Number(newItem.service_id)
            ? { ...item, ...newItem }
            : item,
        );
      } else {
        updatedItems = [...state.items, newItem];
      }

      saveCartToStorage(updatedItems);

      return {
        ...state,
        loading: false,
        items: updatedItems,
      };
    }

    case "CART_UPDATE_QTY_SUCCESS": {
      const updatedItems = state.items.map((item) =>
        Number(item.service_id) === Number(action.payload.service_id)
          ? {
              ...item,
              qty: Number(action.payload.quantity),
              quantity: Number(action.payload.quantity),
            }
          : item,
      );

      saveCartToStorage(updatedItems);

      return {
        ...state,
        loading: false,
        items: updatedItems,
      };
    }

    case "CART_REMOVE_ITEM_SUCCESS": {
      const updatedItems = state.items.filter(
        (item) => Number(item.service_id) !== Number(action.payload),
      );

      saveCartToStorage(updatedItems);

      return {
        ...state,
        loading: false,
        items: updatedItems,
      };
    }

    case "CART_ADD_ITEM_FAIL":
    case "CART_UPDATE_QTY_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CART_CLEAR":
      try {
        const cartKey = getCartStorageKey();
        localStorage.removeItem(cartKey);
      } catch (error) {
        console.log("Error clearing cart from localStorage", error);
      }

      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};
