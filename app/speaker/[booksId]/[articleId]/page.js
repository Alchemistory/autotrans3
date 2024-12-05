import React from "react";
import Tiptap from "./components/Tiptap";
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
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";

export default async function page({ params }) {
  const { booksId, articleId } = params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chapterList")
    .select("*")
    .eq("booksId", booksId)
    .eq("id", articleId)
    .single();
  console.log("data:", data);

  return (
    <div>
      <div className="flex flex-row w-full h-16 rounded-2xl mb-5 border-2 border-gray-200">
        <div className="w-1/2 h-full relative  flex flex-col justify-center">
          <p className="text-center">챕터명(국문)</p>
          <p className="text-center">{data?.titleKR}</p>
          <div className="absolute right-0 top-[15%] bottom-[15%] w-0.5 bg-gray-200"></div>
        </div>
        <div className="w-1/2 h-full relative  flex flex-col justify-center">
          <p className="text-center">챕터명(영문)</p>
          <p className="text-center">{data?.titleEN}</p>
          <div className="absolute right-0 top-[15%] bottom-[15%] w-0.5 bg-gray-200"></div>
        </div>
        <div className="w-1/2 h-full  flex flex-col justify-center">
          <p className="text-center">챕터번호</p>
          <p className="text-center">{data?.chapterNumber}</p>
        </div>
      </div>
      <Card className="w-full shadow-none border-2 border-gray-200">
        <CardBody className="grid grid-cols-12 p-3">
          <div className="col-span-2 flex flex-col justify-start items-start px-5">
            <p className="text-start">화자</p>
            <Input variant="bordered" className="my-2 border-gray-200"></Input>
          </div>
          <div className="col-span-2 flex flex-col justify-start items-start px-5">
            <p className="text-start">타입</p>
            <div>

            </div>
            <Input variant="bordered" className="my-2 border-gray-200"></Input>
          </div>
          <div className="col-span-8 flex flex-col justify-evenly px-5 ">
            <p className="text-start">본문</p>
            <Tiptap />
          </div>
        </CardBody>
        <CardFooter className="flex flex-row justify-end gap-x-5 p-3">
          <button>
            <FaCirclePlus className="text-4xl text-primary" />
          </button>
          <button className="min-w-0 p-0">
            <FaCircleMinus className="text-4xl text-danger-500" />
          </button>
        </CardFooter>
      </Card>
      <div className="flex flex-row justify-end my-5">
        <Button color="primary">저장</Button>
      </div>
      <div>
        
      </div>
    </div>
  );
}
