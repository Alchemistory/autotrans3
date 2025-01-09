"use client";
import React, { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { Input, Button, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useSelectedDictionary } from "@/store/useSelectedDictionary";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import { useChunk } from "@/store/useChunk";
import { useIsHaveChunkList } from "@/store/useIsHaveChunkList";
const Tiptap = ({ booksId, articleId, chunk, dictionary, setDictionary}) => {
  const [selectedText, setSelectedText] = useState("");
  const { fetchChunk } = useChunk();
  const { selectedDictionary, setSelectedDictionary } = useSelectedDictionary();
  const [highlightedContents, setHighlightedContents] = useState([]);
  const [highlightedWordList, setHighlightedWordList] = useState([]);
  const [selectedDictionaryWordList, setSelectedDictionaryWordList] = useState([])
  const { isHaveChunkList, addToIsHaveChunkList, removeFromIsHaveChunkList } = useIsHaveChunkList()
  const [isHaveSelectedDictionary, setIsHaveSelectedDictionary] =useState(false);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [myWords, setMyWords] = useState([])

  const handleAddWord = async () => {
    const { data, error } = await supabase.from("dictionaryList").insert({
      titleKR: selectedText,
      titleEN: "",
      categoryLarge: "용어",
      categoryMiddle: "",
      categorySmall: "",
      booksId: booksId,
      isNew: true,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("단어 추가 완료");
      getDictionary();
    }
  };

  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: chunk?.chunkId?.chunkText || "",
  });

const handleSave = async () => {
  const changeText = editor.getText();

  // Find ids of words in myWords that are not in changeText
  const idsToRemove = myWords
    .filter(word => !changeText.includes(word.titleKR))
    .map(word => word.id);

  // Remove these ids from chunk.dictionaryList
  const updatedDictionaryList = chunk.dictionaryList.filter(
    id => !idsToRemove.includes(id)
  );

  const { data, error } = await supabase
    .from("chunks")
    .update({ 
      chunkText: changeText,
    })
    .eq("id", chunk.chunkId.id);

  if (error) {
    toast.error("저장 실패");
  } else {
    toast.success("수정 완료");
    fetchChunk(supabase, booksId, articleId);

    // Check if updatedDictionaryList is different from the original
    if (JSON.stringify(updatedDictionaryList) !== JSON.stringify(chunk.dictionaryList)) {
      const { data: consistencyData, error: consistencyError } = await supabase
        .from("consistencyAnalysis")
        .update({ dictionaryList: updatedDictionaryList })
        .eq("chunkId", chunk.chunkId.id);

      if (consistencyError) {
        console.error("Consistency update failed:", consistencyError);
      } else {
        console.log("Consistency updated successfully:", consistencyData);
      }
    }
  }
};
  

  const supabase = createClient();
  const getDictionary = async () => {
    const { data, error } = await supabase
      .from("dictionaryList")
      .select("*")
      .eq("booksId", booksId)
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setDictionary(data);
    }
  };
  useEffect(() => {
    getDictionary();
  }, []);

  useEffect(() => {
    if (dictionary && chunk?.chunkId?.chunkText) {
      const highlightedWords = dictionary.filter((dict) => {
        return chunk.dictionaryList.includes(dict.id);
      });

      setHighlightedWordList(highlightedWords);
    }
  }, [dictionary, chunk, selectedDictionary]);
  useEffect(() => {
    if (chunk?.chunkId?.chunkText && selectedDictionary.length > 0) {
      const hasSelectedDictionaryWord = selectedDictionary.some((word) =>
        chunk.chunkId.chunkText.includes(word.titleKR)
      );

      setIsHaveSelectedDictionary(hasSelectedDictionaryWord);

      if (hasSelectedDictionaryWord) {
        addToIsHaveChunkList(chunk.chunkId.id);
      }else{
        removeFromIsHaveChunkList(chunk.chunkId.id);
      }
    } else {
      console.log('해제됨')
      setIsHaveSelectedDictionary(false);
      removeFromIsHaveChunkList(chunk.chunkId.id);
    }
  }, [chunk, selectedDictionary]);

  const highlightText = (text, words, selectedWords) => {
    if (!text) return text;

    let highlightedText = text;

    if (words.length) {
      const wordsRegex = new RegExp(`(${words.join("|")})`, "gi");
      highlightedText = highlightedText.replace(
        wordsRegex,
        (match) => `<span style="background-color: yellow;">${match}</span>`
      );
    }

    if (selectedWords.length) {
      const selectedWordsRegex = new RegExp(
        `(${selectedWords.join("|")})`,
        "gi"
      );
      highlightedText = highlightedText.replace(
        selectedWordsRegex,
        (match) => `<span style="color: red;">${match}</span>`
      );
    }

    return highlightedText;
  };
  const highlightedChunkText = highlightText(
    chunk?.chunkId?.chunkText,
    highlightedWordList.map((word1) => word1.titleKR),
    selectedDictionary.map((word2) => word2.titleKR)
  );

  const handleTextSelection = (event) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPopoverPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
      setSelectedText(text);
      setPopoverVisible(true);
    } else {
      setPopoverVisible(false);
    }
  };

  useEffect(() => {
    if (chunk?.dictionaryList && dictionary) {
      const matchedWords = dictionary.filter((dict) => 
        chunk.dictionaryList.includes(dict.id)
      );
      setMyWords(matchedWords);
    }
  }, [chunk, dictionary]);

  return (
    <div className="w-full h-full flex flex-col gap-y-2">
      <div className="flex w-full h-full justify-between items-center gap-x-2">
        <div
          className={`chunks border ${isHaveSelectedDictionary ? "border-red-500 border-2" : "border-gray-300"} w-full h-full rounded-lg p-2`}
          dangerouslySetInnerHTML={{ __html: highlightedChunkText }}
          onMouseUp={handleTextSelection}
        />
        <Button
          className="text-gray-400"
          size="md"
          color=""
          variant="bordered"
          onClick={() => setIsEditorVisible(!isEditorVisible)}
        >
          수정
        </Button>
      </div>
      {isEditorVisible && (
        <div className="flex flex-row gap-x-2">
          <div className="w-full h-full border border-primary border-2 rounded-lg p-2">
            <EditorContent editor={editor} />
          </div>
          <Button
            className="text-primary"
            size="md"
            color="primary"
            variant="bordered"
            onClick={() => {
              handleSave();
              setIsEditorVisible(!isEditorVisible);
            }}
          >
            저장
          </Button>
        </div>
      )}
      {popoverVisible && (
        <Popover isOpen={popoverVisible} placement="top" offset={10}>
          <PopoverTrigger>
            <span style={{ position: 'absolute', top: popoverPosition.top, left: popoverPosition.left }} />
          </PopoverTrigger>
          <PopoverContent>
            <div className="text-medium p-2">
              <p className="text-center">선택한 단어: <span className="text-primary">{selectedText}</span></p>
              {/* Add more content or actions here */}
              <div className="flex flex-row gap-x-2">
              <Button size='sm' color='primary' variant='flat' onClick={handleAddWord}>추가</Button>
              <Button size='sm' color='primary' variant='flat' onClick={() => setPopoverVisible(false)}>닫기</Button>
              </div>
              
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default Tiptap;
