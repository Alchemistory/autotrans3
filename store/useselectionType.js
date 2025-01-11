import { create } from 'zustand';

export const useSelectionType = create((set) => ({
  selectionType: null,
  setSelectionType: (selectionType) => set({ selectionType }),
}));


