import React from "react";
import { FaPlus } from "react-icons/fa";
import {Modal,Input,Textarea, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

function MoreCharacter() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <button onClick={onOpen} className="text-xs text-gray-500">
        <FaPlus />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">캐릭터 추가</ModalHeader>
              <ModalBody>
                <h1>캐릭터 이름</h1>
                <Input></Input>

                <h1>캐릭터의 다른 이름</h1>
                <Input></Input>
                <h1>해당 캐릭터의 등장 챕터별 페르소나 정보</h1>
                <Textarea></Textarea>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  취소
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

export default MoreCharacter;
