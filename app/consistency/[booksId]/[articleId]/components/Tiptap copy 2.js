"use client";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { Skeleton } from "@nextui-org/react";
import Highlight from "@tiptap/extension-highlight";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import {useRouter} from 'next/navigation'
import {useSelectedDictionary} from '@/store/useSelectedDictionary'

function Tiptap({ booksId, articleId, chunk, dictionary, setDictionary }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [highlightedContents, setHighlightedContents] = useState([]);
  const [highlightedWords, setHighlightedWords] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const [savedSelections, setSavedSelections] = useState([]);
  const supabase = createClient();
  const router = useRouter();
  const { selectedDictionary, setSelectedDictionary } = useSelectedDictionary();

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

  console.log("selectedWord:", selectedWord);
  const handleAddWord = async () => {
    const { data, error } = await supabase.from("dictionaryList").insert({
      titleKR: selectedWord,
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

  const handleSaveSelection = () => {
    if (selectedWord) {
      setSavedSelections((prevSelections) => [...prevSelections, selectedWord]);
      console.log("Saved Selections:", savedSelections);
    }
  };

  useEffect(() => {
    if (chunk && chunk.chunkId && chunk.chunkId.chunkText) {
      setIsLoading(false);
    }

    if (chunk && chunk.dictionaryList) {
      const newHighlightedContents = dictionary
        ?.filter((dictItem) => chunk.dictionaryList.includes(dictItem.id))
        .map((dictItem) => dictItem.titleKR);

      setHighlightedContents(newHighlightedContents);
      setHighlightedWords(true);
    }
  }, [chunk, dictionary]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      setSelectedWord(selection.toString());
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Highlight.configure({ multicolor: true })],
    content: chunk?.chunkId?.chunkText || "",
    onCreate: ({ editor }) => {
      if (highlightedWords) {
        highlightText(editor);
      }
    },
    onUpdate: ({ editor }) => {
      // Removed the previous logic for setting selectedWord
    },
  });

  const highlightText = (editor) => {
    const content = editor.getJSON();
    const transactions = [];

    const traverseAndHighlight = (node, startPos = 0) => {
      if (node.type === "text" && Array.isArray(highlightedContents)) {
        highlightedContents.forEach((item) => {
          const regex = new RegExp(item, "g");
          let match;
          while ((match = regex.exec(node.text)) !== null) {
            transactions.push({
              from: startPos + match.index + 1,
              to: startPos + match.index + match[0].length + 1,
              attrs: { color: "yellow" },
            });
          }
        });
      }

      if (node.content) {
        let currentPos = startPos;
        node.content.forEach((childNode) => {
          traverseAndHighlight(childNode, currentPos);
          currentPos += childNode.text?.length || 0;
        });
      }
    };

    content.content?.forEach(traverseAndHighlight);

    transactions.forEach(({ from, to, attrs }) => {
      editor
        .chain()
        .focus()
        .setTextSelection({ from, to })
        .setMark("highlight", attrs)
        .setTextSelection({ from: to })
        .run();
    });

    // Deselect all text after highlighting
    editor.chain().focus().setTextSelection({ from: 0, to: 0 }).run();
  };

  const renderBubbleMenu = () => (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <Button
        color="primary"
        auto
        flat
        onClick={() => {
          handleAddWord();
          console.log("Selected Text:", selectedWord);
          editor.chain().focus().blur().run();
        }}
      >
        추가
      </Button>
    </BubbleMenu>
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4 relative flex-grow">
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-2 w-full rounded-lg" />
          <Skeleton className="h-2 w-3/4 rounded-lg" />
        </div>
      ) : (
        <>
          {editor && renderBubbleMenu()}
          <EditorContent
            editor={editor}
            className="[&_mark]:hover:cursor-pointer"
          />
        </>
      )}
    </div>
  );
}

export default Tiptap;
