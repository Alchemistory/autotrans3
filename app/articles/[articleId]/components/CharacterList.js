import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Input } from "@nextui-org/input";
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  CheckboxGroup,
  Button,
  Select,
  SelectItem,
  Textarea,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
} from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { debounce } from "lodash";
function CharacterList({ articleId }) {
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
  const [searchText, setSearchText] = useState("");
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [description, setDescription] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [characterList, setCharacterList] = useState([]);

  const supabase = createClient();
  useEffect(() => {
    const debouncedGetCharacterList = debounce(getCharacterList, 500);
    debouncedGetCharacterList();
    return () => debouncedGetCharacterList.cancel();
  }, [articleId, searchText]);

  const getCharacterList = async () => {
    let query = supabase
      .from("characterList")
      .select("*")
      .eq("booksId", articleId);

    if (searchText) {
      query = query.or(
        `title1.ilike.%${searchText}%,title2.ilike.%${searchText}%`
      );
    }

    const { data, error } = await query;
    if (error) {
      console.log(error);
    } else {
      setCharacterList(data);
    }
  };
  const handleDeleteWord = async (id) => {
    const { error } = await supabase
      .from("characterList")
      .delete()
      .eq("id", id);
    if (error) {
      console.log(error);
    } else {
      getCharacterList();
      toast.success("캐릭터 삭제 완료");
    }
  };

  const handleAddWord = async () => {
    const { error } = await supabase.from("characterList").insert({
      booksId: articleId,
      title1: title1,
      title2: title2,
      description: description,
    });
    if (error) {
      console.log(error);
    } else {
      getCharacterList();
      toast.success("캐릭터 추가 완료");
    }
  };

  const handleEditWord = async () => {
    const { error } = await supabase
      .from("characterList")
      .update({ title1, title2, description })
      .eq("id", selectedId);
    if (error) {
      console.log(error);
    } else {
      getCharacterList();
      toast.success("캐릭터 수정 완료");
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <ToastContainer
        autoClose={1000}
        hideProgressBar={false}
        position="top-center"
      />
      <div className="my-5 w-full flex-col md:flex-row justify-between items-center gap-x-5 grid grid-cols-12">
        <div className="col-span-8 md:col-span-8">
          <Input
            onValueChange={(value) => setSearchText(value)}
            startContent={<IoSearch className="text-medium" />}
            type="text"
            label=""
            classNames={{
              inputWrapper: "h-8 md:h-12",
            }}
          />
        </div>
        <div className="col-span-4 md:col-span-4">
          <Button
            size="md"
            color="primary"
            onPress={onOpen1}
            className="w-full  h-8 md:h-12"
          >
            캐릭터 추가
          </Button>{" "}
        </div>
      </div>
      <div className="w-[70vw] md:w-full flex justify-center overflow-x-auto">
        <Table
          aria-label="Example static collection table"
          shadow="none"
          classNames={{
            wrapper: "p-0",
          }}
        >
          <TableHeader>
            <TableColumn className="text-center w-1/4 whitespace-nowrap overflow-hidden text-ellipsis">
              캐릭터 이름
            </TableColumn>
            <TableColumn className="text-center w-1/4 whitespace-nowrap overflow-hidden text-ellipsis">
              다른 이름
            </TableColumn>
            <TableColumn className="text-center w-1/4 whitespace-nowrap overflow-hidden text-ellipsis">
              설명
            </TableColumn>
            <TableColumn className="text-center w-1/4 whitespace-nowrap overflow-hidden text-ellipsis">
              비고
            </TableColumn>
          </TableHeader>
          <TableBody>
            {characterList.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.title1}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.title2}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.description}
                </TableCell>

                <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  <Button
                    variant="light"
                    color="success"
                    onPress={() => {
                      onOpen2();
                      setSelectedId(item.id);
                      setTitle1(item.title1);
                      setTitle2(item.title2);
                      setDescription(item.description);
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    variant="light"
                    color="danger"
                    onPress={() => handleDeleteWord(item.id)}
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal size="2xl" isOpen={isOpen1} onOpenChange={onOpenChange1}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl">
                캐릭터 추가
              </ModalHeader>
              <ModalBody className="flex flex-col gap-8">
                <div>
                  <h1 className="text-lg font-bold">캐릭터의 이름</h1>
                  <Input
                    type="text"
                    label=""
                    onValueChange={(value) => setTitle1(value)}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">캐릭터의 다른 이름</h1>
                  <Input
                    type="text"
                    label=""
                    onValueChange={(value) => setTitle2(value)}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">
                    해당 캐릭터의 등장 챕터별 페르소나 정보
                  </h1>
                  <Textarea
                    label=""
                    onValueChange={(value) => setDescription(value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  닫기
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleAddWord();
                    onClose();
                  }}
                >
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal size="2xl" isOpen={isOpen2} onOpenChange={onOpenChange2}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl">
                단어 수정
              </ModalHeader>
              <ModalBody className="flex flex-col gap-8">
                <div>
                  <h1 className="text-lg font-bold">한글 텍스트</h1>
                  <Input
                    type="text"
                    label=""
                    onValueChange={(value) => setTitle1(value)}
                    value={title1}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">영문 표현</h1>
                  <Input
                    type="text"
                    label=""
                    onValueChange={(value) => setTitle2(value)}
                    value={title2}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">설명</h1>
                  <Textarea
                    label=""
                    onValueChange={(value) => setDescription(value)}
                    value={description}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  닫기
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleEditWord();
                    onClose();
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

export default CharacterList;
