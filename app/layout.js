import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";

import SidebarComplete from "@/components/sidebar-complete";

export const metadata = {
  title: "AI 번역 서비스",
  description: "AI 번역 서비스",
};


export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ko" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <NextUIProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarComplete userServer={user} children={children}></SidebarComplete>
          </ThemeProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
