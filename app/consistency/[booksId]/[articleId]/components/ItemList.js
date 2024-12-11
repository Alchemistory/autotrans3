"use client";
import React from "react";
import { Select, SelectItem, Listbox, ListboxItem } from "@nextui-org/react";
import { GoDotFill, GoPencil } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

function ItemList() {
  return (
    <div className="w-full h-full flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-3">
        <div
          className="border-2 border-yellow-500 rounded-lg p-2 text-sm relative"
          key="1"
        >
          <div className="w-auto h-full absolute top-1 right-1">
            <MdOutlineCancel className="text-yellow-500" />
          </div>
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
          </div>
        </div>
        <div
          className="border-2 border-yellow-500 rounded-lg p-2 text-sm relative"
          key="2"
        >
          <div className="w-auto h-full absolute top-1 right-1">
            <MdOutlineCancel className="text-yellow-500" />
          </div>
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
            <div className="flex items-center gap-x-2"></div>
          </div>
        </div>
        <div
          className="border-2 border-yellow-500 rounded-lg p-2 text-sm relative"
          key="3"
        >
          <div className="w-auto h-full absolute top-1 right-1">
            <MdOutlineCancel className="text-yellow-500" />
          </div>
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
            <div className="flex items-center gap-x-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemList;
