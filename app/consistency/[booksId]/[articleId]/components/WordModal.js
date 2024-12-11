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
  Input,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";

export const ListboxWrapper = ({ children }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

function WordModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  return (
    <>
      <Button color="primary" className="w-full" onClick={onOpen}>
        용어
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>용어 검색</ModalHeader>
              <ModalBody>
                <Input
                  placeholder="용어를 검색해주세요"
                  type="text"
                  startContent={<IoSearch />}
                />
                <ListboxWrapper>
                  <Listbox
                    disallowEmptySelection
                    aria-label="Single selection example"
                    selectedKeys={selectedKeys}
                    selectionMode="single"
                    variant="flat"
                    onSelectionChange={setSelectedKeys}
                  >
                    <ListboxItem key="text1">
                      <div className="text-xs text-gray-500">용어/캐릭터/-</div>
                      <div>우진</div>
                    </ListboxItem>
                    <ListboxItem key="text2">
                      <div className="text-xs text-gray-500">용어/캐릭터/-</div>
                      <div>우진</div>
                    </ListboxItem>
                    <ListboxItem key="text3">
                      <div className="text-xs text-gray-500">용어/캐릭터/-</div>
                      <div>우진</div>
                    </ListboxItem>
                    
                  </Listbox>
                </ListboxWrapper>
              </ModalBody>
              <ModalFooter>
                <Button className="w-full" color="primary" onPress={onClose}>
                  선택하기
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default WordModal;
