// "use client";

// import Link from "next/link";
// import cn from "@core/utils/class-names";
// import SimpleBar from "@core/ui/simplebar";
// import Logo from "@core/components/logo";
// import { SidebarMenu } from "./sidebar-menu";
// import WorkSpaceSwitcher from "./work-space-switcher";
// import { useAtom } from "jotai";
// import { currentUserAtom } from "@/store/authAtom";
// import { useEffect, useState } from "react";
// import organizationService from "@/services/organizationService";

// export default function Sidebar({ className }: { className?: string }) {
//   const [currentUser] = useAtom(currentUserAtom);
//   const [organizations, setOrganizations] = useState([]);

//   console.log(currentUser, "heyyyaa");

//   useEffect(() => {
//     // currentUser?.role === "tenant-user"
//     if (
//       currentUser?.role === "tenant-owner" ||
//       currentUser?.role === "tenant-user"
//     ) {
//       fetchOrganization();
//     }
//   }, [currentUser]);

//   const fetchOrganization = async () => {
//     const res = await organizationService.getList({});

//     const data = res.data.map((cur: any) => {
//       return {
//         label: cur.name,
//         value: cur._id,
//         category: cur.business_category,
//       };
//     });
//     setOrganizations(data);
//   };

//   let defaultSelected = currentUser?.selectedOrganization
//     ? {
//         label: currentUser.selectedOrganization.name,
//         value: currentUser.selectedOrganization._id,
//         category: currentUser.selectedOrganization.business_category,
//       }
//     : {};

//   return (
//     <aside
//       className={cn(
//         "fixed bottom-0 start-0 z-50 h-full w-[270px] border-e-2 border-gray-100 bg-white dark:bg-gray-100/50 2xl:w-72",
//         className
//       )}
//     >
//       <SimpleBar className="h-[calc(100%-80px)]">
//         <SidebarMenu />
//       </SimpleBar>
//     </aside>
//   );
// }

// "use client";

// import cn from "@core/utils/class-names";
// import SimpleBar from "@core/ui/simplebar";
// import { SidebarMenu } from "./sidebar-menu";

// export default function Sidebar({ className }: { className?: string }) {
//   return (
//     <aside
//       className={cn(
//         "fixed bottom-0 start-0 z-50 h-full w-[270px] bg-white shadow-sm border-r border-gray-200",
//         className
//       )}
//     >
//       <SimpleBar className="h-full py-6">
//         <SidebarMenu />
//       </SimpleBar>
//     </aside>
//   );
// }

"use client";

import { useEffect } from "react";
import cn from "@core/utils/class-names";
import SimpleBar from "@core/ui/simplebar";
import { SidebarMenu } from "./sidebar-menu";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Sidebar({
  isMobileOpen,
  toggleSidebar,
  isCollapsed,
  toggleCollapse,
}: {
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}) {
  useEffect(() => {
    const closeSidebarOnResize = () => {
      if (window.innerWidth >= 1280) {
        toggleSidebar();
      }
    };
    window.addEventListener("resize", closeSidebarOnResize);
    return () => window.removeEventListener("resize", closeSidebarOnResize);
  }, []);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-[300] text-gray-700 bg-white dark:bg-gray-800 p-2 rounded-md"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <RxHamburgerMenu className="h-6 w-6" />
      </button>

      <aside
        className={cn(
          "fixed top-5 left-0 z-[1] h-full bg-white dark:bg-gray-50 shadow-[#00000080] shadow-2xl transition-all duration-300 overflow-hidden",
          isMobileOpen
            ? "translate-x-0 w-[270px]"
            : "translate-x-[-100%] lg:translate-x-0",
          isCollapsed ? "lg:w-[70px]" : "lg:w-[270px]"
        )}
      >
        {/* {!isCollapsed && ( */}
        <div className="hidden lg:flex items-center justify-start px-4 py-3 mt-16">
          <button
            onClick={toggleCollapse}
            className="text-gray-600 hover:text-gray-900"
          >
            <RxHamburgerMenu className="h-5 w-5" />
          </button>
        </div>
        {/* )} */}

        <SimpleBar className="h-[calc(100%-60px)] mt-16 lg:mt-0 lg:z-[400]">
          <SidebarMenu isCollapsed={isCollapsed} />
        </SimpleBar>
      </aside>
    </>
  );
}

{
  /* Mobile Backdrop */
}
{
  /* {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[200] xl:hidden"
          onClick={toggleSidebar}
        />
      )} */
}

// "use client";

// import { useState, useEffect } from "react";
// import cn from "@core/utils/class-names";
// import SimpleBar from "@core/ui/simplebar";
// import { SidebarMenu } from "./sidebar-menu";
// import { RxHamburgerMenu } from "react-icons/rx";

// export default function Sidebar({ className }: { className?: string }) {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   const toggleSidebar = () => {
//     if (window.innerWidth < 1280) {
//       setIsMobileOpen(!isMobileOpen);
//     } else {
//       setIsCollapsed(!isCollapsed);
//     }
//   };

//   // Close sidebar on route change (optional improvement)
//   useEffect(() => {
//     const closeSidebarOnResize = () => {
//       if (window.innerWidth >= 1280) {
//         setIsMobileOpen(false);
//       }
//     };
//     window.addEventListener("resize", closeSidebarOnResize);
//     return () => window.removeEventListener("resize", closeSidebarOnResize);
//   }, []);

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       <button
//         className="xl:hidden fixed top-4 left-4 z-[110] text-gray-700 dark:text-white bg-white p-1 rounded-md shadow-md"
//         onClick={toggleSidebar}
//       >
//         <RxHamburgerMenu className="h-6 w-6" />
//       </button>

//       {/* Sidebar Drawer */}
//       <aside
//         className={cn(
//           "fixed top-0 left-0 z-50 h-full bg-white shadow-2xl transition-all duration-300 dark:bg-gray-50",
//           "w-[270px]",
//           isCollapsed && "xl:w-[70px] hidden xl:block",
//           isMobileOpen ? "block" : "hidden",
//           "xl:block",
//           className
//         )}
//       >
//         {/* Desktop Collapse Button */}
//         <div className="hidden xl:flex items-center justify-end px-4 py-3 border-b border-gray-200 mt-20">
//           <button
//             onClick={toggleSidebar}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             <RxHamburgerMenu className="h-5 w-5" />
//           </button>
//         </div>

//         <SimpleBar className="h-[calc(100%-60px)]">
//           <SidebarMenu isCollapsed={isCollapsed} />
//         </SimpleBar>
//       </aside>

//       {/* Mobile Backdrop */}
//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 xl:hidden"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}
//     </>
//   );
// }
{
  /* <div className="sticky top-0 z-40 bg-gray-0/10 px-6 dark:bg-gray-100/5 2xl:px-8 2xl:pt-6">
        <Link
          href={"/"}
          aria-label="Site Logo"
          className="text-gray-800 hover:text-gray-900"
        >
          <Logo className="max-w-[155px]" />
        </Link>
      </div> */
}

//TODO: Must use later
// {(currentUser?.role === "tenant-owner" ||
//   currentUser?.role === "tenant-user") && (
//   <WorkSpaceSwitcher
//     className="px-6 pb-3.5 pt-3.5"
//     suffixClassName="text-gray-500 w-5 h-5"
//     data={organizations}
//     defaultSelected={defaultSelected}
//   />
// )}
