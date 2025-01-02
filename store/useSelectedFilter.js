import { create } from 'zustand';

export const useSelectedFilter = create((set) => ({
  selectedFilter: [],
  setSelectedFilter: (selectedFilter) => set({ selectedFilter }),
}));


