import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { hashPassword } from '../lib/hashPassword';

/**
 * Only `passwordHash` is persisted to localStorage. `unlocked` deliberately
 * lives outside persistence (see `partialize` below) so the app re-locks
 * itself every time it's freshly opened — refresh, new tab, or relaunching
 * the installed PWA all require the password again.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      passwordHash: null,
      unlocked: false,

      hasPassword: () => !!get().passwordHash,

      // First-time setup: choose a password and unlock immediately
      setPassword: async (password) => {
        const hash = await hashPassword(password);
        set({ passwordHash: hash, unlocked: true });
      },

      // Attempt to unlock with a password; returns true/false
      unlock: async (password) => {
        const hash = await hashPassword(password);
        const match = hash === get().passwordHash;
        if (match) set({ unlocked: true });
        return match;
      },

      lock: () => set({ unlocked: false }),

      // Requires the current password to succeed
      changePassword: async (currentPassword, newPassword) => {
        const currentHash = await hashPassword(currentPassword);
        if (currentHash !== get().passwordHash) return false;
        const newHash = await hashPassword(newPassword);
        set({ passwordHash: newHash });
        return true;
      },

      // Escape hatch for a forgotten password — wipes the password only,
      // not the catalog/cart/order history, and requires setting a new one
      forgotPasswordReset: () => set({ passwordHash: null, unlocked: false }),
    }),
    {
      name: 'imrans-pharmacy-auth',
      partialize: (state) => ({ passwordHash: state.passwordHash }),
    }
  )
);
