// import Link from "next/link";
// import { Fragment } from "react";
// import { usePathname } from "next/navigation";
// import { Title, Collapse } from "rizzui";
// import cn from "@core/utils/class-names";
// import { PiCaretDownBold } from "react-icons/pi";
// import {
//   menuItemsSuperAmin,
//   menuItemsTenant,
// } from "@/layouts/hydrogen/menu-items";
// import StatusBadge from "@core/components/get-status-badge";
// import { useAtom } from "jotai";
// import { currentUserAtom } from "@/store/authAtom";

// export function SidebarMenu() {
//   const pathname = usePathname();

//   const [currentUser] = useAtom(currentUserAtom);

//   const menuItems =
//     currentUser?.role === "super-admin" ? menuItemsSuperAmin : menuItemsTenant;

//   console.log(menuItems, "lsk");

//   return (
//     <div className="mt-4 pb-3 3xl:mt-6">
//       {menuItems.map((item: any, index) => {
//         const isActive = pathname === (item?.href as string);
//         const pathnameExistInDropdowns: any = item?.dropdownItems?.filter(
//           (dropdownItem: any) => dropdownItem.href === pathname
//         );
//         const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);

//         return (
//           <Fragment key={item.name + "-" + index}>
//             {item?.href ? (
//               <>
//                 {item?.dropdownItems ? (
//                   <Collapse
//                     defaultOpen={isDropdownOpen}
//                     header={({ open, toggle }) => (
//                       <div
//                         onClick={toggle}
//                         className={cn(
//                           "group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2",
//                           isDropdownOpen
//                             ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
//                             : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700"
//                         )}
//                       >
//                         <span className="flex items-center">
//                           {item?.icon && (
//                             <span
//                               className={cn(
//                                 "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
//                                 isDropdownOpen
//                                   ? "text-primary"
//                                   : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
//                               )}
//                             >
//                               {item?.icon}
//                             </span>
//                           )}
//                           {item.name}
//                         </span>

//                         <PiCaretDownBold
//                           strokeWidth={3}
//                           className={cn(
//                             "h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90",
//                             open && "rotate-0 rtl:rotate-0"
//                           )}
//                         />
//                       </div>
//                     )}
//                   >
//                     {item?.dropdownItems?.map(
//                       (dropdownItem: any, index: number) => {
//                         const isChildActive =
//                           pathname === (dropdownItem?.href as string);

//                         return (
//                           <Link
//                             href={dropdownItem?.href}
//                             key={dropdownItem?.name + index}
//                             className={cn(
//                               "mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5",
//                               isChildActive
//                                 ? "text-primary"
//                                 : "text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
//                             )}
//                           >
//                             <div className="flex items-center truncate">
//                               <span
//                                 className={cn(
//                                   "me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200",
//                                   isChildActive
//                                     ? "bg-primary ring-[1px] ring-primary"
//                                     : "opacity-40"
//                                 )}
//                               />{" "}
//                               <span className="truncate">
//                                 {dropdownItem?.name}
//                               </span>
//                             </div>
//                             {dropdownItem?.badge?.length ? (
//                               <StatusBadge status={dropdownItem?.badge} />
//                             ) : null}
//                           </Link>
//                         );
//                       }
//                     )}
//                   </Collapse>
//                 ) : (
//                   <Link
//                     href={item?.href}
//                     className={cn(
//                       "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
//                       isActive
//                         ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
//                         : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90"
//                     )}
//                   >
//                     <div className="flex items-center truncate">
//                       {item?.icon && (
//                         <span
//                           className={cn(
//                             "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
//                             isActive
//                               ? "text-primary"
//                               : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
//                           )}
//                         >
//                           {item?.icon}
//                         </span>
//                       )}
//                       <span className="truncate">{item.name}</span>
//                     </div>
//                     {item?.badge?.length ? (
//                       <StatusBadge status={item?.badge} />
//                     ) : null}
//                   </Link>
//                 )}
//               </>
//             ) : (
//               <Title
//                 as="h6"
//                 className={cn(
//                   "mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8",
//                   index !== 0 && "mt-6 3xl:mt-7"
//                 )}
//               >
//                 {item.name}
//               </Title>
//             )}
//           </Fragment>
//         );
//       })}
//     </div>
//   );
// }

// import Link from "next/link";
// import { Fragment } from "react";
// import { usePathname } from "next/navigation";
// import { Title, Collapse } from "rizzui";
// import cn from "@core/utils/class-names";
// import { PiCaretDownBold } from "react-icons/pi";
// import {
//   menuItemsSuperAmin,
//   menuItemsTenant,
// } from "@/layouts/hydrogen/menu-items";
// import StatusBadge from "@core/components/get-status-badge";
// import { useAtom } from "jotai";
// import { currentUserAtom } from "@/store/authAtom";

