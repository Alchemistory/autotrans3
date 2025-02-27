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
import { useSelectedExpressionId } from "@/store/useSelectedExpressionId";
import { useExpressionRefresh } from "@/store/useExpressionRefresh";

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
  const { selectedExpressionId, setSelectedExpressionId } =
    useSelectedExpressionId();
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
  const [myWords, setMyWords] = useState([]);
  const { expressionRefresh, toggleExpressionRefresh } = useExpressionRefresh();
  const supabase = createClient();

  const handleAddWord = async () => {
    setStageExpression(selectedText);
  };

  const handleEditWord = async () => {
    setStageExpression(selectedText);
  };

  const handleDeleteWord = async () => {
    console.log("selectedText:", selectedText);
    const { data: expressionData, error: expressionError } = await supabase
      .from("expressionList")
      .select("*")
      .eq("title", selectedText)
      .single();
    console.log("expressionData:", expressionData);
    if (expressionError) {
      toast.error("삭제 실패1: 항목을 찾을 수 없습니다.");
      return;
    }

    const expressionId = expressionData.id;

    // Fetch all entries from expressionAnalysis where booksId and chapterId match
    const { data: analysisData, error: analysisError } = await supabase
      .from("expressionAnalysis")
      .select("*")
      .eq("booksId", booksId)
      .eq("chapterId", articleId);

    if (analysisError) {
      toast.error("삭제 실패2: 분석 항목을 찾을 수 없습니다.");
      return;
    }

    // Iterate over each entry and update the expressionList
    for (const analysisEntry of analysisData) {
      const updatedExpressionList = analysisEntry.expressionList.filter(
        (id) => id !== expressionId
      );

      const { error: updateError } = await supabase
        .from("expressionAnalysis")
        .update({ expressionList: updatedExpressionList })
        .eq("id", analysisEntry.id);

      if (updateError) {
        toast.error("삭제 실패: 업데이트 중 오류 발생");
        return;
      }
    }

    // Delete the word from expressionList
    const { error: deleteError } = await supabase
      .from("expressionList")
      .delete()
      .eq("id", expressionId);

    if (deleteError) {
      toast.error("삭제 실패3: expressionList에서 삭제 중 오류 발생");
      return;
    }

    toast.success("삭제 완료");
    getExpressionList();
    toggleExpressionRefresh();
    setSelectionType(null);
    setSelectedText("");
  };

  const handleSave = async () => {
    const changeText = editor.getText();

    // Fetch the current expressionList
    const { data: currentExpressionList, error: fetchError } = await supabase
      .from("expressionList")
      .select("*")
      .in("id", expression.expressionList);

    if (fetchError) {
      toast.error("단어 목록을 가져오는 데 실패했습니다.");
      return;
    }

    // Filter out IDs of words that are no longer in the changeText
    const updatedExpressionList = currentExpressionList
      .filter((word) => changeText.includes(word.title))
      .map((word) => word.id);

    // Update the chunk text
    const { error: updateError } = await supabase
      .from("chunks")
      .update({ chunkText: changeText })
      .eq("id", expression.chunkId.id);

    if (updateError) {
      toast.error("저장 실패");
      return;
    }

    console.log("updatedExpressionList:", updatedExpressionList);

    // Update the expressionList in the database
    const { error: listUpdateError } = await supabase
      .from("expressionAnalysis")
      .update({ expressionList: updatedExpressionList })
      .eq("id", expression.id);

    if (listUpdateError) {
      toast.success("수정 완료");
      getExpression();
    } else {
      toast.success("수정 완료");
      getExpression();
    }
  };
  console.log("expression:", expression);
  console.log("expressionList:", expressionList);

  const highlightText = (text, words, expressionList) => {
    if (!text) return text;

    let highlightedText = text;
    console.log("words:", words);
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
    // filteredExpressionList.map((word1) => word1.title)
    myWords.map((word1) => word1.title)
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

  useEffect(() => {
    if (expression?.expressionList && expressionList) {
      const matchedWords = expressionList.filter((dict) =>
        expression.expressionList.includes(dict.id)
      );
      setMyWords(matchedWords);
    }
  }, [expression, expressionList]);

  console.log("myWords:", myWords);
  console.log("selectedExpressionId:", selectedExpressionId);
  return (
    <div className="w-full h-full flex flex-col gap-y-2">
      <div className="flex w-full h-full justify-between items-center gap-x-2">
        <div
          className={`chunks border "border-gray-300" w-full h-full rounded-lg p-2`}
          dangerouslySetInnerHTML={{ __html: highlightedChunkText }}
          onMouseUp={() => {
            handleTextSelection();
            setSelectedExpressionId(expression.id);
          }}

          data-chunk-id={expression.chunkId.id}
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
                    onClick={() => {
                      handleAddWord();
                      handleClosePopover();
                      setSelectedExpressionId(expression.id);
                    }}
                  >
                    추가
                  </Button>
                ) : (
                  <div className="flex flex-row gap-x-2">
                    <Button
                      onClick={() => {
                        handleEditWord();
                        handleClosePopover();
                        setSelectedExpressionId(expression.id);
                      }}
                      size="sm"
                      color="primary"
                      variant="flat"
                    >
                      수정
                    </Button>
                    <Button
                      onClick={() => {
                        handleDeleteWord();
                        handleClosePopover();
                      }}
                      size="sm"
                      color="primary"
                      variant="flat"
                    >
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
