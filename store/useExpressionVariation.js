import { create } from 'zustand';

export const useExpressionVariation = create((set) => ({
  expressionVariation: [],
  setExpressionVariation: (expressionVariation) => set({ expressionVariation: [...expressionVariation] }),
}));