// export function SidebarMenu() {
//   const pathname = usePathname();

//   const [currentUser] = useAtom(currentUserAtom);

//   // Filter menu items based on accessible_modules if user is "tenant-user"
//   const filterMenuItemsForTenantUser = (items: any[]) => {
//     if (currentUser?.role !== "tenant-user") return items;

//     return items
//       .map((item) => {
//         if (item?.dropdownItems) {
//           // Filter dropdown items based on accessible_modules
//           const filteredDropdownItems = item.dropdownItems.filter(
//             (dropdownItem: any) =>
//               currentUser?.accessible_modules?.includes(dropdownItem.key)
//           );
//           return filteredDropdownItems.length
//             ? { ...item, dropdownItems: filteredDropdownItems }
//             : null;
//         }

//         // Filter top-level items
//         return currentUser?.accessible_modules?.includes(item.key)
//           ? item
//           : null;
//       })
//       .filter(Boolean); // Remove null items
//   };

//   // Determine the menu items to render
//   const menuItems =
//     currentUser?.role === "super-admin"
//       ? menuItemsSuperAmin
//       : filterMenuItemsForTenantUser(menuItemsTenant);

//   return (
//     <div className="mt-4 pb-3 3xl:mt-6">
//       {menuItems.map((item: any, index) => {
//         const isActive = pathname === (item?.href as string);
//         const pathnameExistInDropdowns: any = item?.dropdownItems?.filter(
//           (dropdownItem: any) => dropdownItem.href === pathname
//         );
//         const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);

//         return (
//           <Fragment key={item.name + "-" + index}>
//             {item?.href ? (
//               <>
//                 {item?.dropdownItems ? (
//                   <Collapse
//                     defaultOpen={isDropdownOpen}
//                     header={({ open, toggle }) => (
//                       <div
//                         onClick={toggle}
//                         className={cn(
//                           "group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2",
//                           isDropdownOpen
//                             ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
//                             : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700"
//                         )}
//                       >
//                         <span className="flex items-center">
//                           {item?.icon && (
//                             <span
//                               className={cn(
//                                 "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
//                                 isDropdownOpen
//                                   ? "text-primary"
//                                   : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
//                               )}
//                             >
//                               {item?.icon}
//                             </span>
//                           )}
//                           {item.name}
//                         </span>

//                         <PiCaretDownBold
//                           strokeWidth={3}
//                           className={cn(
//                             "h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90",
//                             open && "rotate-0 rtl:rotate-0"
//                           )}
//                         />
//                       </div>
//                     )}
//                   >
//                     {item?.dropdownItems?.map(
//                       (dropdownItem: any, index: number) => {
//                         const isChildActive =
//                           pathname === (dropdownItem?.href as string);

//                         return (
//                           <Link
//                             href={dropdownItem?.href}
//                             key={dropdownItem?.name + index}
//                             className={cn(
//                               "mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5",
//                               isChildActive
//                                 ? "text-primary"
//                                 : "text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
//                             )}
//                           >
//                             <div className="flex items-center truncate">
//                               <span
//                                 className={cn(
//                                   "me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200",
//                                   isChildActive
//                                     ? "bg-primary ring-[1px] ring-primary"
//                                     : "opacity-40"
//                                 )}
//                               />{" "}
//                               <span className="truncate">
//                                 {dropdownItem?.name}
//                               </span>
//                             </div>
//                             {dropdownItem?.badge?.length ? (
//                               <StatusBadge status={dropdownItem?.badge} />
//                             ) : null}
//                           </Link>
//                         );
//                       }
//                     )}
//                   </Collapse>
//                 ) : (
//                   <Link
//                     href={item?.href}
//                     className={cn(
//                       "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
//                       isActive
//                         ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
//                         : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90"
//                     )}
//                   >
//                     <div className="flex items-center truncate">
//                       {item?.icon && (
//                         <span
//                           className={cn(
//                             "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
//                             isActive
//                               ? "text-primary"
//                               : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
//                           )}
//                         >
//                           {item?.icon}
//                         </span>
//                       )}
//                       <span className="truncate">{item.name}</span>
//                     </div>
//                     {item?.badge?.length ? (
//                       <StatusBadge status={item?.badge} />
//                     ) : null}
//                   </Link>
//                 )}
//               </>
//             ) : (
//               <Title
//                 as="h6"
//                 className={cn(
//                   "mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8",
//                   index !== 0 && "mt-6 3xl:mt-7"
//                 )}
//               >
//                 {item.name}
//               </Title>
//             )}
//           </Fragment>
//         );
//       })}
//     </div>
//   );
// }

