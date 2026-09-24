// "use client";

// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import { Modal } from "rizzui";
// import SearchTrigger from "./search-trigger";
// import SearchList from "./search-list";

// export default function SearchWidget({
//   className,
//   placeholderClassName,
//   icon,
// }: {
//   className?: string;
//   icon?: React.ReactNode;
//   placeholderClassName?: string;
// }) {
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const onKeyDown = (event: KeyboardEvent) => {
//       if ((event.metaKey || event.ctrlKey) && event.key === "k") {
//         event.preventDefault();
//         setOpen(!open);
//       }
//     };
//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [open]);

//   const pathname = usePathname();
//   useEffect(() => {
//     setOpen(() => false);
//     return () => setOpen(() => false);
//   }, [pathname]);

//   return (
//     <>
//       <SearchTrigger
//         icon={icon}
//         className={className}
//         onClick={() => setOpen(true)}
//         placeholderClassName={placeholderClassName}
//       />

//       <Modal
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         overlayClassName="dark:bg-opacity-20 dark:bg-gray-50 dark:backdrop-blur-sm"
//         containerClassName="dark:bg-gray-100/90 overflow-hidden dark:backdrop-blur-xl"
//         className="z-[9999]"
//       >
//         <SearchList onClose={() => setOpen(false)} />
//       </Modal>
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Modal } from "rizzui";
import SearchTrigger from "./search-trigger";
import SearchList from "./search-list";
import { PiMagnifyingGlassBold } from "react-icons/pi";

export default function SearchWidget({
  className,
  placeholderClassName,
  icon,
}: {
  className?: string;
  icon?: React.ReactNode;
  placeholderClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const pathname = usePathname();
  useEffect(() => {
    setOpen(() => false);
    return () => setOpen(() => false);
  }, [pathname]);

  return (
    <>
      <div
        className="hidden md:flex items-center py-2 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <PiMagnifyingGlassBold className="h-[18px] w-[18px] text-white mr-2" />
        <span className="text-lg text-white/90">Search</span>
      </div>

      {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-white mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg> */}

      {/* <kbd className="ml-3 px-1.5 py-0.5 text-xs font-semibold text-white bg-white/20 rounded">
          Ctrl K
        </kbd> */}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        overlayClassName="dark:bg-opacity-20 dark:bg-gray-50 dark:backdrop-blur-sm"
        containerClassName="dark:bg-gray-100/90 overflow-hidden dark:backdrop-blur-xl"
        className="z-[9999]"
      >
        <SearchList onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}
