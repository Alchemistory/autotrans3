"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Select,
  SelectItem,
  Listbox,
  ListboxItem,
  Spinner,
} from "@nextui-org/react";
import { LuDot } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { GoPencil } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import ChangeModal from "./ChangeModal";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
function Dictionary({ booksId, articleId }) {
  const [categories, setCategories] = useState([]);
  const [dictionary, setDictionary] = useState([]);
  const [selectedLargeCategory, setSelectedLargeCategory] = useState("");
  const [selectedMediumCategory, setSelectedMediumCategory] = useState("");
  const [selectedSmallCategory, setSelectedSmallCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const getCategories = async () => {
    const { data, error } = await supabase.from("categoryList").select("*");
    if (error) {
      console.log(error);
    } else {
      setCategories(data);
      setIsLoading(false);
    }
  };
  const getDictionary = async () => {
    const { data, error } = await supabase
      .from("dictionaryList")
      .select("*")
      .eq("booksId", booksId);
    if (error) {
      console.log(error);
    } else {
      setDictionary(data);
    }
  };
  useEffect(() => {
    getCategories();
    getDictionary();
  }, []);
  console.log("dictionary:", dictionary);
  console.log("categories:", categories);

  return (
    <div className="w-full h-full flex flex-col gap-y-3">
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-y-2 my-3">
            <div className="flex gap-x-2 justify-center items-center">
              <div className="flex-shrink-0">
                <h1 className="text-sm font-medium text-default-700">대분류</h1>
              </div>

              <Select
                size="sm"
                className="flex-grow"
                onChange={(e) => setSelectedLargeCategory(e.target.value)}
              >
                {categories
                  .filter((category) => category.variant === "large")
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </Select>
            </div>
            <div className="flex gap-x-2 justify-center items-center">
              <div className="flex-shrink-0">
                <h1 className="text-sm font-medium text-default-700">중분류</h1>
              </div>
              <Select
                size="sm"
                onChange={(e) => setSelectedMediumCategory(e.target.value)}
              >
                {categories
                  .filter((category) => category.variant === "medium")
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </Select>
            </div>
            <div className="flex gap-x-2 justify-center items-center">
              <div className="flex-shrink-0">
                <h1 className="text-sm font-medium text-default-700">소분류</h1>
              </div>
              <Select
                size="sm"
                onChange={(e) => setSelectedSmallCategory(e.target.value)}
              >
                {categories
                  .filter((category) => category.variant === "small")
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
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
            {dictionary.map((item, index) => (
              <ListboxItem
                className="border-2 border-sky-200 text-sm"
                key={index}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-1">
                      {item.isNew === true ? (
                        <GoDotFill className="text-red-500" />
                      ) : (
                        <></>
                      )}
                      <span className="text-[10px] text-default-400">
                      {item.categoryLarge} /{item.categoryMiddle} / {item.categorySmall}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs">{item.titleKR}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ChangeModal item={item} booksId={booksId} articleId={articleId} categories={categories} />
                    <Button isIconOnly aria-label="Like" color="">
                      <FaRegTrashCan className="text-gray-500" />
                    </Button>
                  </div>
                </div>
              </ListboxItem>
            ))}
          </Listbox>
        </>
      )}
    </div>
  );
}

export default Dictionary;
