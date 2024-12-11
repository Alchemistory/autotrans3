"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Select,
  SelectItem,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { LuDot } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { GoPencil } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import ChangeModal from "./ChangeModal";
function Dictionary() {
  return (
    <div className="w-full h-full flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-2 my-3">
        <div className="flex gap-x-2 justify-center items-center">
          <div className="flex-shrink-0">
            <h1 className="text-sm font-medium text-default-700">대분류</h1>
          </div>
          <Select size="sm" className="flex-grow">
            <SelectItem>1</SelectItem>
            <SelectItem>2</SelectItem>
            <SelectItem>3</SelectItem>
          </Select>
        </div>
        <div className="flex gap-x-2 justify-center items-center">
          <div className="flex-shrink-0">
            <h1 className="text-sm font-medium text-default-700">중분류</h1>
          </div>
          <Select size="sm">
            <SelectItem>1</SelectItem>
            <SelectItem>2</SelectItem>
            <SelectItem>3</SelectItem>
          </Select>
        </div>
        <div className="flex gap-x-2 justify-center items-center">
          <div className="flex-shrink-0">
            <h1 className="text-sm font-medium text-default-700">소분류</h1>
          </div>
          <Select size="sm">
            <SelectItem>1</SelectItem>
            <SelectItem>2</SelectItem>
            <SelectItem>3</SelectItem>
          </Select>
        </div>
      </div>
      <Listbox
        selectionMode="multiple"
        classNames={{
          list: "flex flex-col gap-y-5",
          item: "border-small border-divider text-sm",
          trigger: "text-xs",
        }}
      >
        <ListboxItem className="border-2 border-sky-200 text-sm" key="1">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-x-1">
                <GoDotFill className="text-red-500" />
                <span className="text-[10px] text-default-400">
                  용어 / 캐릭터 / -
                </span>
              </div>
              <div>
                <span className="text-xs">에스파</span>
              </div>
            </div>
            <div className="flex items-center">
              <ChangeModal />
              <Button isIconOnly aria-label="Like" color="">
                <FaRegTrashCan className="text-gray-500" />
              </Button>
            </div>
          </div>
        </ListboxItem>
        <ListboxItem className="border-2 border-sky-200 text-sm" key="2">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-x-1">
                <span className="text-[10px] text-default-400">
                  용어 / 캐릭터 / -
                </span>
              </div>
              <div>
                <span className="text-xs">아이브</span>
              </div>
            </div>
            <div className="flex items-center">
            <ChangeModal />
              <Button isIconOnly aria-label="Like" color="">
                <FaRegTrashCan className="text-gray-500" />
              </Button>
            </div>
          </div>
        </ListboxItem>
        <ListboxItem className="border-2 border-gray-200 text-sm" key="3">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-x-1">
                <span className="text-[10px] text-default-400">
                  용어 / 캐릭터 / -
                </span>
              </div>
              <div>
                <span className="text-xs">뉴진스</span>
              </div>
            </div>
            <div className="flex items-center">
            <ChangeModal />
              <Button isIconOnly aria-label="Like" color="">
                <FaRegTrashCan className="text-gray-500" />
              </Button>
            </div>
          </div>
        </ListboxItem>
      </Listbox>
    </div>
  );
}

export default Dictionary;
