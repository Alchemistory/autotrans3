"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import { useStageExpression } from "@/store/useStageExpression";
function SimpleTiptap({
  booksId,
  articleId,
  expression,
  expressionList,
  filteredExpressionList,
  getExpression,
  getExpressionList,
  changeFlag,
  setChangeFlag,
  activePopover,
  setActivePopover,
}) {
  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: expression?.chunkId?.chunkText || "",
  });

  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [selectionType, setSelectionType] = useState(null);
  const { stageExpression, setStageExpression } = useStageExpression();

  const supabase = createClient();

  const handleAddWord = async () => {
    const { data, error } = await supabase.from("expressionList").insert({
      title: selectedText,
      category: "",
      booksId: booksId,
      chapterId: articleId,
      description: "",
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("단어 추가 완료");
      getExpression();
      setChangeFlag((prev) => !prev);
    }
  };
  const handleSave = async () => {
    console.log("editor", editor.getText());
    const { data, error } = await supabase
      .from("chunks")
      .update({ chunkText: editor.getText() })
      .eq("id", expression.chunkId.id);
    if (error) {
      toast.error("저장 실패");
    } else {
      toast.success("수정 완료");
      getExpression();
    }
  };

  const highlightText = (text, words, expressionList) => {
    if (!text) return text;

    let highlightedText = text;

    if (words.length) {
      const wordsRegex = new RegExp(`(${words.join("|")})`, "gi");
      highlightedText = highlightedText.replace(
        wordsRegex,
        (match) =>
          `<span class="selected-word" style="background-color: yellow; cursor: pointer;">${match}</span>`
      );
    }

    return highlightedText;
  };

  const highlightedChunkText = highlightText(
    expression?.chunkId?.chunkText,
    filteredExpressionList.map((word1) => word1.title)
  );

  const handleTextSelection = (event) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPopoverPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setSelectedText(text);
      setActivePopover(expression.chunkId.id);
      setSelectionType("drag");
    } else {
      setActivePopover(null);
      setSelectionType(null);
    }
  };

  const handleClosePopover = () => {
    setActivePopover(null);
    setSelectedText("");
  };

  useEffect(() => {
    const handleMouseOver = (event) => {
      if (event.target.classList.contains("selected-word")) {
        const rect = event.target.getBoundingClientRect();
        setPopoverPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        });
        setSelectedText(event.target.textContent);
        setPopoverVisible(true);
        setActivePopover(expression.chunkId.id);
        setSelectionType("hover");
      }
    };

    const handleMouseOut = (event) => {
      if (event.target.classList.contains("selected-word")) {
        setPopoverVisible(false);
        setActivePopover(null);
        setSelectionType(null);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [expression.chunkId.id]);

  return (
    <div className="w-full h-full flex flex-col gap-y-2">
      <div className="flex w-full h-full justify-between items-center gap-x-2">
        <div
          className={`chunks border "border-gray-300" w-full h-full rounded-lg p-2`}
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
      {activePopover === expression.chunkId.id && selectedText && (
        <Popover
          isOpen={activePopover === expression.chunkId.id}
          placement="top"
          offset={5}
        >
          <PopoverTrigger>
            <span
              style={{
                position: "absolute",
                top: popoverPosition.top,
                left: popoverPosition.left,
              }}
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className="text-medium py-2 px-4 relative flex flex-col items-center">
              <button
                className="absolute top-1 right-1 p-1  rounded-full "
                onClick={handleClosePopover}
                aria-label="Close"
              >
                &times;
              </button>
              <p className="text-center mt-4">
                <span className="text-primary text-center">{selectedText}</span>
              </p>
              <div className="flex flex-col gap-y-2 mt-2">
                {selectionType === "drag" ? (
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onClick={handleAddWord}
                  >
                    추가
                  </Button>
                ) : (
                  <div className="flex flex-row gap-x-2">
                    <Button size="sm" color="primary" variant="flat">
                      수정
                    </Button>
                    <Button size="sm" color="primary" variant="flat">
                      삭제
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export default SimpleTiptap;
