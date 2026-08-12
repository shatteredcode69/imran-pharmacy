import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_QTY = 999;

/**
 * A cart line item looks like:
 * { key, id, name, qty, isCustom }
 *
 * - Catalog items use key = `m-${medicine.id}`
 * - Custom (not-in-list) items use key = `c-${timestamp}-${random}`
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: {},
      favorites: {},
      templates: [],

      // Add / increment a catalog medicine by 1
      increment: (medicine) =>
        set((state) => {
          const key = `m-${medicine.id}`;
          const existing = state.cart[key];
          const nextQty = Math.min((existing?.qty || 0) + 1, MAX_QTY);
          return {
            cart: {
              ...state.cart,
              [key]: {
                key,
                id: medicine.id,
                name: medicine.name,
                qty: nextQty,
                note: existing?.note || '',
                isCustom: false,
              },
            },
          };
        }),

      addQuantity: (medicine, qty = 1) =>
        set((state) => {
          const key = `m-${medicine.id}`;
          const existing = state.cart[key];
          const nextQty = Math.min((existing?.qty || 0) + qty, MAX_QTY);
          return {
            cart: {
              ...state.cart,
              [key]: {
                key,
                id: medicine.id,
                name: medicine.name,
                qty: nextQty,
                note: existing?.note || '',
                isCustom: false,
              },
            },
          };
        }),

      toggleFavorite: (medicineId) =>
        set((state) => {
          const key = String(medicineId);
          const next = { ...state.favorites };
          if (next[key]) {
            delete next[key];
          } else {
            next[key] = true;
          }
          return { favorites: next };
        }),

      setQuantityForMedicine: (medicine, qty) =>
        set((state) => {
          const key = `m-${medicine.id}`;
          const existing = state.cart[key];
          const nextQty = Number.isFinite(Number(qty)) ? Math.max(0, Math.min(Number(qty), MAX_QTY)) : existing?.qty || 0;
          if (nextQty <= 0) {
            if (!existing) return state;
            const next = { ...state.cart };
            delete next[key];
            return { cart: next };
          }

          return {
            cart: {
              ...state.cart,
              [key]: {
                key,
                id: medicine.id,
                name: medicine.name,
                qty: nextQty,
                note: existing?.note || '',
                isCustom: false,
              },
            },
          };
        }),

      setItemNote: (key, note) =>
        set((state) => {
          const existing = state.cart[key];
          if (!existing) return state;
          return {
            cart: {
              ...state.cart,
              [key]: { ...existing, note },
            },
          };
        }),

      saveTemplate: (name) =>
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed || Object.keys(state.cart).length === 0) return state;
          const template = {
            id: `template-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: trimmed,
            items: Object.values(state.cart).map(({ id, name, qty, isCustom, note }) => ({ id, name, qty, isCustom, note })),
          };
          return { templates: [template, ...state.templates] };
        }),

      applyTemplate: (templateId) =>
        set((state) => {
          const template = state.templates.find((item) => item.id === templateId);
          if (!template) return state;
          const nextCart = { ...state.cart };
          template.items.forEach((item, index) => {
            if (item.isCustom) {
              const key = `c-${Date.now()}-${index}`;
              nextCart[key] = {
                key,
                id: key,
                name: item.name,
                qty: Math.min(item.qty, MAX_QTY),
                note: item.note || '',
                isCustom: true,
              };
            } else {
              const key = `m-${item.id}`;
              const existing = nextCart[key];
              const qty = Math.min((existing?.qty || 0) + item.qty, MAX_QTY);
              nextCart[key] = {
                key,
                id: item.id,
                name: item.name,
                qty,
                note: existing?.note || item.note || '',
                isCustom: false,
              };
            }
          });
          return { cart: nextCart };
        }),

      deleteTemplate: (templateId) =>
        set((state) => ({ templates: state.templates.filter((item) => item.id !== templateId) })),

      // Decrement a line item by key; removes it once it hits 0
      decrement: (key) =>
        set((state) => {
          const existing = state.cart[key];
          if (!existing) return state;
          if (existing.qty <= 1) {
            const next = { ...state.cart };
            delete next[key];
            return { cart: next };
          }
          return { cart: { ...state.cart, [key]: { ...existing, qty: existing.qty - 1 } } };
        }),

      // Set an explicit quantity for a line item and remove if set to 0
      setQuantity: (key, qty) =>
        set((state) => {
          const existing = state.cart[key];
          if (!existing) return state;

          const nextQty = Number.isFinite(Number(qty)) ? Math.max(0, Math.min(Number(qty), MAX_QTY)) : existing.qty;
          if (nextQty <= 0) {
            const next = { ...state.cart };
            delete next[key];
            return { cart: next };
          }

          return { cart: { ...state.cart, [key]: { ...existing, qty: nextQty } } };
        }),

      removeItem: (key) =>
        set((state) => {
          const next = { ...state.cart };
          delete next[key];
          return { cart: next };
        }),

      // Add a free-text medicine that isn't in the catalog
      addCustomItem: (name, qty = 1) =>
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed) return state;
          const key = `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          return {
            cart: {
              ...state.cart,
              [key]: {
                key,
                id: key,
                name: trimmed,
                qty: Math.min(qty, MAX_QTY),
                note: '',
                isCustom: true,
              },
            },
          };
        }),

      clearCart: () => set({ cart: {} }),

      getQtyForMedicine: (medicineId) => get().cart[`m-${medicineId}`]?.qty || 0,

      getTotalItems: () =>
        Object.values(get().cart).reduce((sum, item) => sum + item.qty, 0),

      getLineCount: () => Object.keys(get().cart).length,
    }),
    { name: 'imran-pharmacy-cart' }
  )
);
