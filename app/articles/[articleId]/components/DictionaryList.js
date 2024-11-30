import React from "react";
import { Card, CardBody, Input } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import { debounce } from "lodash";

export default function DictionaryList({ articleId }) {
  const [categoryListLarge, setCategoryListLarge] = useState([]);
  const [categoryListMiddle, setCategoryListMiddle] = useState([]);
  const [categoryListSmall, setCategoryListSmall] = useState([]);
  const [titleKR, setTitleKR] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [selectedLargeCategory, setSelectedLargeCategory] = useState("");
  const [selectedMiddleCategory, setSelectedMiddleCategory] = useState("");
  const [selectedSmallCategory, setSelectedSmallCategory] = useState("");
  const [searchLargeCategory, setSearchLargeCategory] = useState("");
  const [searchMiddleCategory, setSearchMiddleCategory] = useState("");
  const [searchSmallCategory, setSearchSmallCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dictionaryList, setDictionaryList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const supabase = createClient();
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

  const getCategoryList = async () => {
    const { data, error } = await supabase.from("categoryList").select("*");
    if (error) {
      console.log(error);
    } else {
      const large = data.filter((item) => item.variant === "large");
      const medium = data.filter((item) => item.variant === "medium");
      const small = data.filter((item) => item.variant === "small");
      setCategoryListLarge(large);
      setCategoryListMiddle(medium);
      setCategoryListSmall(small);
    }
  };

  const getDictionaryList = async () => {
    let query = supabase
      .from("dictionaryList")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("booksId", articleId);

    if (searchLargeCategory) {
      query = query.eq("categoryLarge", searchLargeCategory);
    }
    if (searchMiddleCategory) {
      query = query.eq("categoryMiddle", searchMiddleCategory);
    }
    if (searchSmallCategory) {
      query = query.eq("categorySmall", searchSmallCategory);
    }
    if (searchText) {
      query = query.or(
        `titleKR.ilike.%${searchText}%,titleEN.ilike.%${searchText}%`
      );
    }
    const { data, error } = await query;
    if (error) {
      console.log(error);
    } else {
      setDictionaryList(data);
    }
  };

  useEffect(() => {
    getCategoryList();
    getDictionaryList();
  }, [searchLargeCategory, searchMiddleCategory, searchSmallCategory]);

  useEffect(() => {
    const debouncedSearch = debounce(getDictionaryList, 500);
    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [searchText]);

  const handleAddWord = async () => {
    if (!selectedLargeCategory) {
      toast.error("대분류를 입력해주세요");
      return;
    }
    if (!titleKR) {
      toast.error("한글 텍스트를 입력해주세요");
      return;
    }
    if (!titleEN) {
      toast.error("영문 표현을 입력해주세요");
      return;
    }

    const { data, error } = await supabase.from("dictionaryList").insert({
      titleKR: titleKR,
      titleEN: titleEN,
      categoryLarge: selectedLargeCategory,
      categoryMiddle: selectedMiddleCategory,
      categorySmall: selectedSmallCategory,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("단어 추가 완료");
      setTitleKR("");
      setTitleEN("");
      setSelectedLargeCategory("");
      setSelectedMiddleCategory("");
      setSelectedSmallCategory("");
      getDictionaryList();
    }
  };

  const handleDeleteWord = async (id) => {
    const { error } = await supabase
      .from("dictionaryList")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("단어 삭제 완료");
      getDictionaryList();
    }
  };
  const handleEditWord = async (item) => {
    const { data, error } = await supabase
      .from("dictionaryList")
      .update({
        titleKR: titleKR,
        titleEN: titleEN,
        categoryLarge: selectedLargeCategory,
        categoryMiddle: selectedMiddleCategory,
        categorySmall: selectedSmallCategory,
      })
      .eq("id", selectedId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("단어 수정 완료");
      getDictionaryList();
    }
  };

  return (
    <div>
      <ToastContainer
        autoClose={1000}
        hideProgressBar={false}
        position="top-center"
      />
      <div className="my-5 w-full  flex-row justify-between items-center gap-x-5 grid grid-cols-12">
        <Input
          onValueChange={(value) => setSearchText(value)}
          startContent={<IoSearch className="text-medium" />}
          type="text"
          label=""
          classNames={{
            base: "col-span-4",
            inputWrapper: "h-12",
          }}
        />

        <div className="col-span-6 flex-row gap-x-5 my-5 grid grid-cols-3">
          <Select
            variant="underlined"
            label="대분류"
            className="col-span-1 h-12  "
            onChange={(e) => setSearchLargeCategory(e.target.value)}
          >
            {categoryListLarge.map((item) => (
              <SelectItem key={item.name}>{item.name}</SelectItem>
            ))}
          </Select>
          <Select
            variant="underlined"
            label="중분류"
            className="col-span-1 h-12 "
            onChange={(e) => setSearchMiddleCategory(e.target.value)}
          >
            {categoryListMiddle.map((item) => (
              <SelectItem key={item.name}>{item.name}</SelectItem>
            ))}
          </Select>
          <Select
            variant="underlined"
            label="소분류"
            className="col-span-1 h-12 "
            onChange={(e) => setSearchSmallCategory(e.target.value)}
          >
            {categoryListSmall.map((item) => (
              <SelectItem key={item.name}>{item.name}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-2 w-full ">
          <Button
            size="md"
            color="primary"
            onPress={onOpen1}
            className="w-full h-12"
          >
            단어 추가
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table aria-label="Example static collection table " shadow="none">
          <TableHeader>
            <TableColumn className="text-center w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">
              한글
            </TableColumn>
            <TableColumn className="text-center w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">
              영문 표현
            </TableColumn>
            <TableColumn className="text-center w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">
              대분류
            </TableColumn>
            <TableColumn className="text-center w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">
              중분류
            </TableColumn>
            <TableColumn className="text-center w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">
              소분류
            </TableColumn>
            <TableColumn className="text-center w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">
              비고
            </TableColumn>
          </TableHeader>
          <TableBody>
            {dictionaryList.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.titleKR}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.titleEN}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.categoryLarge}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.categoryMiddle}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.categorySmall}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  <Button
                    variant="light"
                    color="success"
                    onPress={() => {
                      onOpen2();
                      setSelectedId(item.id);
                      setTitleKR(item.titleKR);
                      setTitleEN(item.titleEN);
                      setSelectedLargeCategory(item.categoryLarge);
                      setSelectedMiddleCategory(item.categoryMiddle);
                      setSelectedSmallCategory(item.categorySmall);
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
                단어 추가
              </ModalHeader>
              <ModalBody className="flex flex-col gap-8">
                <div>
                  <h1 className="text-lg font-bold">한글 텍스트</h1>
                  <Input
                    type="text"
                    label=""
                    onValueChange={(value) => setTitleKR(value)}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">영문 표현</h1>
                  <Input
                    type="text"
                    label=""
                    onValueChange={(value) => setTitleEN(value)}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">
                    대분류<span className="text-red-500">(필수)</span>
                  </h1>
                  <Select
                    isRequired
                    className="w-full"
                    onChange={(e) => setSelectedLargeCategory(e.target.value)}
                  >
                    {categoryListLarge.map((item) => (
                      <SelectItem key={item.name}>{item.name}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <h1 className="text-lg font-bold">중분류</h1>
                  <Select
                    className="w-full"
                    onChange={(e) => setSelectedMiddleCategory(e.target.value)}
                  >
                    {categoryListMiddle.map((item) => (
                      <SelectItem key={item.name}>{item.name}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <h1 className="text-lg font-bold">소분류</h1>
                  <Select
                    className="w-full"
                    onChange={(e) => setSelectedSmallCategory(e.target.value)}
                  >
                    {categoryListSmall.map((item) => (
                      <SelectItem key={item.name}>{item.name}</SelectItem>
                    ))}
                  </Select>
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
                    onValueChange={(value) => setTitleKR(value)}
                    value={titleKR}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">영문 표현</h1>
                  <Input
                    type="text"
                    label=""
                    onValueChange={(value) => setTitleEN(value)}
                    value={titleEN}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">
                    대분류<span className="text-red-500">(필수)</span>
                  </h1>
                  <Select
                    isRequired
                    className="w-full"
                    onChange={(e) => setSelectedLargeCategory(e.target.value)}
                    selectedKeys={[selectedLargeCategory]}
                  >
                    {categoryListLarge.map((item) => (
                      <SelectItem key={item.name}>{item.name}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <h1 className="text-lg font-bold">중분류</h1>
                  <Select
                    className="w-full"
                    onChange={(e) => setSelectedMiddleCategory(e.target.value)}
                    selectedKeys={[selectedMiddleCategory]}
                  >
                    {categoryListMiddle.map((item) => (
                      <SelectItem key={item.name}>{item.name}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <h1 className="text-lg font-bold">소분류</h1>
                  <Select
                    className="w-full"
                    onChange={(e) => setSelectedSmallCategory(e.target.value)}
                    selectedKeys={[selectedSmallCategory]}
                  >
                    {categoryListSmall.map((item) => (
                      <SelectItem key={item.name}>{item.name}</SelectItem>
                    ))}
                  </Select>
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
