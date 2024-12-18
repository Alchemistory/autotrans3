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
import { useState, useEffect } from "react";
export const ListboxWrapper = ({ children }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

function WordModal({myId, setMyId, dictionary, changedWordId, setChangedWordId}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [search, setSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
  const [filteredDictionary, setFilteredDictionary] = useState(dictionary);
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );


  const filterDictionary = () => {
    setFilteredDictionary(
      dictionary.filter(
        (item) => item.categoryLarge === "용어" && item.titleKR.includes(search) && item.id !== myId
      )
    );
  };

  useEffect(() => {
    filterDictionary();
  }, [search]);
  console.log("changedWordId:", changedWordId);
  
  
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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

export default WordModal;
