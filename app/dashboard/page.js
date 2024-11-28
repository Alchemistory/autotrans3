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
import {Pagination} from "@nextui-org/react";

import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";

import { IoSearch } from "react-icons/io5";
import { FaPlusCircle } from "react-icons/fa";

export default function ProtectedPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const items = ["1", "2", "3", "4", "5", "6", "7", "8"];
  return (
    <div className="">
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-5">
        <Input
          startContent={<IoSearch className="text-medium" />}
          type="email"
          label=""
        />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 md:col-span-4 flex justify-center items-center">
          <FaPlusCircle
            onClick={onOpen}
            className="text-7xl text-primary cursor-pointer"
          />
        </Card>
        {items.map((item, index) => (
          <Card className="col-span-12 md:col-span-4" key={index}>
            <CardHeader className="flex gap-3">
              <div className="w-full flex justify-center">
                <Link href={`/articles/${index}`}>
                  <div className="w-full">
                    <p className="text-md text-center">양극의 소년</p>
                    <p className="text-sm text-gray-500 text-center">총12매</p>
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
        <Pagination total={10} initialPage={1} />
      </div>

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
                    입력해주세요
                  </h1>
                  <Input type="text" label="" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">
                    작품의 <span className="text-primary">저자</span>를
                    입력해주세요
                  </h1>
                  <Input type="text" label="" />
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
                    defaultValue={["game", "romance"]}
                  >
                    <Checkbox value="game">게임판타지</Checkbox>
                    <Checkbox value="romance">로맨스</Checkbox>
                    <Checkbox value="detective">추리</Checkbox>
                    <Checkbox value="thriller">스릴러</Checkbox>
                    <Checkbox value="horror">공포</Checkbox>
                    <Checkbox value="sf">SF</Checkbox>
                    <Checkbox value="comedy">코메디</Checkbox>
                  </CheckboxGroup>
                </div>
                <div>
                  <h1 className="text-lg font-bold">
                    <span className="text-primary">서술시점</span>을
                    선택해주세요
                  </h1>
                  <RadioGroup defaultValue="inching1" orientation="horizontal">
                    <Radio value="inching1">1인칭 시점</Radio>
                    <Radio value="inching3">3인칭 시점</Radio>
                  </RadioGroup>
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
    </div>
  );
}
