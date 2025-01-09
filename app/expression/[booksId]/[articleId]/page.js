import React from "react";
import { Divider } from "@nextui-org/divider";
import FilterList from "./components/FilterList";
import ExpressionDetail from "./components/ExpressionDetail";
import Tiptap from "./components/Tiptap";
import Expressions from "./components/Expressions";
import { ToastContainer, toast } from "react-toastify";

function page({ params }) {
  const { booksId, articleId } = params;

  return (
    <>
      <div className="w-full h-full grid grid-cols-12 gap-x-3 pb-6">
        <div className="col-span-9 flex flex-col gap-y-3 h-full">
          <div className="flex flex-col rounded-medium border-small border-divider p-6 bg-white gap-y-3">
            <h1 className="text-2xl font-bold">표현 필터</h1>
            <FilterList></FilterList>
          </div>
          <div className="flex flex-col gap-y-3 rounded-medium border-small border-divider p-6 bg-white h-full">
            <div className="flex flex-col gap-y-3">
              {/* <Tiptap></Tiptap> */}
              <Expressions
                booksId={booksId}
                articleId={articleId}
              ></Expressions>
            </div>
          </div>
        </div>

        {/* <div className="col-span-3 rounded-medium border-small border-divider p-6 bg-white overflow-y-auto scrollbar-hide "> */}

        <ExpressionDetail
          booksId={booksId}
          articleId={articleId}
        ></ExpressionDetail>
        {/* </div> */}
      </div>
      <ToastContainer
        autoClose={1000}
        hideProgressBar={false}
        position="top-center"
      />
    </>
  );
}

export default page;
