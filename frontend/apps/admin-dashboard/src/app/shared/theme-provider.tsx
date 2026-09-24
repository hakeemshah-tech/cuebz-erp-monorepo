"use client";

import { Provider, useAtom, useSetAtom } from "jotai";
import { siteConfig } from "@/config/site.config";
import hideRechartsConsoleError from "@core/utils/recharts-console-error";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import authService from "@/services/authService";
import {
  currentUserAtom,
  authLoadingAtom,
  isAuthenticatedAtom,
} from "@/store/authAtom";

hideRechartsConsoleError();

export function ThemeProvider({ children }: React.PropsWithChildren<{}>) {
  return (
    <NextThemeProvider
      enableSystem={false}
      defaultTheme={String(siteConfig.mode)}
    >
      {children}
    </NextThemeProvider>
  );
}

export function JotaiProvider({ children }: React.PropsWithChildren<{}>) {
  // const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   getCurrentUser();
  // }, []);

  // const getCurrentUser = async () => {
  //   setLoading(true);
  //   try {
  //     await authService.getCurrentUser();
  //     setLoading(false);
  //   } catch (error: any) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  return <Provider>{children}</Provider>;
}
