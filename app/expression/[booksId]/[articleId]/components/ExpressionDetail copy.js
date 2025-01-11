"use client";
import {
  Button,
  Snippet,
  Select,
  SelectItem,
  Textarea,
  Input,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useExpressionVariation } from "@/store/useExpressionVariation";
import { useStageExpression } from "@/store/useStageExpression";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import { useExpressionRefresh } from "@/store/useExpressionRefresh";
import { useSelectedExpressionId } from "@/store/useSelectedExpressionId";
import { useExpressions } from "@/store/useExpressions";
import { useExpressionList } from "@/store/useExpressionList";
import { useChapterList } from "@/store/useChapterList";
function ExpressionDetail({ booksId, articleId }) {
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [text, setText] = useState("");
  const { expressions, setExpressions } = useExpressions();
  const { expressionList, setExpressionList } = useExpressionList();
  const { expressionRefresh, toggleExpressionRefresh } = useExpressionRefresh();
  const { selectedExpressionId, setSelectedExpressionId } = useSelectedExpressionId();
  const { expressionVariation, setExpressionVariation } =
    useExpressionVariation();
  const { stageExpression, setStageExpression } = useStageExpression();
  const { chapterList, setChapterList } = useChapterList();
  const [myExpression, setMyExpression] = useState({});
  const [myWords, setMyWords] = useState({});
  const handleCopy = () => {
    navigator.clipboard.writeText(selectedDescription);
  };


  
  const supabase = createClient();

  useEffect(() => {
    if (expressions && selectedExpressionId) {
      const matchedWord = expressions.find(
        (expression) => expression.id === selectedExpressionId
      );
      setMyExpression(matchedWord || {});
    }
  }, [expressions, selectedExpressionId]);


  useEffect(() => {
    const fetchExpressionData = async () => {
      if (stageExpression) {
        const { data: expressionData, error } = await supabase
          .from("expressionList")
          .select("*")
          .eq("booksId", booksId)
          .eq("chapterId", articleId)
          .eq("title", stageExpression)
          .single();

        if (error) {
          console.log("Error fetching expression data:", error);
          setData({ description: "", category: "" });
        } else if (expressionData) {
          setSelectedDescription(expressionData.description || "");
          setSelectedCategory(expressionData.category || "");
        } else {
          setData({ description: "", category: "" });
        }
      }
    };

    fetchExpressionData();
  }, [stageExpression, booksId, articleId]);
  


  const handleAddWord = async () => {
    const { data, error } = await supabase.from("expressionList").insert({
      title: stageExpression,
      category: selectedCategory,
      booksId: booksId,
      chapterId: articleId,
      description: selectedDescription,
    }).select();

    if (error) {
      toast.error(error.message);
    } else {
      if (data && data.length > 0) {
        const insertedId = data[0].id;
        
        // Fetch all entries from expressionAnalysis where booksId and chapterId match
        const { data: analysisData, error: analysisError } = await supabase
          .from("expressionAnalysis")
          .select("*,chunkId(*)")
          .eq("booksId", booksId)
          .eq("chapterId", articleId);

        if (analysisError) {
          toast.error(analysisError.message);
        } else if (analysisData) {
          // Iterate over each entry to update their expressionList
          for (const entry of analysisData) {
            // Check if the chunkText contains the stageExpression
            if (entry.chunkId.chunkText.includes(stageExpression)) {
              // Update the expressionList with the new insertedId
              const updatedList = [...new Set([...entry.expressionList, insertedId])];

              // Update the expressionAnalysis table with the new list for each entry
              const { error: updateError } = await supabase
                .from("expressionAnalysis")
                .update({ expressionList: updatedList })
                .eq("id", entry.id);

              if (updateError) {
                toast.error(updateError.message);
              }
            }
          }
          toast.success("표현 추가 및 분석 업데이트 완료");
        }
      }
      setStageExpression(null);
      toggleExpressionRefresh();
    }
  };
  

  const handleEditWord = async () => {
    const { data, error } = await supabase
      .from("expressionList")
      .update({
        category: selectedCategory,
        description: selectedDescription,
      })
      .eq("title", stageExpression)
      .eq('booksId', booksId)
      .eq('chapterId', articleId)

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("표현 수정 완료");
      setStageExpression(null);
      toggleExpressionRefresh();
    }
  };

  return (
    <div
      className={`col-span-3 rounded-medium  p-6 bg-white overflow-y-auto scrollbar-hide ${
        stageExpression
          ? "border-primary border-3"
          : "border-divider border-small"
      }`}
    >
      <div className="grid gap-y-5 h-full grid-rows-12">
        <div className="row-span-1">
          <h1 className="text-2xl font-bold">표현 상세</h1>
        </div>

        <div className="row-span-9 flex flex-col gap-y-5 overflow-y-auto scrollbar-hide">
          {stageExpression ? (
            <div className="flex flex-col gap-y-5">
              <div className="flex flex-col gap-y-5">
                <div>
                  <h1 className="text-xl font-bold">{stageExpression}</h1>
                </div>
                <div className="flex flex-col gap-y-5">
                  <h1 className="text-lg font-medium">카테고리</h1>
                  <Select
                    selectedKeys={new Set([selectedCategory])} // Use selectedKeys to control the selected value
                    onSelectionChange={(keys) =>
                      setSelectedCategory(Array.from(keys)[0])
                    } // Update state on change
                  >
                    {expressionVariation.map((item) => (
                      <SelectItem key={item.key} value={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="flex flex-col gap-y-5">
                  <h1 className="text-lg font-medium">설명</h1>
                  <Textarea
                    placeholder=""
                    className={`w-full bg-gray-200}`}
                    value={selectedDescription}
                    onChange={(e) => setSelectedDescription(e.target.value)}
                  />
                  <Snippet symbol="" onCopy={handleCopy}>
                    GPT에게 물어보기
                  </Snippet>
                  <input />
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="row-span-2 flex justify-center items-end">
          <Button
            isDisabled={!stageExpression || chapterList?.isFixedExpression}
            color="primary"
            className="w-full"
            onClick={handleAddWord}
          >
            적용하기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ExpressionDetail;
