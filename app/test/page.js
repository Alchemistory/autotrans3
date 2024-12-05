import React from "react";

function page() {
  return (
    <div>
      <Select
        label="타입 선택"
        className="max-w-xs"
        defaultSelectedKeys={["1"]}
      >
        <SelectItem key="1" value="1">
          타입 1
        </SelectItem>
        <SelectItem key="2" value="2">
          타입 2
        </SelectItem>
        <SelectItem key="3" value="3">
          타입 3
        </SelectItem>
      </Select>
      
    </div>
  );
}

export default page;
