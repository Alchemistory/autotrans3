import { create } from 'zustand';

export const useChapterList = create((set) => ({
  chapterList: {},
  setChapterList: (newChapterList) => set({ chapterList: newChapterList }),
}));

