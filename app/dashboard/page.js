"use client";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { cn } from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Input,
  Progress,
  Button,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { useState, useEffect, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { FaPlusCircle } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from 'react-toastify';
import {Spinner} from "@nextui-org/react";

export default function ProtectedPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [titleKR, setTitleKR] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [authorKR, setAuthorKR] = useState("");
  const [authorEN, setAuthorEN] = useState("");
  const [genre, setGenre] = useState([]);
  const [perspective, setPerspective] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 7;
  const supabase = createClient();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const getData = async () => {
    setIsLoading(true);
    let query = supabase
      .from("books")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });
    
    if (debouncedSearch) {
      query = query.or(`titleKR.ilike.%${debouncedSearch}%,titleEN.ilike.%${debouncedSearch}%`);
    }
    
    const { data, error, count } = await query.range(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
    
    if (error) {
      toast.error("작품 불러오기에 실패했습니다.");
    } else {
      setItems(data);
      setTotalPage(Math.ceil(count / itemsPerPage));
      setIsLoading(false);
    }
  };

  const getGenreList = async () => {
    const { data, error } = await supabase.from("genreList").select("*");
    if (error) {
      toast.error("장르 불러오기에 실패했습니다.");
    } else {
      setGenreList(data);
    }
  }


  useEffect(() => {
    getGenreList();
  }, []);

  useEffect(() => {
    getData();
  }, [page, debouncedSearch]);

  const handleAdd = async () => {
    const { data, error } = await supabase.from("books").insert({
      titleKR: titleKR,
      titleEN: titleEN,
      authorKR: authorKR,
      authorEN: authorEN,
      genre: genre,
    });
    if (error) {
      toast.error("작품 추가에 실패했습니다.");
    } else {
      toast.success("작품 추가에 성공했습니다.");
      getData();
    }
  };

  return (
    <div className="">
      <ToastContainer
      autoClose={1000}
        hideProgressBar={false}
      position="top-center"
      />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-5">
        <Input
          onValueChange={(value) => setSearch(value)}
          startContent={<IoSearch className="text-medium" />}
          type="email"
          label=""
        />
      </div>
      {isLoading ? (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-12 md:min-h-44 md:h-full h-44 md:col-span-4 flex justify-center items-center transition-all duration-300 hover:scale-105 hover:border-2 hover:border-primary">
          <FaPlusCircle
            onClick={onOpen}
            className="text-7xl text-primary cursor-pointer"
          />
        </Card>
        {items.map((item, index) => (
          <Card className="col-span-12 md:col-span-4" key={index}>
            <CardHeader className="flex gap-3">
              <div className="w-full flex justify-center">
                <Link href={`/articles/${item.id}`}>
                  <div className="w-full">
                    <p className="text-md text-center">{item.titleKR}</p>
                    <p className="text-sm text-gray-500 text-center">{item.titleEN}</p>
                  </div>
                </Link>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-center">Season3</p>
            </CardBody>
            <Divider />
            <CardFooter>
              <div className="w-full flex justify-center">
                <Progress
                  aria-label="Downloading..."
                  size="md"
                  value={60}
                  color="primary"
                  showValueLabel={true}
                  className="max-w-md"
                />
                <Link
                  isExternal
                  href="https://github.com/nextui-org/nextui"
                ></Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center w-full mt-5">
        <Pagination
          total={totalPage}
          page={page}
          onChange={(page) => setPage(page)}
          />
        </div>
        </>
      )}  

      <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl">
                새로운 작품 만들기
              </ModalHeader>
              <ModalBody className="flex flex-col gap-8">
                <div>
                  <h1 className="text-lg font-bold">
                    작품의 <span className="text-primary">제목</span>을
                    입력해주세요(국문)
                  </h1>
                  <Input
                    type="text"
                    label=""
                    onValueChange={(value) => setTitleKR(value)}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">
                    작품의 <span className="text-primary">제목</span>을
                    입력해주세요(영문)
                  </h1>
                  <Input
                    type="text"
                    label=""
                    onValueChange={(value) => setTitleEN(value)}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">
                    작품의 <span className="text-primary">저자</span>를
                    입력해주세요(국문)
                  </h1>
                  <Input
                    type="text"
                    label=""
                    onValueChange={(value) => setAuthorKR(value)}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">
                    작품의 <span className="text-primary">저자</span>를
                    입력해주세요(영문)
                  </h1>
                  <Input
                    type="text"
                    label=""
                    onValueChange={(value) => setAuthorEN(value)}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">
                    작품의 <span className="text-primary">장르</span>를
                    선택해주세요
                    <span className="text-gray-500">(복수 선택 가능)</span>
                  </h1>
                  <CheckboxGroup
                    orientation="horizontal"
                    color="primary"
                    defaultValue={["게임판타지"]}
                    onValueChange={(value) => setGenre(value)}
                  >
                    {genreList.map((genre, index) => (
                      <Checkbox key={index} value={genre.name}>{genre.name}</Checkbox>
                    ))}
                  </CheckboxGroup>
                </div>
                {/* <div>
                  <h1 className="text-lg font-bold">
                    <span className="text-primary">서술시점</span>을
                    선택해주세요
                  </h1>
                  <RadioGroup
                    defaultValue="perspective1"
                    orientation="horizontal"
                    onValueChange={(value) => setPerspective(value)}
                  >
                    <Radio value="perspective1">1인칭 시점</Radio>
                    <Radio value="perspective3">3인칭 시점</Radio>
                  </RadioGroup>
                </div> */}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  닫기
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleAdd();
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
