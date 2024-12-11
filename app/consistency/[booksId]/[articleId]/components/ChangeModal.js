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

function ChangeModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        className="m-0 p-0"
        isIconOnly
        aria-label="Like"
        color=""
        onClick={onOpen}
      >
        <GoPencil className="text-gray-500" />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p className="text-2xl">레인</p>
                <p className="text-lg text-gray-500">Rain</p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-row gap-x-2 justify-between items-center">
                  <h1 className="flex-shrink-0">대분류</h1>
                  <Select>
                    <SelectItem>Rain</SelectItem>
                    <SelectItem>Rain</SelectItem>
                    <SelectItem>Rain</SelectItem>
                  </Select>
                </div>
                <div className="flex flex-row gap-x-2 justify-between items-center">
                  <h1 className="flex-shrink-0">중분류</h1>
                  <Select>
                    <SelectItem>Rain</SelectItem>
                    <SelectItem>Rain</SelectItem>
                    <SelectItem>Rain</SelectItem>
                  </Select>
                </div>
                <div className="flex flex-row gap-x-2 justify-between items-center">
                  <h1 className="flex-shrink-0">소분류</h1>
                  <Select>
                    <SelectItem>Rain</SelectItem>
                    <SelectItem>Rain</SelectItem>
                    <SelectItem>Rain</SelectItem>
                  </Select>
                </div>
                <Divider className="my-3"></Divider>
                <div className="flex flex-col gap-x-2 justify-between items-center">
                  <div className="w-full flex flex-row justify-start items-center">
                    <h1 className="text-medium">번역 레퍼런스</h1>
                  </div>

                  <div className="flex flex-row gap-x-2 w-full my-3">
                    <WordModal />
                    <SentenceModal />
                    {/* <Button color="primary" className="w-full">
                      용어
                    </Button>
                    <Button color="primary" className="w-full">
                      문장
                    </Button> */}
                  </div>
                </div>
                <div className="flex flex-col gap-y-2">
                  <div className="flex flex-row justify-between items-center gap-x-2">
                    <div className="text-sm ">용어/캐릭터/-</div>
                    <div className="text-sm">Kim Woojin</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">김우진</div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
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
