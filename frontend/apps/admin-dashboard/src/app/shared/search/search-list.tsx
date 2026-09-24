"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ActionIcon,
  Empty,
  SearchNotFoundIcon,
  Button,
  Title,
  Input,
  cn,
} from "rizzui";
import {
  PiFileTextDuotone,
  PiMagnifyingGlassBold,
  PiXBold,
} from "react-icons/pi";
import { pageLinks } from "./page-links.data";

export default function SearchList({ onClose }: { onClose?: () => void }) {
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState("");

  let menuItemsFiltered = pageLinks;
  if (searchText.length > 0) {
    menuItemsFiltered = pageLinks.filter((item: any) => {
      const label = item.name;
      return (
        label.match(searchText.toLowerCase()) ||
        (label.toLowerCase().match(searchText.toLowerCase()) && label)
      );
    });
  }

  useEffect(() => {
    if (inputRef?.current) {
      // @ts-ignore
      inputRef.current.focus();
    }
    return () => {
      inputRef.current = null;
    };
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-[#2A0A8F] to-[#151062] px-5 py-4">
        <div className="relative w-full">
          <Input
            variant="flat"
            value={searchText}
            ref={inputRef}
            onChange={(e) => setSearchText(() => e.target.value)}
            placeholder="Search"
            className="w-full text-white placeholder:text-white/60 bg-transparent border-none focus:ring-0"
            inputClassName="text-white placeholder:text-white/60"
            prefix={
              <PiMagnifyingGlassBold className="h-[18px] w-[18px] text-white" />
            }
            suffix={
              searchText && (
                <Button
                  size="sm"
                  variant="text"
                  className="h-auto w-auto px-0 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchText(() => "");
                  }}
                >
                  Clear
                </Button>
              )
            }
          />
          <ActionIcon
            size="sm"
            variant="text"
            className="absolute right-[-40px] top-1 text-white hover:text-gray-200"
            onClick={onClose}
          >
            <PiXBold className="h-5 w-5" />
          </ActionIcon>
        </div>
      </div>

      <div className="custom-scrollbar max-h-[60vh] overflow-y-auto border-t border-gray-300 px-2 py-4">
        <>
          {menuItemsFiltered.length === 0 ? (
            <Empty
              className="scale-75"
              image={<SearchNotFoundIcon />}
              text="No Result Found"
              textClassName="text-xl"
            />
          ) : (
            <Title
              as="h6"
              className="mb-5 px-3 font-semibold dark:text-gray-700"
            >
              Quick Page Links
            </Title>
          )}
        </>

        {menuItemsFiltered.map((item: any, index) => {
          return (
            <Fragment key={item.name + "-" + index}>
              {item?.href ? (
                <Link
                  href={item?.href as string}
                  className="relative my-0.5 flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus-visible:bg-gray-100 dark:hover:bg-gray-50/50 dark:hover:backdrop-blur-lg"
                >
                  <span className="inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-500">
                    <PiFileTextDuotone className="h-5 w-5" />
                  </span>

                  <span className="ms-3 grid gap-0.5">
                    <span className="font-medium capitalize text-gray-900 dark:text-gray-700">
                      {item.name}
                    </span>
                    <span className="text-gray-500">
                      {item?.href as string}
                    </span>
                  </span>
                </Link>
              ) : (
                <Title
                  as="h6"
                  className={cn(
                    "mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-500",
                    index !== 0 && "mt-6 4xl:mt-7"
                  )}
                >
                  {item.name}
                </Title>
              )}
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
