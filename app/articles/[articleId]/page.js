"use client";
import React from "react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  Image,
  Input,
  Chip,
  CardHeader,
  CardFooter,
  Divider,
  Link,
  Card,
  Spinner,
  Tabs,
  Tab,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import ChapterLists from "./components/ChapterLists";
import DictionaryList from "./components/DictionaryList";
export default function Page({ params }) {
  const unwrappedParams = React.use(params);
  const { articleId } = unwrappedParams;
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [selectedTab, setSelectedTab] = useState("회차목록");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const getArticle = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", articleId)
      .single();
    setArticle(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getArticle();
  }, []);

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          <div className="flex flex-row justify-between">
            <div>
              <p className="text-2xl text-start">{article?.titleKR}</p>
              <p className="text-lg text-gray-500 text-start">
                {article?.titleEN}
              </p>
              <p>생성일 : {formatTimestamp(article?.created_at)}</p>
            </div>
            <div>
              <Button color="primary">수정하기</Button>
            </div>
          </div>
          <div className="flex flex-row w-full h-16 rounded-2xl my-5 border border-gray-200">
            <div className="w-1/2 h-full relative  flex flex-col justify-center">
              <p className="text-center">작가</p>
              <p className="text-center">{article?.authorKR}</p>
              <div className="absolute right-0 top-[15%] bottom-[15%] w-[1px] bg-gray-300"></div>
            </div>
            <div className="w-1/2 h-full  flex flex-col justify-center">
              <p className="text-center">장르</p>
              <p className="text-center">{article?.genre?.join(" | ")}</p>
            </div>
          </div>
          <div className="w-full">
            <Tabs
              fullWidth
              aria-label="Options"
              defaultSelectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
            >
              <Tab key="회차목록" title="회차목록"></Tab>
              <Tab key="용어집" title="용어집"></Tab>
              <Tab key="등장인물" title="등장인물"></Tab>
            </Tabs>
          </div>
          {selectedTab === "회차목록" && <ChapterList articleId={articleId}></ChapterList>} 
          {selectedTab === "용어집" && <DictionaryList articleId={articleId}></DictionaryList>}
        </>
      )}
    </div>
  );
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
