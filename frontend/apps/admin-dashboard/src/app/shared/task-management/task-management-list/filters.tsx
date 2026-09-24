// "use client";

// import React, { useState } from "react";
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

// export default function TaskFilters({
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
//       assignedTo: "",
//       priority: "",
//       status: "",
//       dueDate: null,
//       createdBy: "",
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
//         placeholder="Search by task title or description..."
//         value={filters.globalSearch}
//         onClear={() =>
//           setFilters((prev: any) => ({ ...prev, globalSearch: "" }))
//         }
//         onChange={(e) =>
//           setFilters((prev: any) => ({ ...prev, globalSearch: e.target.value }))
//         }
//         inputClassName="h-9"
//         clearable={true}
//         prefix={<PiMagnifyingGlassBold className="size-4" />}
//       />

//       {/* Filters Drawer */}
//       <FilterDrawerView
//         isOpen={openDrawer}
//         drawerTitle="Task Filters"
//         setOpenDrawer={setOpenDrawer}
//         onApplyFilters={handleApplyFilters}
//       >
//         <div className="grid grid-cols-1 gap-6">
//           {/* Due Date Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Filter by Due Date
//             </label>
//             <DatePicker
//               selected={
//                 localFilters.dueDate ? new Date(localFilters.dueDate) : null
//               }
//               onChange={(date: Date | null) => {
//                 setLocalFilters((prev: any) => ({
//                   ...prev,
//                   dueDate: date ? date.toISOString().split("T")[0] : null, // Store only the date part
//                 }));
//               }}
//               placeholderText="Select due date"
//               dateFormat="dd-MMM-yyyy"
//               className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>

//           {/* Assigned To Filter */}
//           <Input
//             label="Filter by Assigned To"
//             placeholder="Enter Assigned Employee"
//             value={localFilters.assignedTo}
//             onChange={(e) =>
//               setLocalFilters((prev: any) => ({
//                 ...prev,
//                 assignedTo: e.target.value,
//               }))
//             }
//           />

//           {/* Priority Filter */}
//           <Select
//             label="Filter by Priority"
//             placeholder="Select Priority"
//             value={
//               localFilters.priority
//                 ? {
//                     value: localFilters.priority,
//                     label: localFilters.priority,
//                   }
//                 : null
//             }
//             options={[
//               { value: "High", label: "High" },
//               { value: "Medium", label: "Medium" },
//               { value: "Low", label: "Low" },
//             ]}
//             onChange={(option: any) =>
//               setLocalFilters((prev: any) => ({
//                 ...prev,
//                 priority: option?.value || "",
//               }))
//             }
//           />

//           {/* Status Filter */}
//           <Select
//             label="Filter by Status"
//             placeholder="Select Status"
//             value={
//               localFilters.status
//                 ? {
//                     value: localFilters.status,
//                     label: localFilters.status,
//                   }
//                 : null
//             }
//             options={[
//               { value: "Pending", label: "Pending" },
//               { value: "In Progress", label: "In Progress" },
//               { value: "Completed", label: "Completed" },
//             ]}
//             onChange={(option: any) =>
//               setLocalFilters((prev: any) => ({
//                 ...prev,
//                 status: option?.value || "",
//               }))
//             }
//           />

//           {/* Created By Filter */}
//           <Input
//             label="Filter by Created By"
//             placeholder="Enter Creator Name"
//             value={localFilters.createdBy}
//             onChange={(e) =>
//               setLocalFilters((prev: any) => ({
//                 ...prev,
//                 createdBy: e.target.value,
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
import employeeService from "@/services/employeeService";
import Link from "next/link";
import { routesTenant } from "@/config/routes";
import FilterContainer from "../../filterContainer";

interface IFilters {
  filters: any;
  setFilters: (arg: any) => void;
  onApplyFilters: any;
  table: any;
}

export default function TaskFilters({
  filters,
  setFilters,
  onApplyFilters,
  table,
}: IFilters) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });
  const [employeeOptions, setEmployeeOptions] = useState([]);

  // Fetch employee options when drawer is opened
  useEffect(() => {
    if (openDrawer && employeeOptions.length === 0) {
      const fetchEmployees = async () => {
        try {
          const response = await employeeService.getList();
          const options = response.data.map((employee: any) => ({
            value: employee._id,
            label: employee.full_name,
          }));
          setEmployeeOptions(options);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      };
      fetchEmployees();
    }
  }, [openDrawer, employeeOptions.length]);

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
      assignedTo: "",
      priority: "",
      status: "",
      dueDate: null,
      createdBy: "",
    };
    setLocalFilters(clearedFilters); // Reset local filters
    setFilters(clearedFilters); // Reset parent filters
    onApplyFilters(); // Trigger API call to reset data
  };

  return (
    <FilterContainer>
      <Flex align="center" justify="between">
        {/* Global Search */}

        <div className="flex gap-4">
          <Link href={routesTenant.employees.createTaskManagementRecord}>
            <Button>
              <PiPlusBold className="me-1.5 size-[17px]" />
              Add Task
            </Button>
          </Link>
          <Input
            type="search"
            placeholder="Search by task title or description..."
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
          drawerTitle="Task Filters"
          setOpenDrawer={setOpenDrawer}
          onApplyFilters={handleApplyFilters}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Due Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Due Date
              </label>
              <DatePicker
                selected={
                  localFilters.dueDate ? new Date(localFilters.dueDate) : null
                }
                onChange={(date: Date | null) => {
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    dueDate: date ? date.toISOString().split("T")[0] : null, // Store only the date part
                  }));
                }}
                placeholderText="Select due date"
                dateFormat="dd-MMM-yyyy"
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Assigned To Filter */}
            <Select
              label="Filter by Assigned To"
              placeholder="Select Assigned Employee"
              options={employeeOptions}
              searchable
              value={
                employeeOptions.find(
                  (option: any) => option.value === localFilters.assignedTo
                ) || null
              }
              onChange={(selected: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  assignedTo: selected?.value || "",
                }))
              }
            />

            {/* Priority Filter */}
            <Select
              label="Filter by Priority"
              placeholder="Select Priority"
              value={
                localFilters.priority
                  ? {
                      value: localFilters.priority,
                      label: localFilters.priority,
                    }
                  : null
              }
              options={[
                { value: "High", label: "High" },
                { value: "Medium", label: "Medium" },
                { value: "Low", label: "Low" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  priority: option?.value || "",
                }))
              }
            />

            {/* Status Filter */}
            <Select
              label="Filter by Status"
              placeholder="Select Status"
              value={
                localFilters.status
                  ? {
                      value: localFilters.status,
                      label: localFilters.status,
                    }
                  : null
              }
              options={[
                { value: "Pending", label: "Pending" },
                { value: "In Progress", label: "In Progress" },
                { value: "Completed", label: "Completed" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  status: option?.value || "",
                }))
              }
            />

            {/* Created By Filter */}
            {/* <Select
            label="Filter by Created By"
            placeholder="Select Creator"
            options={employeeOptions}
            searchable
            value={
              employeeOptions.find(
                (option: any) => option.value === localFilters.createdBy
              ) || null
            }
            onChange={(selected: any) =>
              setLocalFilters((prev: any) => ({
                ...prev,
                createdBy: selected?.value || "",
              }))
            }
          /> */}
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
