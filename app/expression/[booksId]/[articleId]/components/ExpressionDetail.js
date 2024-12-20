'use client'
import React from 'react'
import { Button,Snippet } from '@nextui-org/react'
import { useState,useEffect } from 'react'
function ExpressionDetail() {
  const [data,setData] = useState({title:"",description:"",expression:"게임에서 일반 몬스터가 아닌, 고유한 이름이 설정된 몬스터는 특별한 취급을 받는다. '네임드'의 의미는 '이름이 붙여진 특별한 개체'라는 뜻"})

  const handleCopy = () => {
    navigator.clipboard.writeText(data.expression);
  };

  return (
    <div className="flex flex-col gap-y-5 my-5">
      <div>
        <h1 className="text-xl font-bold">네임드 악당</h1>
      </div>
      <div className="flex flex-col gap-y-5">
      <h1 className="text-lg font-medium">
        카테고리
      </h1>
      <div className="text-medium font-medium bg-gray-200 rounded-md p-2 text-center">사용자 지정 표현</div>
      </div>
      

      
      <div className="flex flex-col gap-y-5">
        <h1 className="text-lg font-medium">설명</h1>
        <div className="text-medium font-medium bg-gray-200 rounded-md p-2 text-center">
          {data.expression}
        </div>
        <Snippet symbol="" onCopy={handleCopy}>
          GPT에게 물어보기
        </Snippet>
      </div>

      <Button color="primary" className="w-full">추가하기</Button>
    </div>
  )
}

export default ExpressionDetail