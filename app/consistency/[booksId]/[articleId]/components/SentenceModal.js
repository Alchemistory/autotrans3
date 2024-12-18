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
  Input
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";

export const ListboxWrapper = ({ children }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

function SentenceModal({myId, setMyId, dictionary, changedWordId, setChangedWordId}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
  const [filteredDictionary, setFilteredDictionary] = useState(dictionary);
  const [search, setSearch] = useState("");
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  const filterDictionary = () => {
    setFilteredDictionary(
      dictionary.filter(
        (item) => item.categoryLarge === "문장" && item.titleKR.includes(search) && item.id !== myId
      )
    );
  };
  useEffect(() => {
    filterDictionary();
  }, [search])

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
                  
                  <Input startContent={<IoSearch />} type="text" placeholder="문장을 검색해주세요" value={search} onChange={(e) => setSearch(e.target.value)}/>
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
                    {filteredDictionary.map((item, index) => (
                      <ListboxItem key={index} onClick={() => setChangedWordId(item.id)}>
                        <div className="text-xs text-gray-500">{item.categoryLarge}/{item.categoryMiddle}/{item.categorySmall}</div>
                        <div>{item.titleKR}</div>
                      </ListboxItem>
                    ))}
                    
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
