import { create } from 'zustand';

export const useStageExpression = create((set) => ({
  stageExpression: null,
  setStageExpression: (stageExpression) => set({ stageExpression }),
}));

