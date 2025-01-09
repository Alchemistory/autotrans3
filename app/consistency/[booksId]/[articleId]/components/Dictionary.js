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
import { ToastContainer, toast } from "react-toastify";
import { useDictionary } from "@/store/useDictionary";
import { useSelectedDictionary } from '@/store/useSelectedDictionary';
function Dictionary({ booksId, articleId }) {
  const [categories, setCategories] = useState([]);
  const {dictionary, setDictionary} = useDictionary()
  const [selectedLargeCategory, setSelectedLargeCategory] = useState("");
  const [selectedMediumCategory, setSelectedMediumCategory] = useState("");
  const [selectedSmallCategory, setSelectedSmallCategory] = useState("");
  const [filteredDictionary, setFilteredDictionary] = useState([]);
  const {selectedDictionary, setSelectedDictionary} = useSelectedDictionary();
  const [isLoading, setIsLoading] = useState(true);
  const [myId, setMyId] = useState(null);
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
      .eq("booksId", booksId)
      .order("id", { ascending: false });

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

  useEffect(() => {
    if (
      !selectedLargeCategory &&
      !selectedMediumCategory &&
      !selectedSmallCategory
    ) {
      setFilteredDictionary(dictionary);
    } else {
      setFilteredDictionary(
        dictionary.filter(
          (item) =>
            (selectedLargeCategory
              ? item.categoryLarge === selectedLargeCategory
              : true) &&
            (selectedMediumCategory
              ? item.categoryMiddle === selectedMediumCategory
              : true) &&
            (selectedSmallCategory
              ? item.categorySmall === selectedSmallCategory
              : true)
        )
      );
    }
  }, [selectedLargeCategory, selectedMediumCategory, selectedSmallCategory,dictionary]);
  

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("dictionaryList")
      .delete()
      .eq("id", id);
    if (error) {
      console.log(error);
    } else {
      getDictionary();
      toast.success("삭제되었습니다.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-y-3">
      <ToastContainer
        autoClose={1000}
        hideProgressBar={false}
        position="top-center"
      />
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
                value={selectedLargeCategory}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  setSelectedLargeCategory(key);
                }}
              >

                {categories
                  .filter((category) => category.variant === "large")
                  .map((category) => (
                    <SelectItem key={category.name} value={category.name}>
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
                value={selectedMediumCategory}
                onChange={(e) => setSelectedMediumCategory(e.target.value)}
              >
                {categories
                  .filter((category) => category.variant === "medium")
                  .map((category) => (
                    <SelectItem key={category.name} value={category.name}>
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
                value={selectedSmallCategory}
                onChange={(e) => setSelectedSmallCategory(e.target.value)}
              >
                {categories
                  .filter((category) => category.variant === "small")
                  .map((category) => (
                    <SelectItem key={category.name} value={category.name}>
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
            onSelectionChange={(input) => {
              const keys = Array.from(input).map(key => Number(key));
              const selectedDict = dictionary.filter((item) => keys.includes(Number(item.id)));
              setSelectedDictionary(selectedDict);
            }}
            
          >
            {filteredDictionary?.map((item, index) => (
              <ListboxItem
                className="border-2 border-sky-200 text-sm"
                key={item.id}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-1">
                      {item.isNew === true ? (
                        <GoDotFill
                          className={`${item.isFixedSpeaker ? "text-green-500" : "text-red-500"}`}
                        />
                      ) : (
                        <></>
                      )}
                      <span className="text-[10px] text-default-400">
                        {item.categoryLarge} /{item.categoryMiddle} /{" "}
                        {item.categorySmall}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs">{item.titleKR}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ChangeModal
                      myId={myId}
                      setMyId={setMyId}
                      dictionary={dictionary}
                      getDictionary={getDictionary}
                      item={item}
                      booksId={booksId}
                      articleId={articleId}
                      categories={categories}
                    />
                    <Button
                      isIconOnly
                      aria-label="Like"
                      color=""
                      onClick={() => handleDelete(item.id)}
                    >
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
