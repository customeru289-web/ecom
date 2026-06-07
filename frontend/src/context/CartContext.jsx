import { createContext, useContext, useState, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setSummary(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await cartAPI.get();
      setCart(data.cart);
      setSummary(data.summary);
    } catch {
      setCart(null);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await cartAPI.add(productId, quantity);
    setCart(data.cart);
    await fetchCart();
    return data;
  };

  const updateQuantity = async (itemId, quantity) => {
    const { data } = await cartAPI.update(itemId, quantity);
    setCart(data.cart);
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    const { data } = await cartAPI.remove(itemId);
    setCart(data.cart);
    await fetchCart();
  };

  const applyCoupon = async (code) => {
    await cartAPI.applyCoupon(code);
    await fetchCart();
  };

  const removeCoupon = async () => {
    await cartAPI.removeCoupon();
    await fetchCart();
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, summary, loading, cartCount, fetchCart,
      addToCart, updateQuantity, removeItem, applyCoupon, removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
