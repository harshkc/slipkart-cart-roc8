import React, {useContext, useReducer} from "react";

const CartContext = React.createContext();
CartContext.displayName = "CartContext";

const initialState = {
  cart: [],
  saveItemsCart: [],
};

const stateReducer = (state, action) => {
  const {type, payload} = action;
  switch (type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, {...payload, qty: 1}],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== payload),
      };
    case "INCREMENT_ITEM":
      return {
        ...state,
        cart: state.cart.map((item) => {
          if (item.id === payload) {
            return {...item, qty: (item?.qty ?? 1) + 1};
          }
          return item;
        }),
      };
    case "DECREMENT_ITEM":
      return {
        ...state,
        cart: state.cart.map((item) => {
          if (item.id === payload && (item?.qty ?? 1) > 1) {
            return {...item, qty: item?.qty - 1};
          }
          return item;
        }),
      };
    case "SAVE_FOR_LATER":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== payload.id),
        saveItemsCart: [...state.saveItemsCart, payload],
      };
    case "MOVE_TO_CART":
      return {
        ...state,
        saveItemsCart: state.saveItemsCart.filter((item) => item.id !== payload.id),
        cart: [...state.cart, payload],
      };
    case "REMOVE_FROM_SAVED":
      return {
        ...state,
        saveItemsCart: state.saveItemsCart.filter((item) => item.id !== payload),
      };
    default:
      return state;
  }
};

const CartProvider = ({children}) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return <CartContext.Provider value={{state, dispatch}}>{children}</CartContext.Provider>;
};

const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};

export {CartProvider, useCartContext};
