// "use client";

// import DateFiled from "@core/components/controlled-table/date-field";
// import PriceField from "@core/components/controlled-table/price-field";
// import ToggleColumns from "@core/components/table-utils/toggle-columns";
// import {
//   PiFunnel,
//   PiMagnifyingGlassBold,
//   PiTrashDuotone,
// } from "react-icons/pi";
// import { FilterDrawerView } from "@core/components/controlled-table/table-filter";
// import { Button, Flex, Input } from "rizzui";
// import { type Table as ReactTableType } from "@tanstack/react-table";
// import { useState } from "react";

// interface FiltersProps<TData extends Record<string, any>> {
//   table: ReactTableType<TData>;
// }

// export default function Filters<TData extends Record<string, any>>({
//   table,
// }: FiltersProps<TData>) {
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const isMultipleSelected = table.getSelectedRowModel().rows.length > 1;

//   // Determine if filters are applied
//   const isFiltered =
//     table.getState().globalFilter || table.getState().columnFilters.length > 0;

//   // Clear filters handler
//   const handleClearFilters = () => {
//     table.resetGlobalFilter();
//     table.resetColumnFilters();
//   };

//   return (
//     <Flex align="center" justify="between" className="mb-4">
//       {/* Search Input */}
//       <Input
//         type="search"
//         placeholder="Search by subscription plan name..."
//         value={table.getState().globalFilter ?? ""}
//         onClear={() => table.setGlobalFilter("")}
//         onChange={(e) => table.setGlobalFilter(e.target.value)}
//         inputClassName="h-9"
//         clearable={true}
//         prefix={<PiMagnifyingGlassBold className="size-4" />}
//       />

//       {/* Filter Drawer */}
//       <FilterDrawerView
//         isOpen={openDrawer}
//         drawerTitle="Table Filters"
//         setOpenDrawer={setOpenDrawer}
//       >
//         <div className="grid grid-cols-1 gap-6">
//           <FilterElements
//             table={table}
//             isFiltered={!!isFiltered}
//             handleClearFilters={handleClearFilters}
//           />
//         </div>
//       </FilterDrawerView>

//       {/* Action Buttons */}
//       <Flex align="center" gap="3" className="w-auto">
//         {isMultipleSelected && (
//           <Button
//             color="danger"
//             variant="outline"
//             className="h-[34px] gap-2 text-sm"
//             onClick={() =>
//               table.options.meta?.handleMultipleDelete &&
//               table.options.meta.handleMultipleDelete(
//                 table.getSelectedRowModel().rows.map((r) => r.original.id)
//               )
//             }
//           >
//             <PiTrashDuotone size={18} />
//             Delete
//           </Button>
//         )}
//         <Button
//           variant="outline"
//           onClick={() => setOpenDrawer(!openDrawer)}
//           className="h-9 pe-3 ps-2.5"
//         >
//           <PiFunnel className="me-1.5 size-[18px]" strokeWidth={1.7} />
//           Filters
//         </Button>
//         <ToggleColumns table={table} />
//       </Flex>
//     </Flex>
//   );
// }

// function FilterElements<TData extends Record<string, any>>({
//   table,
//   isFiltered,
//   handleClearFilters,
// }: FiltersProps<TData> & {
//   isFiltered: boolean;
//   handleClearFilters: () => void;
// }) {
//   // Retrieve filters from the table state
//   const priceFilterValue = (table
//     .getColumn("price")
//     ?.getFilterValue() as string[]) ?? ["", ""];
//   const createdDateFilter = (table.getColumn("createdAt")?.getFilterValue() as [
//     Date | null,
//     Date | null,
//   ]) ?? [null, null];

//   return (
//     <>
//       {/* Price Range Filter */}
//       <PriceField
//         value={priceFilterValue}
//         onChange={(value) => table.getColumn("price")?.setFilterValue(value)}
//         label="Price Range (AED)"
//       />

//       {/* Created Date Filter */}
//       <DateFiled
//         selectsRange
//         dateFormat={"dd-MMM-yyyy"}
//         className="w-full"
//         placeholderText="Select created date"
//         endDate={createdDateFilter[1]}
//         selected={createdDateFilter[0]}
//         startDate={createdDateFilter[0]}
//         onChange={(date) => table.getColumn("createdAt")?.setFilterValue(date)}
//         inputProps={{
//           label: "Created Date",
//         }}
//       />

