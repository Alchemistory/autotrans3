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
function DictionaryList() {
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

  return (
    <div>
      <div className="my-5 w-full  flex-row justify-between items-center gap-x-5 grid grid-cols-12">
        <Input
          onValueChange={(value) => setSearch(value)}
          startContent={<IoSearch className="text-medium" />}
          type="email"
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
          >
            <SelectItem key="1">1</SelectItem>
          </Select>
          <Select
            variant="underlined"
            label="중분류"
            className="col-span-1 h-12 "
          >
            <SelectItem key="1">1</SelectItem>
          </Select>
          <Select
            variant="underlined"
            label="소분류"
            className="col-span-1 h-12 "
          >
            <SelectItem key="1">1</SelectItem>
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
            <TableRow key="1">
              <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                Tony Reichert
              </TableCell>
              <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                CEO
              </TableCell>
              <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                Active
              </TableCell>
              <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                Active
              </TableCell>
              <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                Active
              </TableCell>
              <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                <Button variant="light" color="success">
                  수정
                </Button>
                <Button variant="light" color="danger">
                  삭제
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Modal size="2xl" isOpen={isOpen1} onOpenChange={onOpenChange1}>
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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  닫기
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
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

export default DictionaryList;
