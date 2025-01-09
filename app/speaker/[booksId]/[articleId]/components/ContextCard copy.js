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
  Chip,
} from "@nextui-org/react";
import Tiptap from "./Tiptap";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import { usePathname } from "next/navigation";
import SpeakerModal from "./SpeakerModal";
import { FaPlus, FaMinus } from "react-icons/fa";

function ContextCard({ isFixed, booksId, chapterId }) {
  const supabase = createClient();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [changedData, setChangedData] = useState([]);
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
      setInitialData(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const convertHtmlToText = (html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.innerText.replace(/\n/g, "<br>");
    };

    const updatedData = data.map((item) => ({
      ...item,
      text: convertHtmlToText(item.text),
    }));

    setChangedData(updatedData);
  }, [data]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveData = async () => {
    try {
      // Check for deleted items
      const deletedItems = initialData.filter(
        (initialItem) => !data.some((item) => item.id === initialItem.id)
      );

      // Delete removed items
      for (const item of deletedItems) {
        const { error } = await supabase
          .from("speakerAnalysis")
          .delete()
          .eq("id", item.id);

        if (error) {
          console.error("Error deleting record:", error);
        }
      }

      // Update or insert current items
      for (const item of data) {
        if (item.id) {
          // Update existing record
          const { error } = await supabase
            .from("speakerAnalysis")
            .update({
              text: item.text,
              textType: item.textType,
              speaker: item.speaker,
              sequence: item.sequence,
              show: item.show,
            })
            .eq("id", item.id);

          if (error) {
            console.error("Error updating record:", error);
          }
        } else {
          // Insert new record
          const { error } = await supabase.from("speakerAnalysis").insert({
            text: item.text,
            textType: item.textType,
            speaker: item.speaker,
            chapterId: item.chapterId,
            booksId: item.booksId,
            sequence: item.sequence,
            show: item.show,
          });

          if (error) {
            console.error("Error inserting record:", error);
          }
        }
      }
      toast.success("저장 완료");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("저장 실패");
    }
  };

  // Define a function to map textType to distinct Tailwind CSS class names
  const getChipClass = (textType) => {
    switch (textType) {
      case "Dialogue":
        return "bg-blue-500 text-white"; // Distinct color
      case "Monologue":
        return "bg-purple-500 text-white"; // Distinct color
      case "Third-person Narration":
        return "bg-green-500 text-white"; // Distinct color
      case "First-person Narration":
        return "bg-yellow-500 text-white"; // Distinct color
      case "Sound Effect":
        return "bg-red-500 text-white"; // Distinct color
      case "System Window":
        return "bg-indigo-500 text-white"; // Distinct color
      case "Miscellaneous":
        return "bg-pink-500 text-white"; // Distinct color
      case "Seperator":
        return "bg-orange-500 text-white"; // Distinct color
      case "Line Break":
        return "bg-teal-500 text-white"; // Distinct color
      default:
        return "bg-gray-200 text-white"; // Default color
    }
  };

  const handleConfirm = async () => {
    const { error } = await supabase
      .from("chapterList")
      .update({ isFixedSpeaker: true })
      .eq("booksId", booksId)
      .eq("chapterNumber", chapterId);
    if (error) {
      toast.error("확정 실패");
    } else {
      toast.success("확정 완료");
    }
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
        data
          .sort((a, b) => a.sequence - b.sequence)
          .map((item, index) => (
            <Card className="w-full " key={index}>
              <>
                <CardBody
                  className={`grid grid-cols-12 p-2 ${
                    item.show ? "" : "justify-end flex items-end"
                  }`}
                >
                  {item.show && (
                    <>
                      <div className="col-span-12 md:col-span-2 flex flex-col justify-start items-start px-5">
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
                      <div className="col-span-12 md:col-span-2 flex flex-col justify-start items-start px-5">
                        <p className="text-start">타입</p>
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
                          <SelectItem key="Sound Effect">
                            Sound Effect
                          </SelectItem>
                          <SelectItem key="System Window">
                            System Window
                          </SelectItem>
                          <SelectItem key="Miscellaneous">
                            Miscellaneous
                          </SelectItem>
                          <SelectItem key="Seperator">Seperator</SelectItem>
                          <SelectItem key="Line Break">Line Break</SelectItem>
                        </Select>
                        <div className="my-2 w-full flex justify-center">
                          <Chip size='sm' className={getChipClass(item.textType)}>
                            {item.textType}
                          </Chip>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-7 flex flex-col justify-evenly px-5 ">
                        <p className="text-start">본문</p>
                        <Tiptap
                          item={item}
                          data={data}
                          setData={setData}
                          value={item.text || ""}
                        />
                      </div>
                    </>
                  )}
                  <div className="col-span-1 flex flex-col justify-center items-center space-y-5">
                    <div className="flex flex-col justify-end items-center ">
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
                      {item.show && (
                        <div className="flex flex-row justify-end items-center gap-x-5 mt-5 ">
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
                            {/* <FaCirclePlus className="text-4xl text-primary" /> */}
                            <FaPlus className="text-xl text-gray-500" />
                          </button>
                          <button
                            className="min-w-0 p-0"
                            onClick={() => {
                              const newData = data.filter(
                                (_, i) => i !== index
                              );
                              // Reassign sequence values
                              newData.forEach((item, i) => {
                                item.sequence = i + 1;
                              });
                              setData(newData);
                            }}
                          >
                            {/* <FaCircleMinus className="text-4xl text-danger-500" /> */}
                            <FaMinus className="text-xl text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </>
            </Card>
          ))
      )}
      <div className="grid grid-cols-12 gap-x-5 gap-y-5">
        <Button
          color="primary"
          variant="bordered"
          className="col-span-12 md:col-span-3"
          onClick={() => router.back()}
        >
          뒤로
        </Button>
        <Button
          className="col-span-12 md:col-span-3"
          onClick={handleSaveData}
          color="primary"
        >
          저장
        </Button>
        <SpeakerModal />

        <Button
          onClick={handleConfirm}
          className="col-span-12 md:col-span-3"
          color="primary"
        >
          확정
        </Button>
      </div>
    </div>
  );
}

export default ContextCard;