//       {/* Clear Filters Button */}
//       {isFiltered && (
//         <Button
//           size="sm"
//           onClick={handleClearFilters}
//           variant="flat"
//           className="h-9 bg-gray-200/70"
//         >
//           <MdFilterAltOff className="me-1.5 h-[17px] w-[17px]" /> Clear
//         </Button>
//       )}
//     </>
//   );
// }

"use client";

import DateFiled from "@core/components/controlled-table/date-field";
import PriceField from "@core/components/controlled-table/price-field";
import ToggleColumns from "@core/components/table-utils/toggle-columns";
import {
  PiFunnel,
  PiMagnifyingGlassBold,
  PiTrashDuotone,
} from "react-icons/pi";
import FilterDrawerView from "@core/components/controlled-table/table-filter";
import { Button, Flex, Input } from "rizzui";
import { type Table as ReactTableType } from "@tanstack/react-table";
import { useState } from "react";
import { MdFilterAltOff } from "react-icons/md";

// Extend TableMeta to include handleMultipleDelete
declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    handleMultipleDelete?: (ids: string[]) => void;
  }
}

interface FiltersProps<TData extends Record<string, any>> {
  table: ReactTableType<TData>;
}

export default function Filters<TData extends Record<string, any>>({
  table,
}: FiltersProps<TData>) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMultipleSelected = table.getSelectedRowModel().rows.length > 1;

  // Determine if filters are applied
  const isFiltered =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;

  // Clear filters handler
  const handleClearFilters = () => {
    table.resetGlobalFilter();
    table.resetColumnFilters();
  };

  return (
    <Flex align="center" justify="between" className="mb-4">
      {/* Search Input */}
      <Input
        type="search"
        placeholder="Search by subscription plan name..."
        value={table.getState().globalFilter ?? ""}
        onClear={() => table.setGlobalFilter("")}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        inputClassName="h-9"
        clearable={true}
        prefix={<PiMagnifyingGlassBold className="size-4" />}
      />

      {/* Filter Drawer */}
      <FilterDrawerView
        isOpen={openDrawer}
        drawerTitle="Table Filters"
        setOpenDrawer={setOpenDrawer}
      >
        <div className="grid grid-cols-1 gap-6">
          <FilterElements
            table={table}
            isFiltered={!!isFiltered}
            handleClearFilters={handleClearFilters}
          />
        </div>
      </FilterDrawerView>

      {/* Action Buttons */}
      <Flex align="center" gap="3" className="w-auto">
        {isMultipleSelected && (
          <Button
            color="danger"
            variant="outline"
            className="h-[34px] gap-2 text-sm"
            onClick={() =>
              table.options.meta?.handleMultipleDelete?.(
                table.getSelectedRowModel().rows.map((r) => r.original.id)
              )
            }
          >
            <PiTrashDuotone size={18} />
            Delete
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => setOpenDrawer(!openDrawer)}
          className="h-9 pe-3 ps-2.5"
        >
          <PiFunnel className="me-1.5 size-[18px]" strokeWidth={1.7} />
          Filters
        </Button>
        <ToggleColumns table={table} />
      </Flex>
    </Flex>
  );
}

function FilterElements<TData extends Record<string, any>>({
  table,
  isFiltered,
  handleClearFilters,
}: FiltersProps<TData> & {
  isFiltered: boolean;
  handleClearFilters: () => void;
}) {
  // Retrieve filters from the table state
  const priceFilterValue = (table
    .getColumn("price")
    ?.getFilterValue() as string[]) ?? ["", ""];
  const createdDateFilter = (table.getColumn("createdAt")?.getFilterValue() as [
    Date | null,
    Date | null,
  ]) ?? [null, null];

  return (
    <>
      {/* Price Range Filter */}
      <PriceField
        value={priceFilterValue}
        onChange={(value) => table.getColumn("price")?.setFilterValue(value)}
        label="Price Range (AED)"
      />

      {/* Created Date Filter */}
      <DateFiled
        selectsRange
        dateFormat={"dd-MMM-yyyy"}
        className="w-full"
        placeholderText="Select created date"
        endDate={createdDateFilter[1] || undefined}
        selected={createdDateFilter[0] || undefined}
        startDate={createdDateFilter[0] || undefined}
        onChange={(date) => table.getColumn("createdAt")?.setFilterValue(date)}
        inputProps={{
          label: "Created Date",
        }}
      />

      {/* Clear Filters Button */}
      {isFiltered && (
        <Button
          size="sm"
          onClick={handleClearFilters}
          variant="flat"
          className="h-9 bg-gray-200/70"
        >
          <MdFilterAltOff className="me-1.5 h-[17px] w-[17px]" /> Clear
        </Button>
      )}
    </>
  );
}
