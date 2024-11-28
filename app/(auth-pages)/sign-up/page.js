import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { Button, Input, Checkbox, Link } from "@nextui-org/react";
import { signUpAction } from "@/app/actions";

export default async function Login(props) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <div>
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
            <p className="pb-4 text-left text-3xl font-semibold">
              회원가입
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

            <Button formAction={signUpAction} color="primary" type="submit">
              회원가입
            </Button>
            <p className="text-center text-small">
              <Link href="/sign-in" size="sm">
                로그인으로 이동
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
