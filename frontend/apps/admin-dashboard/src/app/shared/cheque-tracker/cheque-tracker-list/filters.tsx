// "use client";

// import React, { useState, useEffect } from "react";
// import { Button, Flex, Input, Select } from "rizzui";
// import {
//   PiMagnifyingGlassBold,
//   PiFunnel,
//   PiTrashDuotone,
// } from "react-icons/pi";
// import FilterDrawerView from "@core/components/controlled-table/table-filter";
// import ToggleColumns from "@core/components/table-utils/toggle-columns";
// import { DatePicker } from "@core/ui/datepicker";

// interface IFilters {
//   filters: any;
//   setFilters: (arg: any) => void;
//   onApplyFilters: any;
//   table: any;
// }

// export default function ChequeTrackerFilters({
//   filters,
//   setFilters,
//   onApplyFilters,
//   table,
// }: IFilters) {
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [localFilters, setLocalFilters] = useState({ ...filters });

//   // Apply filters
//   const handleApplyFilters = () => {
//     setFilters(localFilters); // Update parent state with new filters
//     onApplyFilters(); // Trigger API fetch with updated filters
//     setOpenDrawer(false); // Close the drawer
//   };

//   // Clear filters
//   const handleClearFilters = () => {
//     const clearedFilters = {
//       globalSearch: "",
//       cheque_status: "",
//       reminder_date: null,
//       bank_name: "",
//     };
//     setLocalFilters(clearedFilters); // Reset local filters
//     setFilters(clearedFilters); // Reset parent filters
//     onApplyFilters(); // Trigger API call to reset data
//   };

//   return (
//     <Flex align="center" justify="between" className="mb-4">
//       {/* Global Search */}
//       <Input
//         type="search"
//         placeholder="Search by cheque number, bank, or payee..."
//         value={filters.globalSearch}
//         onClear={() =>
//           setFilters((prev: any) => ({ ...prev, globalSearch: "" }))
//         }
//         onChange={(e) =>
//           setFilters((prev: any) => ({
//             ...prev,
//             globalSearch: e.target.value,
//           }))
//         }
//         inputClassName="h-9"
//         clearable={true}
//         prefix={<PiMagnifyingGlassBold className="size-4" />}
//       />

//       {/* Filters Drawer */}
//       <FilterDrawerView
//         isOpen={openDrawer}
//         drawerTitle="Cheque Tracker Filters"
//         setOpenDrawer={setOpenDrawer}
//         onApplyFilters={handleApplyFilters}
//       >
//         <div className="grid grid-cols-1 gap-6">
//           {/* Reminder Date Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Filter by Reminder Date
//             </label>
//             <DatePicker
//               selected={
//                 localFilters.reminder_date
//                   ? new Date(localFilters.reminder_date)
//                   : null
//               }
//               onChange={(date: Date | null) => {
//                 setLocalFilters((prev: any) => ({
//                   ...prev,
//                   reminder_date: date ? date.toISOString().split("T")[0] : null, // Store only the date part
//                 }));
//               }}
//               placeholderText="Select reminder date"
//               dateFormat="dd-MMM-yyyy"
//               className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>

//           {/* Cheque Status Filter */}
//           <Select
//             label="Filter by Cheque Status"
//             placeholder="Select Cheque Status"
//             value={
//               localFilters.cheque_status
//                 ? {
//                     value: localFilters.cheque_status,
//                     label: localFilters.cheque_status,
//                   }
//                 : null
//             }
//             options={[
//               { value: "Issued", label: "Issued" },
//               { value: "Received", label: "Received" },
//               { value: "Cleared", label: "Cleared" },
//               { value: "Bounced", label: "Bounced" },
//             ]}
//             onChange={(option: any) =>
//               setLocalFilters((prev: any) => ({
//                 ...prev,
//                 cheque_status: option?.value || "",
//               }))
//             }
//           />

//           {/* Bank Name Filter */}
//           <Input
//             label="Filter by Bank Name"
//             placeholder="Enter bank name"
//             value={localFilters.bank_name || ""}
//             onChange={(e) =>
//               setLocalFilters((prev: any) => ({
//                 ...prev,
//                 bank_name: e.target.value,
//               }))
//             }
//           />
//         </div>
//       </FilterDrawerView>

//       {/* Action Buttons */}
//       <Flex align="center" gap="3" className="w-auto">
//         <Button
//           size="sm"
//           onClick={handleClearFilters}
//           variant="flat"
//           className="h-9 bg-gray-200/70"
//         >
//           <MdFilterAltOff className="me-1.5 h-[17px] w-[17px]" /> Clear
//         </Button>
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

"use client";

