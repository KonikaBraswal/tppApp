import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const initialState = {
  cartItems: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    // case 'ADD_TO_CART':
    //   return {
    //     ...state,
    //     cartItems: [...state.cartItems, action.payload],
    //   };
    case 'ADD_TO_CART':
      const existingItemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex !== -1) {
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, cartItems: updatedCartItems };
      } else {
        return { ...state, cartItems: [...state.cartItems, action.payload] };
      }
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const checkout = () => {
    // Here you would typically perform the checkout process, e.g., sending cart items to the server for payment processing.
    // For this example, we'll just clear the cart after checkout.
    clearCart();
  };

  return (
    <CartContext.Provider value={{ cartItems: state.cartItems, addToCart, clearCart, checkout }}>
      {children}
    </CartContext.Provider>
  );
};