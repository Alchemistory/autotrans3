import { create } from 'zustand';

export const useActivePopoverId = create((set) => ({
  activePopoverId: null,
  setActivePopoverId: (activePopoverId) => set({ activePopoverId }),
}));


