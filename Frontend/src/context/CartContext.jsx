import { useState, useEffect, useCallback, useRef } from 'react';
import { CartContext } from './cart-context';
import { useAuth } from '../hooks/useAuth';

function getStoredCart(key) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function mergeCarts(userCart, guestCart) {
  const merged = [...userCart];
  for (const guestItem of guestCart) {
    const existingIndex = merged.findIndex((item) => item._id === guestItem._id);
    if (existingIndex > -1) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        quantity: merged[existingIndex].quantity + guestItem.quantity,
      };
    } else {
      merged.push(guestItem);
    }
  }
  return merged;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || user?._id || null;
  const currentKey = userId ? `bookstore_cart_${userId}` : 'bookstore_cart_guest';

  const [items, setItems] = useState(() => {
    // Clean legacy global key if present
    try {
      const legacy = localStorage.getItem('bookstore_cart');
      if (legacy) {
        localStorage.removeItem('bookstore_cart');
      }
    } catch {
      // Ignore
    }
    return getStoredCart(currentKey);
  });

  const prevUserIdRef = useRef(userId);

  // Synchronize cart when user logs in, logs out, or switches accounts
  useEffect(() => {
    if (prevUserIdRef.current !== userId) {
      prevUserIdRef.current = userId;

      if (userId) {
        // User logged in: load user cart, merge guest items if any
        const guestCart = getStoredCart('bookstore_cart_guest');
        const userCart = getStoredCart(`bookstore_cart_${userId}`);

        let nextCart = userCart;
        if (guestCart.length > 0) {
          nextCart = mergeCarts(userCart, guestCart);
          try {
            localStorage.removeItem('bookstore_cart_guest');
            localStorage.setItem(`bookstore_cart_${userId}`, JSON.stringify(nextCart));
          } catch {
            // Ignore
          }
        }
        setItems(nextCart);
      } else {
        // User logged out: clear active items and guest storage
        try {
          localStorage.removeItem('bookstore_cart_guest');
        } catch {
          // Ignore
        }
        setItems([]);
      }
    }
  }, [userId]);

  // Sync active cart to the active user's storage key
  useEffect(() => {
    try {
      localStorage.setItem(currentKey, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items, currentKey]);

  const addToCart = useCallback((book) => {
    setItems((prev) => {
      const existing = prev.find((item) => item._id === book._id);
      if (existing) {
        return prev.map((item) =>
          item._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: book._id,
          title: book.title,
          author: book.author,
          price: book.price,
          image: book.image,
          quantity: 1,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((bookId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item._id === bookId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((bookId) => {
    setItems((prev) => prev.filter((item) => item._id !== bookId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(currentKey);
    } catch {
      // Ignore
    }
  }, [currentKey]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalAmount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
