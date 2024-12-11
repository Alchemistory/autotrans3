import React from "react";
import {Divider} from "@nextui-org/divider";
import Dictionary from "./components/Dictionary";
import Chunk from "./components/Chunk";
import ItemList from "./components/ItemList";

function page({ params }) {
  const { booksId, articleId } = params;

  return (
    <div className="w-full h-full grid grid-cols-12 gap-x-3">
      <div className="col-span-3 rounded-medium border-small border-divider p-6 bg-white overflow-y-auto scrollbar-hide">
      <h1>일관성 사전</h1>
        <Dictionary />
      </div>
      
      <div className="col-span-6 rounded-medium border-small border-divider p-6 bg-white overflow-y-auto scrollbar-hide">
        <h1>청크</h1>
        <Chunk />
      </div>
      
      <div className="col-span-3 rounded-medium border-small border-divider p-6 bg-white overflow-y-auto scrollbar-hide">
        <h1>청크 내 항목 리스트</h1>
        <ItemList />
      </div>
    </div>
  );
}

export default page;