import React, { useState, useEffect } from "react";
import { Button, Flex, Input, Select } from "rizzui";
import {
  PiMagnifyingGlassBold,
  PiFunnel,
  PiTrashDuotone,
  PiPlusBold,
} from "react-icons/pi";
import { MdFilterAltOff } from "react-icons/md";
import FilterDrawerView from "@core/components/controlled-table/table-filter";
import ToggleColumns from "@core/components/table-utils/toggle-columns";
import { DatePicker } from "@core/ui/datepicker";
import Link from "next/link";
import { routesTenant } from "@/config/routes";
import FilterContainer from "../../filterContainer";

interface IFilters {
  filters: any;
  setFilters: (arg: any) => void;
  onApplyFilters: any;
  table: any;
}

export default function ChequeTrackerFilters({
  filters,
  setFilters,
  onApplyFilters,
  table,
}: IFilters) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });

  // Apply filters
  const handleApplyFilters = () => {
    setFilters(localFilters); // Update parent state with new filters
    onApplyFilters(); // Trigger API fetch with updated filters
    setOpenDrawer(false); // Close the drawer
  };

  // Clear filters
  const handleClearFilters = () => {
    const clearedFilters = {
      globalSearch: "",
      cheque_status: "",
      // reminder_date: null,
      cheque_date: null,
      bank_name: "",
    };
    setLocalFilters(clearedFilters); // Reset local filters
    setFilters(clearedFilters); // Reset parent filters
    onApplyFilters(); // Trigger API call to reset data
  };

  return (
    <FilterContainer>
      <Flex align="center" justify="between">
        {/* Global Search */}
        <div className="flex items-center gap-3">
          <Link href={routesTenant.financials.createChequeTracker}>
            <Button>
              <PiPlusBold className="me-1.5 size-[17px]" />
              Add Cheque Entry
            </Button>
          </Link>

          <Input
            type="search"
            placeholder="Search by cheque number, bank, or payee..."
            value={filters.globalSearch}
            onClear={() =>
              setFilters((prev: any) => ({ ...prev, globalSearch: "" }))
            }
            onChange={(e) =>
              setFilters((prev: any) => ({
                ...prev,
                globalSearch: e.target.value,
              }))
            }
            inputClassName="h-10"
            clearable={true}
            prefix={<PiMagnifyingGlassBold className="size-4" />}
          />
        </div>

        {/* Filters Drawer */}
        <FilterDrawerView
          isOpen={openDrawer}
          drawerTitle="Cheque Tracker Filters"
          setOpenDrawer={setOpenDrawer}
          onApplyFilters={handleApplyFilters}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Reminder Date Filter */}
            {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Filter by Reminder Date
            </label>
            <DatePicker
              selected={
                localFilters.reminder_date
                  ? new Date(localFilters.reminder_date)
                  : null
              }
              onChange={(date: Date | null) => {
                setLocalFilters((prev: any) => ({
                  ...prev,
                  reminder_date: date ? date.toISOString().split("T")[0] : null,
                }));
              }}
              placeholderText="Select reminder date"
              dateFormat="dd-MMM-yyyy"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div> */}

            {/* Cheque Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Cheque Date
              </label>
              <DatePicker
                selected={
                  localFilters.cheque_date
                    ? new Date(localFilters.cheque_date)
                    : null
                }
                onChange={(date: Date | null) => {
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    cheque_date: date ? date.toISOString().split("T")[0] : null,
                  }));
                }}
                placeholderText="Select cheque date"
                dateFormat="dd-MMM-yyyy"
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Cheque Status Filter */}
            <Select
              label="Filter by Cheque Status"
              placeholder="Select Cheque Status"
              value={
                localFilters.cheque_status
                  ? {
                      value: localFilters.cheque_status,
                      label: localFilters.cheque_status,
                    }
                  : null
              }
              options={[
                { value: "Issued", label: "Issued" },
                { value: "Received", label: "Received" },
                { value: "Cleared", label: "Cleared" },
                { value: "Bounced", label: "Bounced" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  cheque_status: option?.value || "",
                }))
              }
            />

            {/* Bank Name Filter */}
            <Input
              label="Filter by Bank Name"
              placeholder="Enter bank name"
              value={localFilters.bank_name || ""}
              onChange={(e) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  bank_name: e.target.value,
                }))
              }
            />
          </div>
        </FilterDrawerView>

        {/* Action Buttons */}
        <Flex align="center" gap="3" className="w-auto">
          <Button
            size="sm"
            onClick={handleClearFilters}
            variant="flat"
            className="h-9 bg-gray-200/70"
          >
            <MdFilterAltOff className="me-1.5 h-[17px] w-[17px]" /> Clear
          </Button>
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
    </FilterContainer>
  );
}
