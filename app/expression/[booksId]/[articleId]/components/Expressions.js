"use client";
import React from "react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Tiptap from "./Tiptap";
import { Spinner } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import { useSelectedFilter } from "@/store/useSelectedFilter"


function Expressions({ booksId, articleId }) {
  const supabase = createClient();
  const [expressions, setExpressions] = useState([]);
  const [expressionList, setExpressionList] = useState([]);
  const [filteredExpressionList, setFilteredExpressionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [changeFlag, setChangeFlag] = useState(false);
  const { selectedFilter } = useSelectedFilter();
  const [activePopover, setActivePopover] = useState(null);

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
  }, [selectedFilter, expressionList, changeFlag]);

  console.log('filteredExpressionList:',filteredExpressionList)

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
    
    if (error) console.log(error);
    setExpressions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getExpressions();
    getExpressionList();
  }, [changeFlag]);
  console.log("expressions:", expressions);
  console.log("expressionList:", expressionList);

  return (
    <div className="flex flex-col gap-y-3">
      <ToastContainer
        autoClose={1000}
        hideProgressBar={false}
        position="top-center"
      />
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
