"use client";

import { useState } from "react";
import { Button, Flex, Input, Select } from "rizzui";
import { PiMagnifyingGlassBold, PiFunnel, PiPlusBold } from "react-icons/pi";
import { MdFilterAltOff } from "react-icons/md";
import Link from "next/link";
import FilterDrawerView from "@core/components/controlled-table/table-filter";
import ToggleColumns from "@core/components/table-utils/toggle-columns";
import { DatePicker } from "@core/ui/datepicker";
import FilterContainer from "../../filterContainer";

interface IFilters {
  filters: any;
  setFilters: (arg: any) => void;
  onApplyFilters: any;
  table: any;
}

export default function AssetFilters({
  filters,
  setFilters,
  onApplyFilters,
  table,
}: IFilters) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });

  // Apply filters
  const handleApplyFilters = () => {
    setFilters(localFilters);
    onApplyFilters();
    setOpenDrawer(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    const cleared = {
      globalSearch: "",
      category: "",
      status: "",
      purchaseDate: "",
      warrantyExpiry: "",
    };
    setLocalFilters(cleared);
    setFilters(cleared);
    onApplyFilters();
  };

  return (
    <FilterContainer>
      <Flex align="center" justify="between">
        {/* ➕ Add + Search */}
        <div className="flex gap-2">
          <Link href="/tenant/company/assets/create">
            <Button>
              Add Asset
              <PiPlusBold className="ml-2 size-[17px]" />
            </Button>
          </Link>
          <Input
            type="search"
            placeholder="Search assets..."
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
            inputClassName="h-10 border border-[#657079] placeholder-[#657079] text-[#657079]"
            clearable={true}
            prefix={<PiMagnifyingGlassBold className="size-4 text-[#657079]" />}
          />
        </div>

        {/* 🧰 Filters Drawer */}
        <FilterDrawerView
          isOpen={openDrawer}
          drawerTitle="Filter Assets"
          setOpenDrawer={setOpenDrawer}
          onApplyFilters={handleApplyFilters}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* 📦 Category */}
            <Select
              label="Filter by Asset Type"
              placeholder="Select Asset Type"
              value={
                localFilters.category
                  ? {
                      value: localFilters.category,
                      label: localFilters.category,
                    }
                  : null
              }
              options={[
                { value: "Laptop", label: "Laptop" },
                { value: "Printer", label: "Printer" },
                { value: "Smart TV", label: "Smart TV" },
                { value: "Monitor", label: "Monitor" },
                { value: "Other", label: "Other" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  category: option?.value || "",
                }))
              }
            />

            {/* 🧾 Status */}
            <Select
              label="Filter by Status"
              placeholder="Select Status"
              value={
                localFilters.status
                  ? { value: localFilters.status, label: localFilters.status }
                  : null
              }
              options={[
                { value: "In Use", label: "In Use" },
                { value: "In Storage", label: "In Storage" },
                { value: "Under Maintenance", label: "Under Maintenance" },
                { value: "Retired", label: "Retired" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  status: option?.value || "",
                }))
              }
            />

            {/* 📅 Purchase Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Purchase Date
              </label>
              <DatePicker
                selected={
                  localFilters.purchaseDate
                    ? new Date(localFilters.purchaseDate)
                    : null
                }
                onChange={(date: Date | null) => {
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    purchaseDate: date
                      ? date.toISOString().split("T")[0]
                      : null,
                  }));
                }}
                placeholderText="Select date"
                dateFormat="dd-MMM-yyyy"
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* ⏳ Warranty Expiry */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Warranty Expiry Date
              </label>
              <DatePicker
                selected={
                  localFilters.warrantyExpiry
                    ? new Date(localFilters.warrantyExpiry)
                    : null
                }
                onChange={(date: Date | null) => {
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    warrantyExpiry: date
                      ? date.toISOString().split("T")[0]
                      : null,
                  }));
                }}
                placeholderText="Select date"
                dateFormat="dd-MMM-yyyy"
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </FilterDrawerView>

        {/* 🔘 Action Buttons */}
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
