"use client";
import { useState, useEffect } from "react";
import Tiptap from "./Tiptap";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { useSelectedChunk } from "@/store/useSelectedChunk";
import { useChunk } from "@/store/useChunk";
import { useDictionary } from "@/store/useDictionary";
import Textareas from "./Textareas";
function Chunk({ booksId, articleId }) {
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const {chunks, setChunks} = useChunk()
  const [chunkData, setChunkData] = useState([]);
  const {dictionary,setDictionary} = useDictionary()
  // const { selectedChunk, setSelectedChunk } = useChunkStore();
  
  const {selectedChunk, setSelectedChunk,setSelectedChunks,clearSelectedChunk} = useSelectedChunk()

  const fetchChunk = async () => {
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
      setChunks(data1);
    }
  };
  useEffect(() => {
    fetchChunk();
  }, []);

  const handleChunkSelect = (chunkId) => {
    setSelectedChunk(chunkId);
  };

  const handleChunkSelectAll = (isChecked) => {
    if (isChecked) {
      // Select all chunks
      setSelectedChunks(chunks.map(chunk => chunk.chunkId.id));
    } else {
      // Deselect all chunks
      clearSelectedChunk();
    }
  };

  const handleChunkSelectSelected = () => {
    setSelectedChunk(selectedChunk);
  };
  console.log('selectedChunk', selectedChunk)

  return (
    <div className="my-3">
      <CheckboxGroup
        color="primary"
        defaultValue={[""]}
        orientation="horizontal"
      >
        <Checkbox
          isSelected={selectedChunk.length === chunks.length}
          onChange={(e) => handleChunkSelectAll(e.target.checked)}
          value="all"
        >
          전체선택
        </Checkbox>
        <Checkbox onChange={handleChunkSelectSelected} value="select">
          표시된 부분 모두 선택
        </Checkbox>
      </CheckboxGroup>
      <div className="flex flex-col gap-y-3 my-3">
        {/* <Tiptap />
        <Tiptap />
        <Tiptap /> */}
        {chunks.map((chunk, index) => (
          <div key={index} className="flex gap-x-3 w-full">
            <Checkbox
              value={chunk.id}
              isSelected={selectedChunk.includes(chunk.chunkId.id)}
              onChange={() => handleChunkSelect(chunk.chunkId.id)}
            />
            <Tiptap booksId={booksId} articleId={articleId} key={index} chunk={chunk} dictionary={dictionary} setDictionary={setDictionary} />
            {/* <Textareas chunk={chunk} dictionary={dictionary} /> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chunk;
