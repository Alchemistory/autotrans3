"use client";

import { useState, useEffect } from "react";
import { Avatar, Button, Spacer, useDisclosure } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { AcmeIcon } from "./acme";
import { sectionItemsWithTeams } from "./sidebar-items";
import SidebarDrawer from "./sidebar-drawer";
import { createClient } from "@/utils/supabase/client";
import Sidebar from "./sidebar";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { LuPlusCircle } from "react-icons/lu";
import { LuMinusCircle } from "react-icons/lu";
import { usePathname } from "next/navigation"; // 상단에 추가
import ProgrssSection from "./ProgrssSection";
export default function SidebarComplete({ userServer, children }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user, setUser } = useUserStore(); // Use Zustand store
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname(); // pathname 가져오기
  console.log(pathname);

  useEffect(() => {
    const handleAuthChange = async (event, session) => {
      if (session?.user) {
        console.log("User:", session.user);
        setUser(session.user); // Set user in Zustand store
      } else {
        console.log("No user found.");
        setUser(null); // Clear user in Zustand store
      }
    };

    const { data: authListener } =
      supabase.auth.onAuthStateChange(handleAuthChange);

    // Ensure authListener is an object with an unsubscribe method
    return () => {
      if (authListener && typeof authListener.unsubscribe === "function") {
        authListener.unsubscribe();
      }
    };
  }, [supabase, setUser, userServer]);

  // Add this useEffect to re-render when user changes
  useEffect(() => {
    // This effect will run whenever the user state changes
  }, [user]);

  const content = (
    <div className="relative flex h-full w-72 flex-1 flex-col p-6">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
          <AcmeIcon className="text-background" />
        </div>
        <span className="text-small font-bold uppercase text-foreground">
          AI 번역
        </span>
      </div>
      <Spacer y={8} />
      {user && (
        <div className="flex items-center gap-3 px-3">
          <Avatar isBordered size="sm" src="/profile/profile.png" />
          <div className="flex flex-col">
            <p className="text-small font-medium text-default-600">
              {(user?.email || userServer?.email) ?? "No Email"}
            </p>
            <p className="text-tiny text-default-400">Master</p>
          </div>
        </div>
      )}
      <Spacer y={8} />

      <Sidebar defaultSelectedKey="home" items={sectionItemsWithTeams} />

      <Spacer y={8} />
      <div className="mt-auto flex flex-col">
        {user ? (
          <Button
            onClick={async () => {
              await supabase.auth.signOut(); // Ensure signOut is awaited
              router.push("/sign-in");
            }}
            className="justify-start text-default-500 data-[hover=true]:text-foreground"
            startContent={<LuMinusCircle className="text-lg" />}
            variant="light"
          >
            Log Out
          </Button>
        ) : (
          <Button
            onClick={() => router.push("/sign-in")}
            className="justify-start text-default-500 data-[hover=true]:text-foreground"
            startContent={<LuPlusCircle className="text-lg" />}
            variant="light"
          >
            Log In
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh w-full">
      <SidebarDrawer
        className=" !border-r-small border-divider"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        {content}
      </SidebarDrawer>
      <div className="w-full h-full flex-col p-4 grid grid-rows-10 bg-gray-100 ">
        <header className="w-full flex row-span-1 items-center gap-2 rounded-medium border-small border-divider px-4 bg-white">
          <Button
            isIconOnly
            className="flex sm:hidden"
            size="sm"
            variant="light"
            onPress={onOpen}
          >
            <Icon
              className="text-default-500"
              height={24}
              icon="solar:hamburger-menu-outline"
              width={24}
            />
          </Button>
          {/* <h2 className="text-medium font-medium text-default-700">Overview</h2> */}
          <ProgrssSection />
        </header>
        <main className="row-span-9 mt-4 min-h-0">
          {pathname.startsWith("/consistency") ? (
            children
          ) : (
            <div className="w-full h-full rounded-medium border-small border-divider p-6 overflow-auto bg-white">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