// neww

// import Link from "next/link";
// import { Fragment, useState } from "react";
// import { usePathname } from "next/navigation";
// import { Title, Collapse } from "rizzui";
// import cn from "@core/utils/class-names";
// import { PiCaretDownBold } from "react-icons/pi";
// import {
//   menuItemsSuperAmin,
//   menuItemsTenant,
// } from "@/layouts/hydrogen/menu-items";
// import StatusBadge from "@core/components/get-status-badge";
// import { useAtom } from "jotai";
// import { currentUserAtom } from "@/store/authAtom";

// export function SidebarMenu() {
//   const pathname = usePathname();
//   const [currentUser] = useAtom(currentUserAtom);
//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   const filterMenuItemsForTenantUser = (items: any[]) => {
//     if (currentUser?.role !== "tenant-user") return items;
//     return items
//       .map((item) => {
//         if (item?.dropdownItems) {
//           const filtered = item.dropdownItems.filter((d: any) =>
//             currentUser?.accessible_modules?.includes(d.key)
//           );
//           return filtered.length ? { ...item, dropdownItems: filtered } : null;
//         }
//         return currentUser?.accessible_modules?.includes(item.key)
//           ? item
//           : null;
//       })
//       .filter(Boolean);
//   };

//   const menuItems =
//     currentUser?.role === "super-admin"
//       ? menuItemsSuperAmin
//       : filterMenuItemsForTenantUser(menuItemsTenant);

//   return (
//     <div className="mt-4 pb-3 3xl:mt-6">
//       {menuItems.map((item: any, index: number) => {
//         const isActive = pathname === item?.href;
//         const hasChildren = !!item?.dropdownItems;

//         return (
//           <Fragment key={item.name + "-" + index}>
//             {item?.href ? (
//               <>
//                 {hasChildren ? (
//                   <Collapse
//                     key={
//                       openIndex === index ? `open-${index}` : `closed-${index}`
//                     }
//                     defaultOpen={openIndex === index}
//                     header={({ toggle }) => (
//                       <div
//                         onClick={() =>
//                           setOpenIndex((prev) =>
//                             prev === index ? null : index
//                           )
//                         }
//                         className={cn(
//                           "group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2",
//                           openIndex === index
//                             ? "text-primary"
//                             : "text-gray-700 hover:bg-gray-100 dark:text-gray-700/90"
//                         )}
//                       >
//                         <span className="flex items-center">
//                           {item.icon && (
//                             <span className="me-2 inline-flex h-5 w-5 items-center justify-center rounded-md">
//                               {item.icon}
//                             </span>
//                           )}
//                           {item.name}
//                         </span>
//                         <PiCaretDownBold
//                           strokeWidth={3}
//                           className={cn(
//                             "h-3.5 w-3.5 -rotate-90 transition-transform duration-200",
//                             openIndex === index && "rotate-0"
//                           )}
//                         />
//                       </div>
//                     )}
//                   >
//                     {item.dropdownItems.map(
//                       (dropdownItem: any, idx: number) => {
//                         const isChildActive = pathname === dropdownItem?.href;
//                         return (
//                           <Link
//                             key={dropdownItem.name + idx}
//                             href={dropdownItem.href}
//                             className={cn(
//                               "mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize 2xl:mx-5",
//                               isChildActive
//                                 ? "text-primary"
//                                 : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
//                             )}
//                           >
//                             <div className="flex items-center truncate">
//                               <span
//                                 className={cn(
//                                   "me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current",
//                                   isChildActive
//                                     ? "bg-primary ring ring-primary"
//                                     : "opacity-40"
//                                 )}
//                               />
//                               <span className="truncate">
//                                 {dropdownItem.name}
//                               </span>
//                             </div>
//                             {dropdownItem.badge?.length ? (
//                               <StatusBadge status={dropdownItem.badge} />
//                             ) : null}
//                           </Link>
//                         );
//                       }
//                     )}
//                   </Collapse>
//                 ) : (
//                   <Link
//                     href={item.href}
//                     className={cn(
//                       "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
//                       isActive
//                         ? "text-primary"
//                         : "text-gray-700 hover:bg-gray-100 dark:text-gray-700/90"
//                     )}
//                   >
//                     <div className="flex items-center truncate">
//                       {item.icon && (
//                         <span className="me-2 inline-flex h-5 w-5">
//                           {item.icon}
//                         </span>
//                       )}
//                       <span className="truncate">{item.name}</span>
//                     </div>
//                     {item.badge?.length ? (
//                       <StatusBadge status={item.badge} />
//                     ) : null}
//                   </Link>
//                 )}
//               </>
//             ) : (
//               <Title
//                 as="h6"
//                 className={cn(
//                   "mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8",
//                   index !== 0 && "mt-6 3xl:mt-7"
//                 )}
//               >
//                 {item.name}
//               </Title>
//             )}
//           </Fragment>
//         );
//       })}
//     </div>
//   );
// }
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Fragment, useState } from "react";
// import { Title, Collapse } from "rizzui";
// import cn from "@core/utils/class-names";
// import { PiCaretDownBold } from "react-icons/pi";
// import {
//   menuItemsSuperAmin,
//   menuItemsTenant,
// } from "@/layouts/hydrogen/menu-items";
// import StatusBadge from "@core/components/get-status-badge";
// import { useAtom } from "jotai";
// import { currentUserAtom } from "@/store/authAtom";

