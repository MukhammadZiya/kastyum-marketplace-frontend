import React, { createContext, useContext, useMemo, useReducer } from "react";
import type { Product } from "../types/product";

export type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "cart/add"; item: CartItem }
  | { type: "cart/remove"; id: number }
  | { type: "cart/clear" };

const CartContext = createContext<
  | {
      items: CartItem[];
      totalPrice: number;
      addItem: (item: CartItem) => void;
      removeItem: (id: number) => void;
      clear: () => void;
    }
  | undefined
>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "cart/add": {
      const existing = state.items.find((x) => x.id === action.item.id);
      if (!existing) return { items: [...state.items, action.item] };
      return {
        items: state.items.map((x) =>
          x.id === action.item.id
            ? { ...x, quantity: x.quantity + action.item.quantity }
            : x
        ),
      };
    }
    case "cart/remove":
      return { items: state.items.filter((x) => x.id !== action.id) };
    case "cart/clear":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const totalPrice = useMemo(() => {
    return state.items.reduce(
      (sum, item) => sum + item.discountedPrice * item.quantity,
      0
    );
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      totalPrice,
      addItem: (item: CartItem) => dispatch({ type: "cart/add", item }),
      removeItem: (id: number) => dispatch({ type: "cart/remove", id }),
      clear: () => dispatch({ type: "cart/clear" }),
    }),
    [state.items, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

