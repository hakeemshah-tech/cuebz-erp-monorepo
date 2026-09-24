"use client";

import React, { useState, useEffect } from "react";
import { Button, Flex, Input, Select } from "rizzui";
import { PiMagnifyingGlassBold, PiFunnel, PiPlusBold } from "react-icons/pi";
import { MdFilterAltOff } from "react-icons/md";
import FilterDrawerView from "@core/components/controlled-table/table-filter";
import ToggleColumns from "@core/components/table-utils/toggle-columns";
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

export default function VendorFilters({
  filters,
  setFilters,
  onApplyFilters,
  table,
}: IFilters) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });
  const [employeeOptions, setEmployeeOptions] = useState([]);

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

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onApplyFilters();
    setOpenDrawer(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      globalSearch: "",
      vendorType: "",
      assignedTo: "",
      country: "",
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    onApplyFilters();
  };

  return (
    <FilterContainer>
      <Flex align="center" justify="between">
        {/* Search and Add */}
        <div className="flex gap-2">
          <Link href={routesTenant.sales.createVendor}>
            <Button>
              Add Vendor
              <PiPlusBold className="ml-2 size-[17px]" />
            </Button>
          </Link>
          <Input
            type="search"
            placeholder="Search by vendor name or contact person..."
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

        {/* Drawer for Filters */}
        <FilterDrawerView
          isOpen={openDrawer}
          drawerTitle="Vendor Filters"
          setOpenDrawer={setOpenDrawer}
          onApplyFilters={handleApplyFilters}
        >
          <div className="grid grid-cols-1 gap-6">
            <Select
              label="Filter by Vendor Type"
              placeholder="Select Vendor Type"
              value={
                localFilters.vendorType
                  ? {
                      value: localFilters.vendorType,
                      label: localFilters.vendorType,
                    }
                  : null
              }
              options={[
                { value: "Supplier", label: "Supplier" },
                { value: "Manufacturer", label: "Manufacturer" },
                { value: "Distributor", label: "Distributor" },
                { value: "Service Provider", label: "Service Provider" },
                { value: "Other", label: "Other" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  vendorType: option?.value || "",
                }))
              }
            />

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

            <Input
              label="Filter by Country"
              placeholder="Enter country name"
              value={localFilters.country}
              onChange={(e) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
            />
          </div>
        </FilterDrawerView>

        {/* Actions */}
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
