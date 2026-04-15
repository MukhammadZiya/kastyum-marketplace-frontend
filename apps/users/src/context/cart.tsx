import React, { createContext, useContext, useMemo, useReducer } from "react";
import type { Product } from "../types/product";

/** Chosen catalog options for API products; merged into cart line identity. */
export type CartItemVariantSelection = {
  selectedSizeId?: string;
  selectedSizeName?: string;
  selectedColorId?: string;
  selectedColorName?: string;
};

export type CartItem = Product & { quantity: number } & CartItemVariantSelection;

export function cartLineKey(
  item: Pick<CartItem, "mongoId" | "id" | "selectedSizeId" | "selectedColorId">,
): string {
  const base = item.mongoId ?? `n:${item.id}`;
  return `${base}|${item.selectedSizeId ?? ""}|${item.selectedColorId ?? ""}`;
}

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "cart/add"; item: CartItem }
  | { type: "cart/remove"; lineKey: string }
  | { type: "cart/clear" };

const CartContext = createContext<
  | {
      items: CartItem[];
      totalPrice: number;
      addItem: (item: CartItem) => void;
      removeItem: (lineKey: string) => void;
      clear: () => void;
    }
  | undefined
>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "cart/add": {
      const key = cartLineKey(action.item);
      const existing = state.items.find((x) => cartLineKey(x) === key);
      if (!existing) return { items: [...state.items, action.item] };
      return {
        items: state.items.map((x) =>
          cartLineKey(x) === key ?
            { ...x, quantity: x.quantity + action.item.quantity }
          : x,
        ),
      };
    }
    case "cart/remove":
      return {
        items: state.items.filter((x) => cartLineKey(x) !== action.lineKey),
      };
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
      removeItem: (lineKey: string) =>
        dispatch({ type: "cart/remove", lineKey }),
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

