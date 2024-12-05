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
import { ToastContainer, toast } from "react-toastify";
import { usePathname } from "next/navigation";

function ContextCard({ isFixed, booksId, chapterId }) {
  const supabase = createClient();
  const router = useRouter();
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
  const handleSaveData = async () => {
  
  };
  

  return (
    <div className="flex flex-col gap-y-5">
      <ToastContainer
        autoClose={1000}
        hideProgressBar={false}
        position="top-center"
      />
      {isLoading ? (
        <div className="w-full h-[60vh] flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        data.sort((a, b) => a.sequence - b.sequence).map((item, index) => (
          <Card className="w-full " key={index}>
            <div className="flex flex-row justify-end items-center mt-5 mr-5 ">
              <Switch
                size="sm"
                isSelected={item.show}
                aria-label="Automatic updates"
                onChange={() => {
                  const newData = [...data];
                  newData[index].show = !newData[index].show;
                  setData(newData);
                }}
              >
                {item.show ? "Show" : "Hide"}
              </Switch>
            </div>
            {item.show && (
              <CardBody className="grid grid-cols-12 p-3">
                <div className="col-span-2 flex flex-col justify-start items-start px-5">
                  <p className="text-start">화자</p>
                  <Input
                    value={item.speaker}
                    onChange={(e) => {
                      const newData = [...data];
                      newData[index].speaker = e.target.value;
                      setData(newData);
                    }}
                    className="my-2 "
                  ></Input>
                </div>
                <div className="col-span-2 flex flex-col justify-start items-start px-5">
                  <p className="text-start">타입</p>
                  <div></div>
                  <Select
                    className="my-2 w-full"
                    defaultSelectedKeys={[item.textType]}
                    value={item.textType}
                    onSelectionChange={(selectedKeys) => {
                      const newData = [...data];
                      newData[index].textType = selectedKeys.currentKey; // Assuming selectedKeys is an object with currentKey
                      
                      // Set show to false if "Line Break" is selected
                      if (selectedKeys.currentKey === "Line Break") {
                        newData[index].show = false;
                      }
                      
                      setData(newData);
                    }}
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
                  <Tiptap value={item.text || ""} />
                </div>
              </CardBody>
            )}
            <CardFooter className="flex flex-row justify-end gap-x-5 p-3">
              <button
                onClick={() => {
                  const newItem = {
                    text: "",
                    textType: "Monologue",
                    speaker: "",
                    chapterId: chapterId,
                    booksId: booksId,
                    sequence: item.sequence + 1,
                    show: true,
                  };

                  const newData = data.map((d, i) => {
                    if (i >= index) {
                      return { ...d, sequence: d.sequence + 1 };
                    }
                    return d;
                  });

                  newData.splice(index + 1, 0, newItem);
                  setData(newData);
                }}
              >
                <FaCirclePlus className="text-4xl text-primary" />
              </button>
              <button
                className="min-w-0 p-0"
                onClick={() => {
                  const newData = data.filter((_, i) => i !== index);
                  // Reassign sequence values
                  newData.forEach((item, i) => {
                    item.sequence = i + 1;
                  });
                  setData(newData);
                }}
              >
                <FaCircleMinus className="text-4xl text-danger-500" />
              </button>
            </CardFooter>
          </Card>
        ))
      )}
      <div className="flex flex-row justify-end my-5 gap-x-5">
        <Button onClick={() => router.back()} color="danger" variant="light">
          뒤로
        </Button>
        <Button onClick={handleSaveData} color="primary">저장</Button>
        <Button className="text-white" color="success">
          확정
        </Button>
      </div>
    </div>
  );
}

export default ContextCard;
