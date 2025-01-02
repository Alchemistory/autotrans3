import { create } from 'zustand';

export const useIsHaveChunkList = create((set) => ({
  isHaveChunkList: new Set(),
  addToIsHaveChunkList: (item) => set((state) => {
    state.isHaveChunkList.add(item);
    return { isHaveChunkList: new Set(state.isHaveChunkList) };
  }),
  removeFromIsHaveChunkList: (item) => set((state) => {
    state.isHaveChunkList.delete(item);
    return { isHaveChunkList: new Set(state.isHaveChunkList) };
  }),
}));