// export function SidebarMenu({
//   isCollapsed = false,
// }: {
//   isCollapsed?: boolean;
// }) {
//   const pathname = usePathname();
//   const [currentUser] = useAtom(currentUserAtom);
//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   const filterMenuItemsForTenantUser = (items: any[]) => {
//     if (currentUser?.role !== "tenant-user") return items;
//     return items
//       .map((item) => {
//         if (item?.dropdownItems) {
//           const filtered = item.dropdownItems.filter((d: any) =>
//             currentUser?.accessible_modules?.includes(d.key)
//           );
//           return filtered.length ? { ...item, dropdownItems: filtered } : null;
//         }
//         return currentUser?.accessible_modules?.includes(item.key)
//           ? item
//           : null;
//       })
//       .filter(Boolean);
//   };

//   const menuItems =
//     currentUser?.role === "super-admin"
//       ? menuItemsSuperAmin
//       : filterMenuItemsForTenantUser(menuItemsTenant);

//   return (
//     <div className="px-3">
//       {menuItems.map((item: any, index: number) => {
//         const isActive = pathname === item?.href;
//         const hasChildren = !!item?.dropdownItems;
//         const isOpen = openIndex === index;

//         return (
//           <Fragment key={item.name + "-" + index}>
//             {item?.href ? (
//               <>
//                 {hasChildren ? (
//                   <Collapse
//                     key={
//                       openIndex === index ? `open-${index}` : `closed-${index}`
//                     }
//                     defaultOpen={openIndex === index}
//                     header={() => (
//                       <div
//                         onClick={() => setOpenIndex(isOpen ? null : index)}
//                         className={cn(
//                           "flex items-center justify-between cursor-pointer rounded-md my-1 px-3 py-2 font-medium text-sm transition-colors duration-150",
//                           isOpen
//                             ? "bg-yellow-400 text-white"
//                             : "text-gray-800 hover:bg-gray-100"
//                         )}
//                       >
//                         <span className="flex items-center">
//                           {item.icon && (
//                             <span className="me-2 text-lg">{item.icon}</span>
//                           )}
//                           {item.name}
//                         </span>
//                         <PiCaretDownBold
//                           className={cn(
//                             "h-3.5 w-3.5 transition-transform",
//                             isOpen ? "rotate-0" : "-rotate-90"
//                           )}
//                         />
//                       </div>
//                     )}
//                   >
//                     {item.dropdownItems.map(
//                       (dropdownItem: any, idx: number) => {
//                         const isChildActive = pathname === dropdownItem?.href;
//                         return (
//                           <Link
//                             key={dropdownItem.name + idx}
//                             href={dropdownItem.href}
//                             className={cn(
//                               "ml-6 mt-1 block rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150",
//                               isChildActive
//                                 ? "text-primary"
//                                 : "text-gray-600 hover:text-gray-900"
//                             )}
//                           >
//                             {dropdownItem.name}
//                           </Link>
//                         );
//                       }
//                     )}
//                   </Collapse>
//                 ) : (
//                   <Link
//                     href={item.href}
//                     className={cn(
//                       "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
//                       isActive
//                         ? "bg-yellow-400 text-white"
//                         : "text-gray-800 hover:bg-gray-100"
//                     )}
//                   >
//                     <span className="flex items-center">
//                       {item.icon && (
//                         <span className="me-2 text-lg">{item.icon}</span>
//                       )}
//                       {item.name}
//                     </span>
//                     {item.badge?.length ? (
//                       <></>
//                     ) : // <StatusBadge status={item.badge} />
//                     null}
//                   </Link>
//                 )}
//               </>
//             ) : (
//               <Title
//                 as="h6"
//                 className={cn(
//                   "mt-6 mb-2 px-3 text-xs font-semibold uppercase text-gray-500 tracking-wide"
//                 )}
//               >
//                 {item.name}
//               </Title>
//             )}
//           </Fragment>
//         );
//       })}
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import { Title, Collapse } from "rizzui";
import cn from "@core/utils/class-names";
import { PiCaretDownBold } from "react-icons/pi";
import {
  menuItemsSuperAmin,
  menuItemsTenant,
} from "@/layouts/hydrogen/menu-items";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/authAtom";

