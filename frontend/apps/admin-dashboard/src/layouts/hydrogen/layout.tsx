// import { useAtom } from "jotai";
// import Header from "./header";
// import Sidebar from "./sidebar";
// import { currentUserAtom } from "@/store/authAtom";

// export default function HydrogenLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [currentUser] = useAtom(currentUserAtom);
//   // flex w-full flex-col xl:ms-[270px] xl:w-[calc(100%-270px)] 2xl:ms-72 2xl:w-[calc(100%-288px)]
//   return (
//     <main className="min-h-screen flex-grow">
//       <div className="">
//         <Header />
//         <Sidebar className="z-[60]" />
//         <div className="flex w-full flex-col xl:ms-[270px] xl:w-[calc(100%-270px)] 2xl:ms-72 2xl:w-[calc(100%-288px)]">
//           <div className="flex flex-grow flex-col pr-4 pb-6 md:pr-3 lg:pr-4 lg:pb-8 3xl:pr-8 4xl:pr-10 4xl:pb-9 pl-4">
//             {children}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useAtom } from "jotai";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./header";
import Sidebar from "./sidebar";
import { currentUserAtom } from "@/store/authAtom";
import cn from "@core/utils/class-names";

export default function HydrogenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser] = useAtom(currentUserAtom);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsMobileOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const bgClass = pathname.includes("/create") ? "bg-white" : "bg-[#f8f8f8]";

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[200]">
        <Header />
      </div>

      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />

      {/* Main Content */}
      <div
        className={cn(
          "pt-16 transition-all duration-300 min-h-screen", // padding top for header
          bgClass,
          isCollapsed
            ? "lg:ml-[70px] lg:w-[calc(100%-70px)]"
            : "lg:ml-[270px] lg:w-[calc(100%-270px)]"
        )}
      >
        <div>{children}</div>
      </div>
    </div>
  );
}
