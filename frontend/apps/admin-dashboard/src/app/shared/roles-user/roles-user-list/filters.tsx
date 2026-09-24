"use client";

import { useState } from "react";
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

export default function RolesUserFilters({
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
      role: "",
      status: "",
      tenant: "",
      createdAt: "",
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
          <Link href={routesTenant.rolesUser.createRoleUser}>
            <Button>
              <PiPlusBold className="me-1.5 size-[17px]" />
              Add User Role
            </Button>
          </Link>
          <Input
            type="search"
            placeholder="Search by user name or email..."
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
          drawerTitle="Roles User Filters"
          setOpenDrawer={setOpenDrawer}
          onApplyFilters={handleApplyFilters}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Role Filter */}
            <Select
              label="Filter by Role"
              placeholder="Select Role"
              value={
                localFilters.role
                  ? {
                      value: localFilters.role,
                      label: localFilters.role,
                    }
                  : null
              }
              options={[
                { value: "super-admin", label: "Super Admin" },
                { value: "super-admin-user", label: "Super Admin User" },
                { value: "tenant-owner", label: "Tenant Owner" },
                { value: "tenant-user", label: "Tenant User" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  role: option?.value || "",
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
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  status: option?.value || "",
                }))
              }
            />

            {/* Tenant Filter */}
            <Input
              label="Filter by Tenant"
              placeholder="Enter Tenant Name"
              value={localFilters.tenant}
              onChange={(e) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  tenant: e.target.value,
                }))
              }
            />

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Created Date
              </label>
              <DatePicker
                selected={
                  localFilters.createdAt
                    ? new Date(localFilters.createdAt)
                    : null
                }
                onChange={(date: Date | null) => {
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    createdAt: date ? date.toISOString().split("T")[0] : null, // Store only the date part
                  }));
                }}
                placeholderText="Select date"
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
