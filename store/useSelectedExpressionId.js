import { create } from 'zustand';

export const useSelectedExpressionId = create((set) => ({
  selectedExpressionId: [],
  setSelectedExpressionId: (selectedExpressionId) => set({ selectedExpressionId }),
}));

