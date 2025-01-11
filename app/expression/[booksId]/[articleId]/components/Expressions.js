"use client";
import React from "react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Tiptap from "./Tiptap";
import { Spinner } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import { useSelectedFilter } from "@/store/useSelectedFilter"
import { useExpressionRefresh } from "@/store/useExpressionRefresh";
import { useExpressions } from "@/store/useExpressions";
import { useExpressionList } from "@/store/useExpressionList";
import { useActivePopoverId } from "@/store/useActivePopoverId";
function Expressions({ booksId, articleId }) {
  const supabase = createClient();
  const {expressions, setExpressions} = useExpressions();
  const {expressionList, setExpressionList} = useExpressionList();
  const [filteredExpressionList, setFilteredExpressionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [changeFlag, setChangeFlag] = useState(false);
  const { selectedFilter } = useSelectedFilter();
  const [activePopover, setActivePopover] = useState(null);
  const {expressionRefresh, toggleExpressionRefresh} = useExpressionRefresh();
  const {activePopoverId, setActivePopoverId} = useActivePopoverId();

  useEffect(() => {
    if (activePopover !== null) {
      setActivePopoverId(activePopover);
    }
  }, [activePopover]);

  console.log("activePopoverId:", activePopoverId);

  const getExpressionList = async () => {
    const { data, error } = await supabase
      .from("expressionList")
      .select("*")
      .eq("booksId", booksId)
      .eq("chapterId", articleId);
    if (error) console.log(error);
    setExpressionList(data);
  };

  useEffect(() => {
    if (selectedFilter.includes("전체")) {
      setFilteredExpressionList(expressionList);
    } else if (selectedFilter.includes("사용자 지정 표현")) {
      setFilteredExpressionList(expressionList.filter(expression => expression.category === "사용자 지정 표현"));
    } else {
      setFilteredExpressionList(expressionList.filter(expression => selectedFilter.includes(expression.category)));
    }
  }, [selectedFilter, expressionList, changeFlag, expressionRefresh]);


  const getExpressions = async () => {
    let { data, error } = await supabase
      .from("expressionAnalysis")
      .select(
        `
        *,
        chunkId(*)
      `
      )
      .eq("booksId", booksId)
      .eq("chapterId", articleId)
      .order('id', { ascending: true })
    
    if (error) console.log(error);
    setExpressions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getExpressions();
    getExpressionList();
  }, [changeFlag, expressionRefresh]);

  return (
    <div className="flex flex-col gap-y-3">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner size="lg" />
        </div>
      ) : (
        expressions?.map((expression) => (
          <div key={expression.id}>
            <Tiptap
              getExpression={getExpressions}
              booksId={booksId}
              articleId={articleId}
              expression={expression}
              expressionList={expressionList}
              filteredExpressionList={filteredExpressionList}
              getExpressionList={getExpressionList}
              changeFlag={changeFlag}
              setChangeFlag={setChangeFlag}
              activePopover={activePopover}
              setActivePopover={setActivePopover}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default Expressions;
