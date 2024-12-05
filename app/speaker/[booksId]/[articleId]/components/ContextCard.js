"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Input,
  Button,
  Select,
  SelectItem,
  Switch,
  Spinner,
} from "@nextui-org/react";
import Tiptap from "./Tiptap";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

function ContextCard({ booksId, chapterId }) {
  const supabase = createClient();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("speakerAnalysis")
      .select("*")
      .eq("booksId", booksId)
      .eq("chapterId", chapterId);

    if (error) {
      console.log(error);
    } else {
      setData(data);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-y-5">
      {isLoading ? (
        <div className="w-full h-[60vh] flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        data.map((item) => (
          <>
          <div className="flex flex-row justify-end items-center p-0 m-0">
            <Switch size='sm' defaultSelected aria-label="Automatic updates">Show</Switch>
          </div>
          <Card className="w-full ">
            <CardBody className="grid grid-cols-12 p-3">
            <div className="col-span-2 flex flex-col justify-start items-start px-5">
              <p className="text-start">화자</p>
              <Input className="my-2 "></Input>
            </div>
            <div className="col-span-2 flex flex-col justify-start items-start px-5">
              <p className="text-start">타입</p>
              <div></div>
              <Select
                className="my-2 w-full"
                defaultSelectedKeys={["Dialogue"]}
              >
                <SelectItem key="Dialogue">Dialogue</SelectItem>
                <SelectItem key="Monologue">Monologue</SelectItem>
                <SelectItem key="Third-person Narration">
                  Third-person Narration
                </SelectItem>
                <SelectItem key="First-person Narration">
                  First-person Narration
                </SelectItem>
                <SelectItem key="Sound Effect">Sound Effect</SelectItem>
                <SelectItem key="System Window">System Window</SelectItem>
                <SelectItem key="Miscellaneous">Miscellaneous</SelectItem>
                <SelectItem key="Seperator">Seperator</SelectItem>
                <SelectItem key="Line Break">Line Break</SelectItem>
              </Select>
            </div>
            <div className="col-span-8 flex flex-col justify-evenly px-5 ">
              <p className="text-start">본문</p>
              <Tiptap />
            </div>
          </CardBody>
          <CardFooter className="flex flex-row justify-end gap-x-5 p-3">
            <button>
              <FaCirclePlus className="text-4xl text-primary" />
            </button>
            <button className="min-w-0 p-0">
              <FaCircleMinus className="text-4xl text-danger-500" />
            </button>
            </CardFooter>
            </Card>
            </>
        ))
      )}
    </div>
  );
}

export default ContextCard;
