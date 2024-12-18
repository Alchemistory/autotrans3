import { create } from 'zustand';

export const useSelectedDictionary = create((set) => ({
  selectedDictionary: [],
  setSelectedDictionary: (selectedDictionary) => set({ selectedDictionary }),
}));


