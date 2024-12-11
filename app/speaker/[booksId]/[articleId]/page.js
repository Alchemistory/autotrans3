import React from "react";
import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Input,
  Button,
  Switch
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import ContextCard from "./components/ContextCard";


export default async function page({ params }) {
  const { booksId, articleId } = params;
  const supabase = await createClient();

  const { data: data1, error: error1 } = await supabase
    .from("chapterList")
    .select("*")
    .eq("booksId", booksId)
    .eq("id", articleId)
    .single();
  console.log('data1:',data1)
  const isFixed = data1?.isFixed;
  
  return (
    <div>
      <div className="flex flex-row w-full h-16 rounded-2xl mb-5 border-2 border-gray-200">
        <div className="w-1/2 h-full relative  flex flex-col justify-center">
          <p className="text-center">챕터명(국문)</p>
          <p className="text-center">{data1?.titleKR}</p>
          <div className="absolute right-0 top-[15%] bottom-[15%] w-0.5 bg-gray-200"></div>
        </div>
        <div className="w-1/2 h-full relative  flex flex-col justify-center">
          <p className="text-center">챕터명(영문)</p>
          <p className="text-center">{data1?.titleEN}</p>
          <div className="absolute right-0 top-[15%] bottom-[15%] w-0.5 bg-gray-200"></div>
        </div>
        <div className="w-1/2 h-full  flex flex-col justify-center">
          <p className="text-center">챕터번호</p>
          <p className="text-center">{data1?.chapterNumber}</p>
        </div>
      </div>
      <ContextCard isFixed={isFixed} booksId={booksId} chapterId={articleId}></ContextCard>
      

    </div>
  );
}
