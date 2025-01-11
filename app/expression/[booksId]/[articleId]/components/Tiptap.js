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
import { useSelectionType } from "@/store/useSelectionType";
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
  const { selectionType, setSelectionType } = useSelectionType();
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
    // 선택된 단어를 포함하고 있는 span 요소를 찾습니다

    const { data: expressionData, error: expressionError } = await supabase
      .from("expressionList")
      .select("*")
      .eq("title", selectedText);
    if (expressionError) {
      toast.error("삭제 실패1: 항목을 찾을 수 없습니다.");
      return;
    }
    console.log("expressionData:", expressionData);
    const expressionId = expressionData.id;

    // Find all IDs where title matches selectedText
    const expressionIds = expressionData
      .filter((expression) => expression.title === selectedText)
      .map((expression) => expression.id);

    if (expressionIds.length === 0) {
      toast.error("삭제 실패: 일치하는 항목을 찾을 수 없습니다.");
      return;
    }

    console.log("expressionIds:", expressionIds);
    // Fetch all entries from expressionAnalysis where booksId and chapterId match
    const { data: analysisData, error: analysisError } = await supabase
      .from("expressionAnalysis")
      .select("*")
      .eq("booksId", booksId)
      .eq("chapterId", articleId)
      .eq("id",activePopover)
      .single()
    console.log('analysisData:',analysisData)
    if (analysisError) {
      toast.error("삭제 실패2: 분석 항목을 찾을 수 없습니다.");
      return;
    }

    // Get the current expressionList from analysisData
    const currentExpressionList = analysisData.expressionList || [];
    
    const removedIds = currentExpressionList.filter(id => expressionIds.includes(id));

    // Filter out the expressionIds from the current list
    const updatedExpressionList = currentExpressionList.filter(
      (id) => !expressionIds.includes(id)
    );

    const { error: updateError } = await supabase
      .from("expressionAnalysis")
      .update({ expressionList: updatedExpressionList })
      .eq("id", analysisData.id);

    if (updateError) {
      toast.error("삭제 실패: 업데이트 중 오류 발생");
      return;
    }
    
    // removedIds를 순차적으로 삭제
    for (const id of removedIds) {
      const { error: deleteError } = await supabase
        .from("expressionList")
        .delete()
        .eq("id", id);

      if (deleteError) {
        toast.error(`삭제 실패3: expressionList에서 ID ${id} 삭제 중 오류 발생`);
        return;
      }
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
        const chunkElement = event.target.closest(".chunks");
        if (chunkElement) {
          const chunkId = chunkElement.dataset.chunkId;
          setPopoverPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
          });
          setSelectedText(event.target.textContent);
          setPopoverVisible(true);
          setActivePopover(Number(chunkId));
          setSelectionType("hover");
        }
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
  }, []);

  useEffect(() => {
    if (expression?.expressionList && expressionList) {
      const matchedWords = expressionList.filter((dict) =>
        expression.expressionList.includes(dict.id)
      );
      setMyWords(matchedWords);
    }
  }, [expression, expressionList]);



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
      {activePopover  && selectedText && (
        <Popover
          isOpen={activePopover}
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
