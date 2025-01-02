import { create } from 'zustand';
export const useChunk = create((set) => ({
  chunks: [],
  setChunks: (chunks) => set({ chunks }),
  fetchChunk: async (supabase,booksId, articleId) => {
    const { data: data1, error: error1 } = await supabase
      .from("consistencyAnalysis")
      .select(
        `
        *,
        chunkId(*)
      `
      )
      .eq("booksId", booksId)
      .eq("chapterId", articleId)
      .order("id", { ascending: true });
    if (error1) {
      console.log("error:", error1);
    } else {
      set({ chunks: data1 });
    }
  },
}));


