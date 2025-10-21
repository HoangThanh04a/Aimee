import { atom } from "jotai";

// Helper functions for localStorage
const CART_STORAGE_KEY = 'aimee_cart_items';

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

// Global cart items atom with localStorage persistence
// Each item: { id, product, sizeId, sizeLabel, unitPrice, quantity, toppings: [{productId, name, price}], note }
export const cartItemsAtom = atom(
  loadCartFromStorage(),
  (get, set, newValue) => {
    set(cartItemsAtom, newValue);
    saveCartToStorage(newValue);
  }
);

export const addCartItemAtom = atom(
  (get) => get(cartItemsAtom),
  (get, set, newItem) => {
    const items = get(cartItemsAtom);
    const updatedItems = [...items, newItem];
    set(cartItemsAtom, updatedItems);
  }
);

export const clearCartAtom = atom(
  (get) => get(cartItemsAtom),
  (get, set) => {
    set(cartItemsAtom, []);
  }
);

export const removeCartItemAtom = atom(
  (get) => get(cartItemsAtom),
  (get, set, itemId) => {
    const items = get(cartItemsAtom);
    const updatedItems = items.filter(item => item.id !== itemId);
    set(cartItemsAtom, updatedItems);
  }
);


