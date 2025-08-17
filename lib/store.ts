import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItemData, ProductUnit } from './zod-schemas';

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: ProductUnit;
  category: string;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  vendorReturnRate: number;
  images: string[];
  inStock: boolean;
  weightRange?: string;
}

export interface Vendor {
  id: string;
  name: string;
  rating: number;
  returnRate: number;
  workingHours: string;
}

export interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  items: CartItemData[];
  total: number;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'cash' | 'card' | 'transfer';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'admin';
  emailVerified: boolean;
  phoneVerified: boolean;
  addresses: Array<{
    id: string;
    city: string;
    street: string;
    house: string;
    apartment?: string;
    comment?: string;
  }>;
  orders: Array<{
    id: string;
    status: string;
    total: number;
    date: string;
    items: number;
  }>;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  cart: CartItemData[];
  cartTotal: number;
  orders: Order[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  addToCart: (item: CartItemData) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      cart: [],
      cartTotal: 0,
      orders: [],
      isLoading: false,
      searchQuery: '',
      selectedCategory: null,

      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      addToCart: (item) => {
        const { cart } = get();
        const existingItem = cart.find(cartItem => cartItem.productId === item.productId);
        
        if (existingItem) {
          const updatedCart = cart.map(cartItem =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          );
          set({ cart: updatedCart });
        } else {
          set({ cart: [...cart, item] });
        }
      },

      removeFromCart: (productId) => {
        const { cart } = get();
        set({ cart: cart.filter(item => item.productId !== productId) });
      },

      updateCartItem: (productId, quantity) => {
        const { cart } = get();
        const updatedCart = cart.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        );
        set({ cart: updatedCart });
      },

      clearCart: () => set({ cart: [] }),

      addOrder: (order) => {
        const { orders } = get();
        set({ orders: [...orders, order] });
      },

      updateOrder: (orderId, updates) => {
        const { orders } = get();
        const updatedOrders = orders.map(order =>
          order.id === orderId ? { ...order, ...updates } : order
        );
        set({ orders: updatedOrders });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    }),
    {
      name: 'fudsiti-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        orders: state.orders,
      }),
    }
  )
); 