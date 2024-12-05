"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Listbox,
  ListboxItem,
  RadioGroup,
  Radio,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
} from "@nextui-org/react";
import { ListboxWrapper } from "./ListboxWrapper";
import { FaPlus } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import  RadioGroupComplete  from "./RadioGroupComplete";
import MoreCharacter from "./MoreCharacter";
function SpeakerModal() {
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onOpenChange: onOpenChange1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
  } = useDisclosure();
  return (
    <>
      <Button className="col-span-12 md:col-span-3" onClick={onOpen1} color="primary">
        발화자/캐릭터 연결
      </Button>
      <Modal size="4xl" isOpen={isOpen1} onOpenChange={onOpenChange1}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                발화자/캐릭터 연결
              </ModalHeader>
              <ModalBody className="w-full">
                <div className="grid grid-cols-12 gap-x-5">
                  <div className="col-span-4 w-full">
                    <p>발화자</p>
                    <ListboxWrapper className="w-full">
                      <Listbox aria-label="Actions">
                        <ListboxItem key="new">
                          <div className="flex flex-row items-center justify-between">
                            <div className="flex gap-x-2 justify-center items-center">
                              <div className="">
                                <IoPersonSharp />
                              </div>
                              <div>중재</div>
                            </div>
                            <div className="text-xs text-gray-500">멋쟁님</div>
                          </div>
                        </ListboxItem>
                        <ListboxItem key="copy">
                          <div className="flex flex-row items-center justify-between">
                            <div className="flex gap-x-2 justify-center items-center">
                              <div className="">
                                <FaPlus />
                              </div>
                              <div>철수</div>
                            </div>
                            <div className="text-xs text-gray-500">멋쟁녀</div>
                          </div>
                        </ListboxItem>
                        <ListboxItem key="edit">
                          <div className="flex flex-row items-center justify-between">
                            <div className="flex gap-x-2 justify-center items-center">
                              <div className="">
                                <BsDot />
                              </div>
                              <div>영희</div>
                            </div>
                            <div className="text-xs text-gray-500">멋쟁</div>
                          </div>
                        </ListboxItem>
                      </Listbox>
                    </ListboxWrapper>
                  </div>
                  <div className="col-span-8">
                    <div className="flex flex-row items-center justify-between">
                      <p>캐릭터</p>
                      <MoreCharacter></MoreCharacter>
                      
                    </div>
                    <div className="w-full h-60 border-2 my-3 px-1 py-2 rounded-small border-gray-200 overflow-y-auto">
                      <div className="p-2">
                        <RadioGroupComplete></RadioGroupComplete>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  닫기
                </Button>
                <Button color="primary" onPress={onClose}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default SpeakerModal;
