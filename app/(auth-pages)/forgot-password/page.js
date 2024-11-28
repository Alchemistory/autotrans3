"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { Button, Input, Checkbox, Link } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";

export default function Login() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [possible, setPossible] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchQuizData() {
      const { data, error } = await supabase
        .from("quiz")
        .select("question, answer")
        .single();

      if (error) {
        console.error("Error fetching quiz data:", error);
      } else {
        setQuestion(data.question);
        setAnswer(data.answer);
      }
    }

    fetchQuizData();
  }, []);

  return (
    <form className="flex flex-col w-full">
      <div>
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
            <p className="pb-4 text-left text-3xl font-semibold">
              비밀번호 찾기
            </p>
            {question && !possible ? (
              <>
                <Input
                  label={question}
                  labelPlacement="outside"
                  name="answer"
                  placeholder="정답을 입력해주세요"
                  type="text"
                  variant="bordered"
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                />
                {answer === candidateAnswer && (
                  <Button
                    color="primary"
                    type="button"
                    onClick={() => setPossible(true)}
                  >
                    비밀번호 변경하기
                  </Button>
                )}
              </>
            ) : possible ? (
              <>
                <Input
                  label="이메일"
                  labelPlacement="outside"
                  name="email"
                  placeholder="이메일을 입력해주세요"
                  type="email"
                  variant="bordered"
                />
                <Input
                  label="비밀번호"
                  labelPlacement="outside"
                  name="password"
                  placeholder="비밀번호를 입력해주세요"
                  type="password"
                  variant="bordered"
                />
                <Input
                  label="비밀번호 확인"
                  labelPlacement="outside"
                  name="confirmPassword"
                  placeholder="비밀번호를 다시 입력해주세요"
                  type="password"
                  variant="bordered"
                />
                <Button
                  color="primary"
                  type="submit"
                >
                  제출
                </Button>
              </>
            ) : (
              
              <Spinner />
            )}
          </div>
          
        </div>
      </div>
    </form>
  );
}
