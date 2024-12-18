import { create } from 'zustand';

export const useDictionary = create((set) => ({
  dictionary: null,
  setDictionary: (dictionary) => set({ dictionary }),
}));

