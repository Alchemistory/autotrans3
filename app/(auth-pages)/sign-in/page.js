import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { Button, Input, Checkbox, Link } from "@nextui-org/react";

export default async function Login(props) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col w-full">
      <div>
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
            <p className="pb-4 text-left text-3xl font-semibold">
              로그인
              <span aria-label="emoji" className="ml-2" role="img">
                👋
              </span>
            </p>

            <Input
              label="이메일"
              labelPlacement="outside"
              name="email"
              placeholder="이메일을 입력해주세요"
              type="email"
              variant="bordered"
            />

            <Input
              endContent={<button type="button"></button>}
              label="비밀번호"
              labelPlacement="outside"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              type={"password"}
              variant="bordered"
            />

            <div className="flex items-center justify-between px-1 py-2">
              <Link href='/forgot-password' className="" size="sm">
                비밀번호를 까먹었어요?
              </Link>
            </div>
            <Button formAction={signInAction} color="primary" type="submit">
              로그인
            </Button>
            <p className="text-center text-small">
              <Link href="/sign-up" size="sm">
                계정 생성하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
