"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

export type CartProduct = {
  slug: string;
  name: string;
  price: string;
  image: string;
  alt: string;
  href: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartState = {
  items: CartItem[];
  ready: boolean;
};

type CartAction =
  | { type: "ADD_ITEM"; product: CartProduct; quantity?: number }
  | { type: "REMOVE_ITEM"; slug: string }
  | { type: "SET_QUANTITY"; slug: string; quantity: number }
  | { type: "INCREMENT"; slug: string }
  | { type: "DECREMENT"; slug: string }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; items: CartItem[] };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isHydrated: boolean;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  increment: (slug: string) => void;
  decrement: (slug: string) => void;
  clearCart: () => void;
  getItemQuantity: (slug: string) => number;
};

const STORAGE_KEY = "zenlora-cart";

const CartContext = createContext<CartContextValue | null>(null);

function parsePrice(price: string) {
  const value = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items, ready: true };

    case "ADD_ITEM": {
      const quantity = Math.max(1, action.quantity ?? 1);
      const existing = state.items.find(
        (item) => item.slug === action.product.slug,
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.slug === action.product.slug
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.product, quantity }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.slug !== action.slug),
      };

    case "SET_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.slug !== action.slug),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.slug === action.slug
            ? { ...item, quantity: action.quantity }
            : item,
        ),
      };
    }

    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((item) =>
          item.slug === action.slug
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };

    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.slug === action.slug
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

function readStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<CartItem>;
      return (
        typeof candidate.slug === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.price === "string" &&
        typeof candidate.image === "string" &&
        typeof candidate.alt === "string" &&
        typeof candidate.href === "string" &&
        typeof candidate.quantity === "number" &&
        candidate.quantity > 0
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    ready: false,
  });

  useEffect(() => {
    startTransition(() => {
      dispatch({ type: "HYDRATE", items: readStoredCart() });
    });
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, state.ready]);

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", product, quantity });
  }, []);

  const removeItem = useCallback((slug: string) => {
    dispatch({ type: "REMOVE_ITEM", slug });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    dispatch({ type: "SET_QUANTITY", slug, quantity });
  }, []);

  const increment = useCallback((slug: string) => {
    dispatch({ type: "INCREMENT", slug });
  }, []);

  const decrement = useCallback((slug: string) => {
    dispatch({ type: "DECREMENT", slug });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const getItemQuantity = useCallback(
    (slug: string) =>
      state.items.find((item) => item.slug === slug)?.quantity ?? 0,
    [state.items],
  );

  const itemCount = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items],
  );

  const subtotal = useMemo(
    () =>
      state.items.reduce(
        (total, item) => total + parsePrice(item.price) * item.quantity,
        0,
      ),
    [state.items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount,
      subtotal,
      isHydrated: state.ready,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      clearCart,
      getItemQuantity,
    }),
    [
      state.items,
      state.ready,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      clearCart,
      getItemQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

export function formatCartMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
