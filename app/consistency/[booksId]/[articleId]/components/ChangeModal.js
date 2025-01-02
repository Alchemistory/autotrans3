"use client";
import React from "react";
import { GoPencil } from "react-icons/go";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Divider,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Button,
} from "@nextui-org/react";
import WordModal from "./WordModal";
import SentenceModal from "./SentenceModal";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import { createClient } from "@/utils/supabase/client";
function ChangeModal({ dictionary, item, booksId, articleId, categories, getDictionary, myId, setMyId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [changedCategoryLarge, setChangedCategoryLarge] = useState(item.categoryLarge);
  const [changedCategoryMiddle, setChangedCategoryMiddle] = useState(item.categoryMiddle);
  const [changedCategorySmall, setChangedCategorySmall] = useState(item.categorySmall);
  const [changedWordId, setChangedWordId] = useState(item.word);
  const [changedSentenceId, setChangedSentenceId] = useState(item.sentence);
  const [changedWord, setChangedWord] = useState(null);
  const [changedSentence, setChangedSentence] = useState(null);
  const [referenceCategoryLarge, setReferenceCategoryLarge] = useState(item.categoryLarge);
  const [referenceCategoryMiddle, setReferenceCategoryMiddle] = useState(item.categoryMiddle);
  const [referenceCategorySmall, setReferenceCategorySmall] = useState(item.categorySmall);
  const supabase = createClient();
  const handleSave = async () => {
    const { error } = await supabase
      .from("dictionaryList")
      .update({
        categoryLarge: changedCategoryLarge,
        categoryMiddle: changedCategoryMiddle,
        categorySmall: changedCategorySmall,
        isFixed:true,
      })
      .eq("booksId", booksId)
      .eq("id", myId)
      

    if (error) {
      console.log(error);
    } else {
      toast.success("저장되었습니다.");
      getDictionary();
      setChangedWordId(null);
      setChangedSentenceId(null);
      
    }
  };

  useEffect(() => {
    if (changedWordId) {
      const selectedWord = dictionary.find((item) => item.id === changedWordId);
      if (selectedWord) {
        setChangedCategoryLarge(selectedWord.categoryLarge);
        setChangedCategoryMiddle(selectedWord.categoryMiddle);
        setChangedCategorySmall(selectedWord.categorySmall);
      }
    }
  }, [changedWordId]);

  useEffect(() => {
    if (changedWordId) {
      setChangedWord(dictionary.find((item) => item.id === changedWordId));
    }
    if (changedSentenceId) {
      setChangedSentence(dictionary.find((item) => item.id === changedSentenceId));
    }
  }, [changedWordId, changedSentenceId]);
  
  return (
    <>
      {/* <ToastContainer
        autoClose={1000}
        hideProgressBar={false}
        position="top-center"
      /> */}
      <Button
        className="m-0 p-0"
        isIconOnly
        aria-label="Like"
        color=""
        onClick={()=>{
          onOpen();
          setMyId(item.id);
        }}
      >
        <GoPencil className="text-gray-500" />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p className="text-2xl">{item.titleKR}</p>
                <p className="text-lg text-gray-500">{item.titleEN}</p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-row gap-x-2 justify-between items-center">
                  <h1 className="flex-shrink-0">대분류</h1>
                  <Select
                    defaultSelectedKeys={[item.categoryLarge]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0];
          
                      setChangedCategoryLarge(key);
          
                    }}
                  >
                    {categories
                      .filter((category) => category.variant === "large")
                      .map((category) => (
                        <SelectItem onChange={(e)=>{
                          setChangedCategoryLarge(e.target.value);
                        }} key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </Select>
                </div>
                <div className="flex flex-row gap-x-2 justify-between items-center">
                  <h1 className="flex-shrink-0">중분류</h1>
                  <Select
                    defaultSelectedKeys={[item.categoryMiddle]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0];
                      setChangedCategoryMiddle(key);
                    }}
                  >
                    {categories
                      .filter((category) => category.variant === "medium")
                      .map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </Select>
                </div>
                <div className="flex flex-row gap-x-2 justify-between items-center">
                  <h1 className="flex-shrink-0">소분류</h1>
                  <Select
                    defaultSelectedKeys={[item.categorySmall]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0];
                      setChangedCategorySmall(key);
                    }}
                  >
                    {categories
                      .filter((category) => category.variant === "small")
                      .map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </Select>
                </div>

                {item.isNew === true ? (
                  <>
                    <Divider className="my-3"></Divider>
                    <div className="flex flex-col gap-x-2 justify-between items-center">
                      <div className="w-full flex flex-row justify-start items-center">
                        <h1 className="text-medium">번역 레퍼런스</h1>
                      </div>

                      <div className="flex flex-row gap-x-2 w-full my-3">
                        <WordModal myId={myId} setMyId={setMyId} dictionary={dictionary} changedWordId={changedWordId} setChangedWordId={setChangedWordId}/>
                        <SentenceModal myId={myId} setMyId={setMyId} dictionary={dictionary} changedWorldId={changedWordId} setChangedWordId={setChangedWordId}/>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <div className="flex flex-row justify-between items-center gap-x-2">
                        <div className="text-sm ">{changedWord ? changedWord.categoryLarge : ""}/{changedWord ? changedWord.categoryMiddle : ""}/{changedWord ? changedWord.categorySmall : ""}</div>
                        <div className="text-sm">{changedWord ? changedWord.titleEN : ""}</div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3">
                        {changedWord ? changedWord.titleKR : ""}
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>닫기</Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleSave();
                    onClose();
                  }}
                >
                  저장하기
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChangeModal;
