import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * An order record looks like:
 * {
 *   id: string,          // unique order id, also used in the PDF filename
 *   orderNumber: number,  // human-friendly sequential number
 *   dateISO: string,      // ISO timestamp of checkout
 *   items: [{ name, qty, isCustom }],
 *   totalItems: number,
 * }
 */
export const useHistoryStore = create(
  persist(
    (set, get) => ({
      orders: [],
      nextOrderNumber: 1,

      addOrder: (items) =>
        set((state) => {
          const orderNumber = state.nextOrderNumber;
          const now = new Date();
          const order = {
            id: `${now.getTime()}`,
            orderNumber,
            dateISO: now.toISOString(),
            items: items.map(({ name, qty, isCustom }) => ({ name, qty, isCustom })),
            totalItems: items.reduce((sum, i) => sum + i.qty, 0),
          };
          return {
            orders: [order, ...state.orders],
            nextOrderNumber: orderNumber + 1,
          };
        }),

      deleteOrder: (orderId) =>
        set((state) => ({ orders: state.orders.filter((o) => o.id !== orderId) })),

      clearHistory: () => set({ orders: [], nextOrderNumber: 1 }),

      getOrderCount: () => get().orders.length,
    }),
    { name: 'imran-pharmacy-history' }
  )
);
