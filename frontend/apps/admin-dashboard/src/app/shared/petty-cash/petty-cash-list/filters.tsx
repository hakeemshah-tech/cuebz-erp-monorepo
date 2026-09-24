"use client";

import React, { useState } from "react";
import { Button, Flex, Input, Select } from "rizzui";
import {
  PiMagnifyingGlassBold,
  PiFunnel,
  PiTrashDuotone,
  PiPlusBold,
} from "react-icons/pi";
import FilterDrawerView from "@core/components/controlled-table/table-filter";
import ToggleColumns from "@core/components/table-utils/toggle-columns";
import { DatePicker } from "@core/ui/datepicker";
import FilterContainer from "../../filterContainer";
import { MdFilterAltOff } from "react-icons/md";
import Link from "next/link";
import { routesTenant } from "@/config/routes";

interface IFilters {
  filters: any;
  setFilters: (arg: any) => void;
  onApplyFilters: any;
  table: any;
}

export default function PettyCashFilters({
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
      transaction_type: "",
      transaction_date: null,
      purpose: "",
    };
    setLocalFilters(clearedFilters); // Reset local filters
    setFilters(clearedFilters); // Reset parent filters
    onApplyFilters(); // Trigger API call to reset data
  };

  return (
    <FilterContainer>
      <Flex align="center" justify="between">
        <div className="flex items-center gap-3">
          <Link href={routesTenant.financials.createPettyCash}>
            <Button>
              <PiPlusBold className="me-1.5 size-[17px]" />
              Add Petty Cash Entry
            </Button>
          </Link>

          {/* Global Search */}
          <Input
            type="search"
            placeholder="Search by purpose or remarks..."
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
          drawerTitle="Petty Cash Filters"
          setOpenDrawer={setOpenDrawer}
          onApplyFilters={handleApplyFilters}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Transaction Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Transaction Date
              </label>
              <DatePicker
                selected={
                  localFilters.transaction_date
                    ? new Date(localFilters.transaction_date)
                    : null
                }
                onChange={(date: Date | null) => {
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    transaction_date: date
                      ? date.toISOString().split("T")[0]
                      : null,
                  }));
                }}
                placeholderText="Select transaction date"
                dateFormat="dd-MMM-yyyy"
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Transaction Type Filter */}
            <Select
              label="Filter by Transaction Type"
              placeholder="Select Transaction Type"
              value={
                localFilters.transaction_type
                  ? {
                      value: localFilters.transaction_type,
                      label: localFilters.transaction_type,
                    }
                  : null
              }
              options={[
                { value: "Add", label: "Add" },
                { value: "Expense", label: "Expense" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  transaction_type: option?.value || "",
                }))
              }
            />

            {/* Purpose Filter */}
            <Input
              label="Filter by Purpose"
              placeholder="Enter purpose"
              value={localFilters.purpose || ""}
              onChange={(e) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  purpose: e.target.value,
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
