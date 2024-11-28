import { NextUIProvider } from "@nextui-org/react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center w-full h-full">
      {children}
    </div>
  );
}
