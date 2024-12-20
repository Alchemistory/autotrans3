"use client";
import React from "react";
import { Select, SelectItem,Chip } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
function FilterList() {
  const [values, setValues] = React.useState(new Set(['전체']));
  const supabase = createClient();
  const [expressionVariation, setExpressionVariation] = useState([])

  const getExpressionVariation = async () => {
    const { data, error } = await supabase
      .from("expressionVariation")
      .select("*");
    if (error) console.log(error);
    setExpressionVariation(data)
  };

  useEffect(() => {
    getExpressionVariation();
  }, []);
  return (
    <div className="flex w-full flex-row gap-x-5 items-center">
      <Select
        className="max-w-xs"
        placeholder="필터를 선택해주세요"
        selectedKeys={values}
        selectionMode="multiple"
        onSelectionChange={setValues}
      >
        {expressionVariation.map((item) => (
          <SelectItem key={item.key}>{item.label}</SelectItem>
        ))}
      </Select>
      
      <div className="flex gap-2">
        {Array.from(values).map((value) => (
          <Chip key={value} color="primary" variant="flat">
            {value}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export default FilterList;
