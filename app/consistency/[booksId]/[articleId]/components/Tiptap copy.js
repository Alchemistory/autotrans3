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
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none',
      },
    },
    parseOptions: {
      preserveWhitespace: true,
    },
  });

  useEffect(() => {
    if (editor && highlightedWords && highlightedContents?.length) {
      const currentSelection = editor.state.selection;
      
      // 초기 상태로 리셋
      editor.chain()
        .focus()
        .selectAll()
        .unsetHighlight()
        .run();

      const content = editor.getHTML();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const plainText = tempDiv.textContent;

      // 일반 하이라이트 단어들의 매치를 찾아서 배열로 저장
      const matches = [];
      highlightedContents.forEach((word) => {
        const regex = new RegExp(word, 'g');
        let match;
        while ((match = regex.exec(plainText)) !== null) {
          matches.push({
            word,
            index: match.index,
            length: match[0].length,
            type: 'normal'
          });
        }
      });

      // selectedDictionary 단어의 매치를 찾아서 배열에 추가
      if (selectedDictionary?.titleKR) {
        const regex = new RegExp(selectedDictionary.titleKR, 'g');
        let match;
        while ((match = regex.exec(plainText)) !== null) {
          matches.push({
            word: selectedDictionary.titleKR,
            index: match.index,
            length: match[0].length,
            type: 'selected'
          });
        }
      }

      // 매치된 모든 부분을 하이라이트 (타입에 따라 다른 색상 적용)
      matches.forEach(({index, length, type}) => {
        editor.chain()
          .setTextSelection({
            from: index + 1,
            to: index + 1 + length
          })
          .setHighlight({ 
            color: type === 'selected' ? '#90CDF4' : 'yellow' // selected는 하늘색, 일반은 노란색
          })
          .run();
      });

      // 원래 커서 위치로 복원
      editor.commands.setTextSelection(currentSelection);
    }
  }, [editor, highlightedWords, highlightedContents, selectedDictionary]);

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
