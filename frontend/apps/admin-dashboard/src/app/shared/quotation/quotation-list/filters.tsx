"use client";

import React, { useState, useEffect } from "react";
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
import customerService from "@/services/customerService";
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

export default function QuotationFilters({
  filters,
  setFilters,
  onApplyFilters,
  table,
}: IFilters) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });
  const [customersOption, setCustomersOption] = useState([]);

  // Fetch customers when drawer opens
  useEffect(() => {
    if (openDrawer && customersOption.length === 0) {
      const fetchCustomers = async () => {
        try {
          const response = await customerService.getList();
          const options = response.data.map((customer: any) => ({
            value: customer._id,
            label: customer.full_name,
          }));
          setCustomersOption(options);
        } catch (error) {
          console.error("Error fetching customer data:", error);
        }
      };
      fetchCustomers();
    }
  }, [openDrawer, customersOption.length]);

  // Apply filters
  const handleApplyFilters = () => {
    setFilters(localFilters);
    onApplyFilters(); // Fetch updated quotations
    setOpenDrawer(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {
      globalSearch: "",
      status: "",
      customer_id: "",
      date_from: "",
      date_to: "",
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    onApplyFilters();
  };

  return (
    <FilterContainer>
      <Flex align="center" justify="between">
        <div className="flex items-center gap-3">
          <Link href={routesTenant.salesManagement.createQuotation}>
            <Button>
              <PiPlusBold className="me-1.5 size-[17px]" />
              Add Quotation
            </Button>
          </Link>
          {/* Global Search */}
          <Input
            type="search"
            placeholder="Search by proposal number or title..."
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
          drawerTitle="Quotation Filters"
          setOpenDrawer={setOpenDrawer}
          onApplyFilters={handleApplyFilters}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Status Filter */}
            <Select
              label="Filter by Status"
              placeholder="Select Quotation Status"
              value={
                localFilters.status
                  ? { value: localFilters.status, label: localFilters.status }
                  : null
              }
              options={[
                { value: "Draft", label: "Draft" },
                { value: "Sent", label: "Sent" },
                { value: "Accepted", label: "Accepted" },
                { value: "Rejected", label: "Rejected" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  status: option?.value || "",
                }))
              }
            />

            {/* Customer Filter */}
            <Select
              label="Filter by Customer"
              placeholder="Select Customer"
              options={customersOption}
              searchable
              value={
                customersOption.find(
                  (option: any) => option.value === localFilters.customer_id
                ) || null
              }
              onChange={(selected: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  customer_id: selected?.value || "",
                }))
              }
            />

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Proposal Date (From - To)
              </label>
              <div className="flex space-x-2">
                <DatePicker
                  selected={
                    localFilters.date_from
                      ? new Date(localFilters.date_from)
                      : null
                  }
                  onChange={(date: Date | null) => {
                    setLocalFilters((prev: any) => ({
                      ...prev,
                      date_from: date ? date.toISOString().split("T")[0] : null,
                    }));
                  }}
                  placeholderText="Start Date"
                  dateFormat="dd-MMM-yyyy"
                  className="w-full border-gray-300 rounded-md shadow-sm"
                />
                <DatePicker
                  selected={
                    localFilters.date_to ? new Date(localFilters.date_to) : null
                  }
                  onChange={(date: Date | null) => {
                    setLocalFilters((prev: any) => ({
                      ...prev,
                      date_to: date ? date.toISOString().split("T")[0] : null,
                    }));
                  }}
                  placeholderText="End Date"
                  dateFormat="dd-MMM-yyyy"
                  className="w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
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
