"use client";
import React from "react";
import { Select, SelectItem, Listbox, ListboxItem } from "@nextui-org/react";
import { GoDotFill, GoPencil } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useSelectedChunk } from "@/store/useSelectedChunk";
import { createClient } from "@/utils/supabase/client";
import { useDictionary } from "@/store/useDictionary";
import { useSelectedDictionary } from "@/store/useSelectedDictionary";
import { useChunk } from "@/store/useChunk";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import { useApplyFlag } from "@/store/useApplyFlag";
function ItemList({booksId, articleId}) {
  const { selectedChunk, setSelectedChunk } = useSelectedChunk();
  const { chunks, setChunks, fetchChunk } = useChunk();
  const { dictionary, setDictionary } = useDictionary();
  const { selectedDictionary, setSelectedDictionary } = useSelectedDictionary();
  const [selectedItem, setSelectedItem] = useState([]);
  const [itemList, setItemList] = useState([]);
  const supabase = createClient();
  const { applyFlag, toggleApplyFlag } = useApplyFlag();

  const filterDictionaryOld = async () => {
    // Get chunks that match selectedChunk ids
    const selectedChunks = chunks?.filter((chunk) =>
      selectedChunk.includes(chunk.chunkId.id)
    );

    // Extract dictionaryList from each chunk and flatten into single array
    const allDictionaryItems = selectedChunks?.flatMap(
      (chunk) => chunk.dictionaryList || []
    );

    // Remove duplicates by converting to Set and back to array
    const uniqueDictionaryItems = [...new Set(allDictionaryItems)];

    // Get full dictionary items for the unique IDs
    const itemList = dictionary?.filter((item) =>
      uniqueDictionaryItems.includes(item.id)
    );

    // Sort itemList by titleKR in ascending order
    const sortedItemList = itemList?.sort((a, b) => 
      a.titleKR.localeCompare(b.titleKR, 'ko')
    );

    setItemList(itemList);
  };

  useEffect(() => {
    filterDictionaryOld();
  }, [selectedChunk,chunks]);

  const handleCancelItem = async (item) => {
    // Filter out the selected chunks that contain the item.id in their dictionaryList
    const updatedChunks = chunks.map(chunk => {
      if (selectedChunk.includes(chunk.chunkId.id)) {
        return {
          ...chunk,
          dictionaryList: chunk.dictionaryList.filter(dictItem => dictItem !== item.id)
        };
      }
      return chunk;
    });

    // Update the chunks state with the filtered chunks
    setChunks(updatedChunks);
    console.log('updatedChunks:',updatedChunks)
    // Update the itemList to reflect the changes
    const updatedItemList = itemList.filter(listItem => listItem.id !== item.id);
    setItemList(updatedItemList);

    // Update the chunks in Supabase
    try {
      const { error } = await supabase
        .from('consistencyAnalysis')
        .upsert(
          updatedChunks.map(chunk => ({
            id: chunk.chunkId.id, // Ensure this matches your primary key
            dictionaryList: chunk.dictionaryList
          })),
          { onConflict: 'id' }
        );

      if (error) {
        toast.error(`삭제 실패: ${error.message}`);
        console.log('error:', error);
      } else {
        toast.success('적용 해제');
        fetchChunk(supabase,booksId, articleId);
      }
    } catch (error) {
      console.log('error:', error);
    }
  };
  
  const handleApply = async () => {
    const updatedChunks = chunks.map(chunk => {
      if (selectedChunk.includes(chunk.chunkId.id)) {
        const matchingItems = selectedDictionary.filter(dictItem =>
          chunk.chunkId.chunkText.includes(dictItem.titleKR)
        );

        if (matchingItems.length > 0) {
          return {
            ...chunk,
            dictionaryList: matchingItems.map(item => item.id)
          };
        }
      }
      return chunk;
    });

    try {
      const { error } = await supabase
        .from('consistencyAnalysis')
        .upsert(
          updatedChunks.map(chunk => ({
            id: chunk.chunkId.id,
            dictionaryList: chunk.dictionaryList
          })),
          { onConflict: 'id' }
        );

      if (error) {
        toast.error(`적용하기 실패: ${error.message}`);
        console.log('error:', error);
        fetchChunk(supabase, booksId, articleId);
      } else {
        toast.success('적용하기 완료');
        console.log('Updated chunks:', updatedChunks);
        fetchChunk(supabase, booksId, articleId);
      }
      toggleApplyFlag();

    } catch (error) {
      console.log('error:', error);
    }
  };

  

  return (
    <div className="w-full h-[calc(100vh-200px)] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-y-3">
          {itemList?.map((item, index) => (
            <div
              className="border-2 border-yellow-500 rounded-lg p-2 text-sm relative"
              key={index}
            >
              <div className="w-auto h-full absolute top-1 right-1">
                <MdOutlineCancel className="text-yellow-500 cursor-pointer hover:text-red-500 transition-transform" onClick={() => (handleCancelItem(item))} />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="flex items-center gap-x-1">
                    {item.isNew === true ? (
                      <GoDotFill
                        className={`${item.isFixed ? "text-green-500" : "text-red-500"}`}
                      />
                    ) : (
                      <></>
                    )}
                    <span className="text-[10px] text-default-400">
                      {item.categoryLarge} / {item.categoryMiddle} /{" "}
                      {item.categorySmall}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs">{item.titleKR}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-16 flex items-center ">
        <Button onClick={()=>{
          handleApply();
          toggleApplyFlag();
        }} color="primary" className="w-full">
          적용하기
        </Button>
      </div>
    </div>
  );
}

export default ItemList;
