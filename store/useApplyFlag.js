import { create } from 'zustand';

export const useApplyFlag = create((set) => ({
  applyFlag: false,
  setApplyFlag: (applyFlag) => set({ applyFlag }),
  toggleApplyFlag: () => set((state) => ({ applyFlag: state.applyFlag ? false : true })),
}));

