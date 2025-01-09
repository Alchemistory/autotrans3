import { create } from 'zustand';

export const useExpressionRefresh = create((set) => ({
  expressionRefresh: false,
  toggleExpressionRefresh: () => set((state) => ({ expressionRefresh: state.expressionRefresh ? false : true })),
}));

