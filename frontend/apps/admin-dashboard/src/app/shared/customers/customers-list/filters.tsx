"use client";

import { useState } from "react";
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

export default function CustomerFilters({
  filters,
  setFilters,
  onApplyFilters,
  table,
}: IFilters) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });

  // Apply filters
  const handleApplyFilters = () => {
    setFilters(localFilters); // Update the parent state with new filters
    onApplyFilters(); // Trigger API fetch with updated filters
    setOpenDrawer(false); // Close the drawer
  };

  // Clear filters
  const handleClearFilters = () => {
    const clearedFilters = {
      globalSearch: "",
      customerType: "",
      assignedTo: "",
      dateOfBirth: "",
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
          <Link href={routesTenant.sales.createCustomer}>
            <Button>
              <PiPlusBold className="me-1.5 size-[17px]" />
              Add Customer
            </Button>
          </Link>
          <Input
            type="search"
            placeholder="Search by full name or email..."
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
          drawerTitle="Customer Filters"
          setOpenDrawer={setOpenDrawer}
          onApplyFilters={handleApplyFilters}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Customer Type Filter */}
            <Select
              label="Filter by Customer Type"
              placeholder="Select Customer Type"
              value={
                localFilters.customerType
                  ? {
                      value: localFilters.customerType,
                      label: localFilters.customerType,
                    }
                  : null
              }
              options={[
                { value: "Individual", label: "Individual" },
                { value: "Business", label: "Business" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  customerType: option?.value || "",
                }))
              }
            />

            {/* Assigned To Filter */}
            <Input
              label="Filter by Assigned To"
              placeholder="Enter assigned employee's name"
              value={localFilters.assignedTo || ""}
              onChange={(e) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  assignedTo: e.target.value,
                }))
              }
            />

            {/* Date of Birth Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Date of Birth
              </label>
              <DatePicker
                selected={
                  localFilters.dateOfBirth
                    ? new Date(localFilters.dateOfBirth)
                    : null
                }
                onChange={(date: Date | null) => {
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    dateOfBirth: date ? date.toISOString().split("T")[0] : null, // Store only the date part
                  }));
                }}
                placeholderText="Select date of birth"
                dateFormat="dd-MMM-yyyy"
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
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
