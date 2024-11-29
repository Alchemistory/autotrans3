import React from "react";
import { Input, Checkbox, Link,Button } from "@nextui-org/react";
import { cn } from "@nextui-org/react";

function page() {
  return (
    <>
    <div className="text-3xl font-bold leading-9 text-default-foreground">
      회원정보 변경
    </div>
    <form
      className={cn("flex grid grid-cols-12 flex-col gap-4 py-8")}
    >


      <Input
        className="col-span-12 md:col-span-6"
        label="이름"
        name="last-name"
        placeholder="이름을 입력해주세요"
      />

      <Input
        className="col-span-12 md:col-span-6"
        label="이메일"
        name="email"
        placeholder="이메일을 입력해주세요"
        type="email"
      />

      <Input
        className="col-span-12 md:col-span-6"
        label="비밀번호"
        name="password"
        placeholder="비밀번호를 입력해주세요"
        type="password"
      />

      <Input
        className="col-span-12 md:col-span-6"
        label="비밀번호 확인"
        name="confirm-password"
        placeholder="비밀번호를 입력해주세요"
        type="password"
      />
      <div className="col-span-12 flex justify-center my-5">
      <Button color="primary">변경하기</Button>
      </div>
      
    </form>
  </>
  );
}

export default page;
