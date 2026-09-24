import type { Metadata } from "next";
import { inter, lexendDeca } from "@/app/fonts";
import cn from "@core/utils/class-names";
import NextProgress from "@core/components/next-progress";
import { ThemeProvider, JotaiProvider } from "@/app/shared/theme-provider";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import { Toaster } from "react-hot-toast";
import AppWrapper from "@/app/shared/appWrapper";

import "./globals.css";

export const metadata: Metadata = {
  title: "App Name",
  description: "Write your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html
      // 💡 Prevent next-themes hydration warning
      suppressHydrationWarning
    >
      <head>
        <title>Enterprise ERP</title>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        // to prevent any warning that is caused by third party extensions like Grammarly
        suppressHydrationWarning
        className={cn(
          inter.variable,
          lexendDeca.variable,
          "font-inter theme-cuebiz"
        )}
      >
        <ThemeProvider>
          <NextProgress />
          <JotaiProvider>
            <AppWrapper>{children}</AppWrapper>
            <Toaster />
            <GlobalDrawer />
            <GlobalModal />
          </JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