export function SidebarMenu({
  isCollapsed = false,
}: {
  isCollapsed?: boolean;
}) {
  const pathname = usePathname();
  const [currentUser] = useAtom(currentUserAtom);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filterMenuItemsForTenantUser = (items: any[]) => {
    if (currentUser?.role !== "tenant-user") return items;
    return items
      .map((item) => {
        if (item?.dropdownItems) {
          const filtered = item.dropdownItems.filter((d: any) =>
            currentUser?.accessible_modules?.includes(d.key)
          );
          return filtered.length ? { ...item, dropdownItems: filtered } : null;
        }
        return currentUser?.accessible_modules?.includes(item.key)
          ? item
          : null;
      })
      .filter(Boolean);
  };

  const menuItems =
    currentUser?.role === "super-admin"
      ? menuItemsSuperAmin
      : filterMenuItemsForTenantUser(menuItemsTenant);

  return (
    <div className="px-3">
      {menuItems.map((item: any, index: number) => {
        const isActive = pathname === item?.href;
        const hasChildren = !!item?.dropdownItems;
        const isOpen = openIndex === index;

        return (
          <Fragment key={item.name + "-" + index}>
            {item?.href ? (
              <>
                {hasChildren ? (
                  <Collapse
                    key={
                      openIndex === index ? `open-${index}` : `closed-${index}`
                    }
                    defaultOpen={openIndex === index}
                    header={() => (
                      <div
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className={cn(
                          "flex items-center justify-between cursor-pointer rounded-md px-3 py-2 font-medium text-sm transition-colors duration-150 my-2",
                          isOpen
                            ? "bg-yellow-400 text-black"
                            : "text-gray-800 hover:bg-gray-100"
                        )}
                        title={isCollapsed ? item.name : ""}
                      >
                        <span
                          className={cn(
                            "flex items-center",
                            isCollapsed && "justify-center w-full"
                          )}
                        >
                          {item.icon && (
                            <span className="text-lg">{item.icon}</span>
                          )}
                          {!isCollapsed && (
                            <span className={`ms-2 text-sidebar font-normal`}>
                              {item.name}
                            </span>
                          )}
                        </span>
                        {!isCollapsed && (
                          <PiCaretDownBold
                            className={cn(
                              "h-3.5 w-3.5 transition-transform",
                              isOpen ? "rotate-0" : "-rotate-90"
                            )}
                          />
                        )}
                      </div>
                    )}
                  >
                    {item.dropdownItems.map(
                      (dropdownItem: any, idx: number) => {
                        const isChildActive = pathname === dropdownItem?.href;
                        return (
                          <Link
                            key={dropdownItem.name + idx}
                            href={dropdownItem.href}
                            title={isCollapsed ? dropdownItem.name : ""}
                            className={cn(
                              "ml-6 mt-1 block rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150",
                              isChildActive
                                ? "text-[#101820] font-bold"
                                : "text-gray-600 hover:text-gray-900"
                            )}
                          >
                            {!isCollapsed && dropdownItem.name}
                          </Link>
                        );
                      }
                    )}
                  </Collapse>
                ) : (
                  <Link
                    href={item.href}
                    title={isCollapsed ? item.name : ""}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "bg-yellow-400 text-white"
                        : "text-gray-800 hover:bg-gray-100"
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center",
                        isCollapsed && "justify-center w-full"
                      )}
                    >
                      {item.icon && (
                        <span className="text-lg">{item.icon}</span>
                      )}
                      {!isCollapsed && (
                        <span className={`ms-2 text-sidebar font-normal`}>
                          {" "}
                          {item.name}
                        </span>
                      )}
                    </span>
                  </Link>
                )}
              </>
            ) : (
              !isCollapsed && (
                <Title
                  as="h6"
                  className={cn(
                    "mt-6 mb-2 px-3 text-xs uppercase text-gray-500 tracking-wide"
                  )}
                >
                  {item.name}
                </Title>
              )
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
