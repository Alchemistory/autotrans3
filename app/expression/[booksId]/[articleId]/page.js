import React from "react";
import { Divider } from "@nextui-org/divider";
import FilterList from "./components/FilterList";
import ExpressionDetail from "./components/ExpressionDetail";
import Tiptap from "./components/Tiptap";
function page({ params }) {
  const { booksId, articleId } = params;

  return (
    <div className="w-full h-full grid grid-cols-12 gap-x-3">
      <div className="col-span-9 flex flex-col gap-y-3">
        <div className="flex flex-col rounded-medium border-small border-divider p-6 bg-white gap-y-3">
          <h1 className="text-2xl font-bold">표현 필터</h1>
          <FilterList></FilterList>
        </div>
        <div className="flex flex-col gap-y-3 rounded-medium border-small border-divider p-6 bg-white mb-6">
          
          <div className="flex flex-col gap-y-3">
            <Tiptap></Tiptap>
            <Tiptap></Tiptap>
            <Tiptap></Tiptap>
            <Tiptap></Tiptap>
          </div>
        </div>
      </div>

      <div className="col-span-3 rounded-medium border-small border-divider p-6 bg-white overflow-y-auto scrollbar-hide mb-6">
        <h1 className="text-2xl font-bold">표현 상세</h1>
        <ExpressionDetail></ExpressionDetail>
      </div>
    </div>
  );
}

export default page;

