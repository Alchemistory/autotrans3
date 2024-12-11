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
  Select,
  SelectItem,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";

export const ListboxWrapper = ({ children }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

function SentenceModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  return (
    <>
      <Button color="primary" className="w-full" onPress={onOpen}>
        문장
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>문장 검색</ModalHeader>
              <ModalBody>
                <div className="flex flex-row gap-x-5 justify-between items-center">
                  <h1 className="flex-shrink-0">회차</h1>
                  <Select>
                    <SelectItem>Rain</SelectItem>
                    <SelectItem>Rain</SelectItem>
                    <SelectItem>Rain</SelectItem>
                  </Select>
                </div>
                <ListboxWrapper>
                  <Listbox
                    disallowEmptySelection
                    aria-label="Single selection example"
                    selectedKeys={selectedKeys}
                    selectionMode="single"
                    variant="flat"
                    onSelectionChange={setSelectedKeys}
                  >
                    <ListboxItem key="text">Text</ListboxItem>
                    <ListboxItem key="number">Number</ListboxItem>
                    <ListboxItem key="date">Date</ListboxItem>
                    <ListboxItem key="single_date">Single Date</ListboxItem>
                    <ListboxItem key="iteration">Iteration</ListboxItem>
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

export default SentenceModal;
