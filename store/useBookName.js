import { create } from 'zustand';

export const useBookName = create((set) => ({
  bookName: null,
  setBookName: (bookName) => set({ bookName }),
}));

