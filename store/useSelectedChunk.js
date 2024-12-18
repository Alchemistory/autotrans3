import { create } from 'zustand';

export const useSelectedChunk = create((set) => ({
  selectedChunk: [],
  setSelectedChunk: (chunkId) => {
    // Check if chunkId is a valid value
    if (typeof chunkId !== 'function') {
      set((state) => {
        const isSelected = state.selectedChunk.includes(chunkId);
        return {
          selectedChunk: isSelected
            ? state.selectedChunk.filter((id) => id !== chunkId)
            : [...state.selectedChunk, chunkId],
        };
      });
    } else {
      console.error('Invalid chunkId: Functions are not allowed');
    }
  },
  setSelectedChunks: (chunkIds) => {
    // Check if chunkIds is an array
    if (Array.isArray(chunkIds)) {
      set(() => ({
        selectedChunk: chunkIds,
      }));
    } else {
      console.error('Invalid chunkIds: Must be an array');
    }
  },
  clearSelectedChunk: () => {
    set(() => ({
      selectedChunk: '',
    }));
  },
}));
