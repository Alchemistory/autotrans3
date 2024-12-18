import { create } from 'zustand';

export const useChunk = create((set) => ({
  chunks: [],
  setChunks: (chunks) => set({ chunks }),
}));


