"use client";
import React from "react";
import {
  Button,
  Snippet,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useExpressionVariation } from "@/store/useExpressionVariation";
function ExpressionDetail({ booksId, articleId }) {
  const [data, setData] = useState({
    title: "",
    description: "",
    expression:
      "게임에서 일반 몬스터가 아닌, 고유한 이름이 설정된 몬스터는 특별한 취급을 받는다. '네임드'의 의미는 '이름이 붙여진 특별한 개체'라는 뜻",
  });
  const { expressionVariation, setExpressionVariation } =
    useExpressionVariation();
  const handleCopy = () => {
    navigator.clipboard.writeText(data.expression);
  };

  return (
    <div className="flex flex-col gap-y-5 h-full">
      <div>
        <h1 className="text-2xl font-bold">표현 상세</h1>
      </div>

      <div className="flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-5">
          <div>
            <h1 className="text-xl font-bold">네임드 악당</h1>
          </div>
          <div className="flex flex-col gap-y-5">
            <h1 className="text-lg font-medium">카테고리</h1>
            <Select>
              {expressionVariation.map((item) => (
                <SelectItem key={item.key} value={item.label}>
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-y-5">
            <h1 className="text-lg font-medium">설명</h1>
            {/* <div className="text-medium font-medium bg-gray-200 rounded-md p-2 text-center">
          {data.expression}
        </div> */}
            <Textarea
              value={data.expression}
              onChange={(e) => setData({ ...data, expression: e.target.value })}
            ></Textarea>
            <Snippet symbol="" onCopy={handleCopy}>
              GPT에게 물어보기
            </Snippet>
          </div>
        </div>
        <Button color="primary" className="w-full">
          추가하기
        </Button>
      </div>
    </div>
  );
}

export default ExpressionDetail;
