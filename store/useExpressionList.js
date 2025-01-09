import { create } from 'zustand';

export const useExpressionList = create((set) => ({
  expressionList: [],
  setExpressionList: (newExpressionList) => set({ expressionList: newExpressionList }),
}));

