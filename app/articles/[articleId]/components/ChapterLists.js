import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  Card,
  CardBody,
  Input,
  Textarea,
  CardHeader,
  CardFooter,
} from "@nextui-org/react";
import { supabase } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
export default function ChapterLists({ articleId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [chapterNumber, setChapterNumber] = useState("");
  const [titleKR, setTitleKR] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [contents, setContents] = useState("");
  const [chapterList, setChapterList] = useState([]);
  const router = useRouter();

  const supabase = createClient();

  const getChapterList = async () => {
    const { data, error } = await supabase
      .from("chapterList")
      .select("*")
      .eq("booksId", articleId)
      .order("chapterNumber", { ascending: true });

    if (error) {
      console.log(error);
    } else {
      setChapterList(data);
    }
  };

  const handleCreateChapter = async () => {
    const { data, error } = await supabase.from("chapterList").insert({
      booksId: articleId,
      chapterNumber: chapterNumber,
      titleKR: titleKR,
      titleEN: titleEN,
      contents: contents,
    });
    if (error) {
      toast.error("회차 생성에 실패했습니다.");
    } else {
      toast.success("회차 생성에 성공했습니다.");
      setChapterNumber("");
      setTitleKR("");
      setTitleEN("");
      setContents("");
      getChapterList();
    }
  };

  useEffect(() => {
    getChapterList();
  }, []);
  console.log('chapterList', chapterList)

  return (
    <div className="w-full h-full">
      <ToastContainer
        autoClose={1000}
        hideProgressBar={false}
        position="top-center"
      />
      <Button className="w-full my-5" color="primary" onPress={onOpen}>
        회차 새로 만들기+
      </Button>
      <div className="flex flex-col gap-5">
        {chapterList.map((chapter, index) => (
          <Card className="w-full h-36 md:h-24" key={index}>
            <CardBody className="grid grid-cols-12 justify-between items-center px-5 md:px-20">
              <div className="col-span-12 md:col-span-6">
                <p className="text-center md:text-left">{chapter.chapterNumber}화</p>
                <p className="text-center md:text-left">{chapter.titleKR}</p>
              </div>
              <div className="col-span-12 md:col-span-6 flex flex-row gap-5 justify-center md:justify-end items-center">
                <div className="flex flex-col md:flex-row justify-center items-center">
                  <Chip color="warning">
                    {chapter.status === "ai" &&
                      "문장 유형 및 발화자 AI 분석 필요"}
                    {chapter.status === "aiUser" &&
                      "문장 유형 및 발화자 유저 검토 필요"}
                    {chapter.status === "consistency" &&
                      "일관성 및 표현 AI 분석 필요"}
                    {chapter.status === "consistencyUser" &&
                      "일관성 및 표현 유저 검토 필요"}
                    {chapter.status === "complete" && "원문 분석 완료"}
                  </Chip>
                  <Button
                    onClick={() => {
                      router.push(`/speaker/${articleId}/${chapter.id}`);
                    }}
                    className="ml-0 md:ml-5"
                    color="primary"
                    variant="light"
                    
                  >
                    문장유형 검토
                  </Button>
                  <Button
                    onClick={() => {
                      router.push(`/consistency/${articleId}/${chapter.id}`);
                    }}

                    className="ml-0 md:ml-5"
                    color="primary"
                    variant="light"
                    isDisabled={!chapter.isFixedSpeaker}
                  >
                    일관성 검토
                  </Button>
                  <Button
                    onClick={() => {
                      router.push(`/expression/${articleId}/${chapter.id}`);
                    }}
                    className="ml-0 md:ml-5"
                    color="primary"
                    variant="light"
                    isDisabled={!chapter.isFixedSpeaker}
                  >
                    표현 검토
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl">
                새로운 회차 만들기
              </ModalHeader>
              <ModalBody>
                <h1 className="text-lg">회차 번호</h1>
                <Input
                  placeholder="회차 번호"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(e.target.value)}
                />
                <h1 className="text-lg">회차 소제목(한글)</h1>
                <Input
                  placeholder="회차 소제목(한글)"
                  value={titleKR}
                  onChange={(e) => setTitleKR(e.target.value)}
                />
                <h1 className="text-lg">회차 소제목(영어)</h1>
                <Input
                  placeholder="회차 소제목(영어)"
                  value={titleEN}
                  onChange={(e) => setTitleEN(e.target.value)}
                />
                <h1 className="text-lg">원문 텍스트</h1>
                <Textarea
                  label=""
                  placeholder="원문 텍스트 입력"
                  className="w-full h-full"
                  value={contents}
                  onChange={(e) => setContents(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  닫기
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    handleCreateChapter();
                  }}
                >
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
