import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { products } from '../data/dummyData';
import { useAuth } from '../hooks/useAuth';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  totalPrice: number;
  isCartAnimating: boolean;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to get cart from localStorage
const getStoredCart = (): CartItem[] => {
    const storedCart = localStorage.getItem('kodik-cart');
    return storedCart ? JSON.parse(storedCart) : [];
};

// Helper to save cart to localStorage
const storeCart = (cart: CartItem[]) => {
    localStorage.setItem('kodik-cart', JSON.stringify(cart));
};


export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // "Fetch" cart from storage on initial load and when auth state changes
  useEffect(() => {
    setIsLoading(true);
    // In a real app, you would fetch from the API here.
    // If not authenticated, you might fetch a guest cart or clear the cart.
    const items = getStoredCart();
    setCartItems(items);
    setIsLoading(false);
  }, [isAuthenticated]);

  const triggerCartAnimation = () => {
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 500); // Animation duration
  }

  const addToCart = async (productId: number) => {
    const productToAdd = products.find(p => p.id === productId);
    if (!productToAdd) return;

    // Simulate async API call
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 200)); // Fake delay

    const currentCart = getStoredCart();
    const existingItem = currentCart.find(item => item.productId === productId);
    let updatedCart;
    if (existingItem) {
      updatedCart = currentCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...currentCart, { 
          productId: productToAdd.id, 
          quantity: 1,
          // Denormalize data for easy display in the cart, as a real API might do.
          product: productToAdd,
          imageUrls: productToAdd.imageUrls,
          price: productToAdd.price,
          discount: productToAdd.discount
      }];
    }
    storeCart(updatedCart);
    setCartItems(updatedCart);
    triggerCartAnimation();
    setIsLoading(false);
  };

  const removeFromCart = async (productId: number) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 200));
    
    const currentCart = getStoredCart();
    const updatedCart = currentCart.filter(item => item.productId !== productId);
    
    storeCart(updatedCart);
    setCartItems(updatedCart);
    setIsLoading(false);
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 100));

    const currentCart = getStoredCart();
    const updatedCart = currentCart
      .map(item =>
        item.productId === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      )
      .filter(item => item.quantity > 0);

    storeCart(updatedCart);
    setCartItems(updatedCart);
    setIsLoading(false);
  };
  
  const clearCart = async () => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 200));
    storeCart([]);
    setCartItems([]);
    setIsLoading(false);
  }

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice, isCartAnimating, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};
