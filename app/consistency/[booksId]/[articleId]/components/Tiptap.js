"use client";
import React, { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { Input, Button } from "@nextui-org/react";
import { useSelectedDictionary } from "@/store/useSelectedDictionary";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";

const Tiptap = ({ booksId, articleId, chunk, dictionary, setDictionary,fetchChunk }) => {
  const [selectedText, setSelectedText] = useState("");
  const { selectedDictionary, setSelectedDictionary } = useSelectedDictionary();
  const [highlightedContents, setHighlightedContents] = useState([]);
  const [highlightedWordList, setHighlightedWordList] = useState([]);
  const [selectedDictionaryWordList, setSelectedDictionaryWordList] = useState(
    []
  );
  const [isHaveSelectedDictionary, setIsHaveSelectedDictionary] =
    useState(false);
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: chunk?.chunkId?.chunkText || "",
  });

  const handleSave = async () => {
    console.log("editor", editor.getText());
    const { data, error } = await supabase
      .from("chunks")
      .update({ chunkText: editor.getText() })
      .eq("id", chunk.chunkId.id);
    if (error) {
      toast.error("저장 실패");
    } else {
      toast.success("수정 완료");
      fetchChunk();
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
    } else {
      setIsHaveSelectedDictionary(false);
    }
  }, [chunk, selectedDictionary]);

  const highlightText = (text, words, selectedWords) => {
    console.log("words", words);
    console.log("selectedWords", selectedWords);
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
  console.log("selectedDictionary11:", selectedDictionary);
  const highlightedChunkText = highlightText(
    chunk?.chunkId?.chunkText,
    highlightedWordList.map((word1) => word1.titleKR),
    selectedDictionary.map((word2) => word2.titleKR)
  );

  return (
    <div className="w-full h-full flex flex-col gap-y-2">
      <div className="flex w-full h-full justify-between items-center gap-x-2">
        <div
          className={`chunks border ${isHaveSelectedDictionary ? "border-red-500 border-2" : "border-gray-300"} w-full h-full rounded-lg p-2`}
          dangerouslySetInnerHTML={{ __html: highlightedChunkText }}
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
    </div>
  );
};

export default Tiptap;
