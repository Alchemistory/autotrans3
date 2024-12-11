"use client";
import {useState,useEffect} from "react";
import Tiptap from "./Tiptap";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";

function Chunk() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="my-3">
      <CheckboxGroup
        color="primary"
        defaultValue={["all"]}
        orientation="horizontal"
      >
        <Checkbox value="all">전체선택</Checkbox>
        <Checkbox value="select">표시된 부분 모두 선택</Checkbox>
      </CheckboxGroup>
      <div className="flex flex-col gap-y-3 my-3">
        <Tiptap />
        <Tiptap />
        <Tiptap />
      </div>
    </div>
  );
}

export default Chunk;
