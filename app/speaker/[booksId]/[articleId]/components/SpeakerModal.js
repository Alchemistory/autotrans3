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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { ListboxWrapper } from "./ListboxWrapper";
import { FaPlus } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import RadioGroupComplete from "./RadioGroupComplete";
import MoreCharacter from "./MoreCharacter";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
function SpeakerModal({ isFixed, booksId, chapterId, data, setData }) {
  const [characters, setCharacters] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [mappingSpeakerCharacter, setMappingSpeakerCharacter] = useState([]);
  const [selectedListbox, setSelectedListbox] = useState();
  const [selectedSelect, setSelectedSelect] = useState(null);
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

  const supabase = createClient();
  const getCharacter = async () => {
    const { data, error } = await supabase
      .from("characterList")
      .select("*")
      .eq("booksId", booksId);

    if (error) {
      console.log(error);
    }
    setCharacters(data);
  };

  useEffect(() => {
    getCharacter();
  }, []);

  const handleFilterSpekaer = (e) => {
    const speakers = [...new Set(data.map((item) => item.speaker))];
    setSpeakers(speakers);
    setSelectedListbox(speakers[0]);
  };

  useEffect(() => {
    handleFilterSpekaer();
  }, [data]);

  const handleMappingSpeakerCharacter = () => {
    const titleList = characters.flatMap((character) => {
      const titles = [character.title1];
      if (character.title2) {
        titles.push(
          ...character.title2.split("|").map((title) => title.trim())
        );
      }
      return titles;
    });

    const mapping = speakers.map((speaker) => {
      const matchedCharacter = characters.find(
        (character) =>
          character.title1 === speaker ||
          (character.title2 &&
            character.title2
              .split("|")
              .map((title) => title.trim())
              .includes(speaker))
      );

      return {
        speaker: speaker,
        character: matchedCharacter
          ? {
              description: matchedCharacter.description,
              title1: matchedCharacter.title1,
              title2: matchedCharacter.title2,
            }
          : null,
        status: matchedCharacter ? "done" : "none",
      };
    });

    setMappingSpeakerCharacter(mapping);
  };

  useEffect(() => {
    handleMappingSpeakerCharacter();
  }, [characters, speakers]);

  const handleStatusChange = (speaker, selectedKey) => {
    setMappingSpeakerCharacter((prevMapping) => {
      return prevMapping.map((item) => {
        if (item.speaker === speaker) {
          return {
            ...item,
            status:
              selectedKey === "1"
                ? "done"
                : selectedKey === "2"
                  ? "new"
                  : "none",
            character: selectedKey === "3" ? null : item.character,
          };
        }
        return item;
      });
    });
  };

  return (
    <>
      <Button
        className="col-span-12 md:col-span-3"
        onClick={onOpen1}
        color="primary"
      >
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
                    <div className="flex flex-row items-center justify-between">
                      <p>발화자</p>
                      <div className="flex flex-row gap-x-2">
                        <span className="flex flex-row items-center gap-x-1 text-2xs">
                          <IoPersonSharp className="text-blue-500 text-2xs"></IoPersonSharp>
                          <span className="text-blue-500 text-xs">완료</span>
                        </span>
                        <span className="flex flex-row items-center gap-x-1 text-2xs">
                          <IoPersonSharp className="text-red-500 text-2xs"></IoPersonSharp>
                          <span className="text-red-500 text-xs">신규</span>
                        </span>
                        <span className="flex flex-row items-center gap-x-1 text-2xs">
                          <BsDot className="text-black text-2xs"></BsDot>
                          <span className="text-black text-xs">미연결</span>
                        </span>
                      </div>
                    </div>

                    <ListboxWrapper
                      key={speakers}
                      className="w-full h-60 border-2 my-3 px-2 py-2 rounded-small border-gray-200 overflow-y-auto flex flex-col gap-y-2"
                    >
                      <Listbox
                        className=""
                        selectionMode="single"
                        defaultSelectedKeys={[speakers[0]]}
                        onSelectionChange={(key) => {
                          const selectedKey = Array.from(key)[0];
                          console.log(
                            "Listbox selection changed:",
                            selectedKey
                          );
                          setSelectedListbox(selectedKey);
                        }}
                      >
                        {speakers.map((speaker, index) => (
                          <ListboxItem key={speaker} value={speaker}>
                            <div className="grid grid-cols-12 gap-x-2 justify-between items-center">
                              <div className="col-span-4">
                                <Select
                                  size="sm"
                                  selectedKeys={[
                                    mappingSpeakerCharacter.find(
                                      (item) => item.speaker === speaker
                                    )?.status === "done"
                                      ? "1"
                                      : mappingSpeakerCharacter.find(
                                            (item) => item.speaker === speaker
                                          )?.status === "new"
                                        ? "2"
                                        : "3",
                                  ]}
                                  onSelectionChange={(keys) => {
                                    const selectedKey = Array.from(keys)[0];
                                    handleStatusChange(speaker, selectedKey);
                                  }}
                                  renderValue={(items) => {
                                    const selectedKey = items[0]?.key;
                                    return (
                                      <div className="flex items-center">
                                        {selectedKey === "1" && (
                                          <IoPersonSharp className="text-blue-500" />
                                        )}
                                        {selectedKey === "2" && (
                                          <IoPersonSharp className="text-red-500" />
                                        )}
                                        {selectedKey === "3" && (
                                          <BsDot className="text-black" />
                                        )}
                                      </div>
                                    );
                                  }}
                                >
                                  <SelectItem key="1">
                                    <IoPersonSharp className="text-blue-500" />
                                  </SelectItem>
                                  <SelectItem key="2">
                                    <IoPersonSharp className="text-red-500" />
                                  </SelectItem>
                                  <SelectItem key="3">
                                    <BsDot className="text-black" />
                                  </SelectItem>
                                </Select>
                              </div>
                              <div className="col-span-4">
                                <p className="text-sm text-black text-center">
                                  {speaker}
                                </p>
                              </div>
                              <div className="col-span-4">
                                <p className="text-xs text-gray-500 text-center">
                                  {
                                    mappingSpeakerCharacter.find(
                                      (item) => item.speaker === speaker
                                    )?.character?.title1
                                  }
                                </p>
                              </div>
                            </div>
                          </ListboxItem>
                        ))}
                      </Listbox>
                    </ListboxWrapper>
                  </div>
                  <div className="col-span-8">
                    <div className="flex flex-row items-center justify-between">
                      <p>캐릭터</p>
                      {/* <MoreCharacter></MoreCharacter> */}
                    </div>
                    <div className="w-full h-60 border-2 my-3 px-1 py-2 rounded-small border-gray-200 overflow-y-auto">
                      <div className="p-2 ">
                        {mappingSpeakerCharacter.find(
                          (item) => item.speaker === selectedListbox
                        )?.status === "new" ? (
                          <p className="text-center text-gray-500">
                            신규 캐릭터에 해당하여 선택이 불가능합니다
                          </p>
                        ) : (
                          <RadioGroupComplete
                            selectedListbox={selectedListbox}
                            selectedSelect={selectedSelect}
                            setSelectedSelect={setSelectedSelect}
                            setSelectedListbox={setSelectedListbox}
                            characters={characters}
                            setCharacters={setCharacters}
                            mappingSpeakerCharacter={mappingSpeakerCharacter}
                            setMappingSpeakerCharacter={
                              setMappingSpeakerCharacter
                            }
                          />
                        )}
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
