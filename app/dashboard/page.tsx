import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {


  return (
    <div className="">
      <h1 className="text-2xl font-bold">환영합니다!</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        이것은 반응형 사이드바가 있는 대시보드 레이아웃입니다.
      </p>
    </div>
  );
}
