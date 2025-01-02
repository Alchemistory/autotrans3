"use client";
import { useState, useEffect } from "react";
import Tiptap from "./Tiptap";
import { CheckboxGroup, Checkbox, Divider } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { useSelectedChunk } from "@/store/useSelectedChunk";
import { useDictionary } from "@/store/useDictionary";
import { useChunk } from "@/store/useChunk";
import { useApplyFlag } from "@/store/useApplyFlag";
import { useIsHaveChunkList } from "@/store/useIsHaveChunkList";
import Textareas from "./Textareas";
function Chunk({ booksId, articleId }) {
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { chunks, setChunks, fetchChunk } = useChunk();
  const { dictionary, setDictionary } = useDictionary();
  const { applyFlag, toggleApplyFlag } = useApplyFlag();
  const { isHaveChunkList, addToIsHaveChunkList, removeFromIsHaveChunkList } = useIsHaveChunkList()
  const {
    selectedChunk,
    setSelectedChunk,
    setSelectedChunks,
    clearSelectedChunk,
  } = useSelectedChunk();
  const [isPartialSelected, setIsPartialSelected] = useState(false);

  

  useEffect(() => {
    fetchChunk(supabase,booksId, articleId);
  }, [applyFlag]);

  const handleChunkSelect = (chunkId) => {
    setSelectedChunk(chunkId);
  };

  const handleChunkSelectAll = (isChecked) => {
    if (isChecked) {
      // Select all chunks
      setSelectedChunks(chunks.map((chunk) => chunk.chunkId.id));
    } else {
      // Deselect all chunks
      clearSelectedChunk();
    }
  };

  const handleChunkSelectSelected = () => {
    setSelectedChunk(selectedChunk);
  };
  const handleChunkSelectPartial = () => {
    if (isPartialSelected) {
      // Deselect all chunks
      clearSelectedChunk();
      setIsPartialSelected(false);
    } else if (isHaveChunkList.size > 0) {
      // Select all chunks
      const selectedChunkIds = Array.from(isHaveChunkList);
      console.log('selectedChunkIds:', selectedChunkIds);
      setSelectedChunks(selectedChunkIds);
      setIsPartialSelected(true);
    }
  };

  console.log('isPartialSelected:',isPartialSelected)
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
        <Checkbox
          isSelected={isPartialSelected}
          onChange={() => {
            handleChunkSelectPartial();
            setIsPartialSelected(!isPartialSelected);
          }}
          value="select"
        >
          표시된 부분 모두 선택
        </Checkbox>
      </CheckboxGroup>
      <div className="flex flex-col gap-y-3 my-3">
        {/* <Tiptap />
        <Tiptap />
        <Tiptap /> */}
        {chunks.map((chunk, index) => (
          <div key={index} className="flex gap-x-3 w-full flex-col gap-y-3">
            <div className="flex  gap-y-3 w-full">
              <Checkbox
                value={chunk.id}
                isSelected={selectedChunk.includes(chunk.chunkId.id)}
                onChange={() => handleChunkSelect(chunk.chunkId.id)}
              />
              <Tiptap
                booksId={booksId}
                articleId={articleId}
                key={index}
                chunk={chunk}
                dictionary={dictionary}
                setDictionary={setDictionary}
              />
              {/* <Textareas chunk={chunk} dictionary={dictionary} /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chunk;
