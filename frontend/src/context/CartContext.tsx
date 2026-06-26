import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Product } from "../types/product";

export type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
  stock: number;
};

export type AuthUser = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

type AddResult = "ok" | "auth_required" | "error";

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  authUser: AuthUser | null;
  addToCart: (product: Product) => Promise<AddResult>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setAuthUser: (u: AuthUser | null) => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

const API = import.meta.env.VITE_API_URL;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`${API}/cart`, { credentials: "include" });
      if (res.status === 401) { setItems([]); return; }
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch auth user once on mount, then fetch cart only if authenticated
  useEffect(() => {
    fetch(`${API}/auth/check-auth`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setAuthUser({
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName ?? null,
            lastName: data.user.lastName ?? null,
          });
          fetchCart();
        } else {
          setLoading(false);
        }
      })
      .catch(() => { setLoading(false); });
  }, [fetchCart]);

  const addToCart = async (product: Product): Promise<AddResult> => {
    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (res.status === 401) return "auth_required";
      if (!res.ok) return "error";
      await fetchCart();
      return "ok";
    } catch {
      return "error";
    }
  };

  const removeFromCart = async (productId: number) => {
    await fetch(`${API}/cart/${productId}`, { method: "DELETE", credentials: "include" });
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = async (productId: number, qty: number) => {
    if (qty < 1) { await removeFromCart(productId); return; }
    await fetch(`${API}/cart/${productId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(qty, i.stock) } : i))
    );
  };

  const clearCart = async () => {
    await fetch(`${API}/cart`, { method: "DELETE", credentials: "include" });
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, authUser, setAuthUser, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
