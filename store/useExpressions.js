import { create } from 'zustand';

export const useExpressions = create((set) => ({
  expressions: [],
  setExpressions: (newExpressions) => set({ expressions: newExpressions }),
}));

