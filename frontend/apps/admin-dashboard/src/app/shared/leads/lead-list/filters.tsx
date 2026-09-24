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

export default function LeadFilters({
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
      leadStatus: "",
      leadSource: "",
      assignedTo: "",
      dateCreated: "",
    };
    setLocalFilters(clearedFilters); // Reset local filters
    setFilters(clearedFilters); // Reset parent filters
    onApplyFilters(); // Trigger API call to reset data
  };

  return (
    <FilterContainer>
      <Flex align="center" justify="between">
        <div className="flex items-center gap-3">
          <Link href={routesTenant.salesManagement.createLead}>
            <Button>
              <PiPlusBold className="me-1.5 size-[17px]" />
              Add Lead
            </Button>
          </Link>

          {/* Global Search */}
          <Input
            type="search"
            placeholder="Search by lead name, contact person..."
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
          drawerTitle="Table Filters"
          setOpenDrawer={setOpenDrawer}
          onApplyFilters={handleApplyFilters}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Lead Source Filter */}
            {/* <Select
            label="Filter by Lead Source"
            placeholder="Select Lead Source"
            value={
              localFilters.leadSource
                ? {
                    value: localFilters.leadSource,
                    label: localFilters.leadSource,
                  }
                : null
            }
            options={[
              { value: "Website", label: "Website" },
              { value: "Referral", label: "Referral" },
              { value: "Phone Inquiry", label: "Phone Inquiry" },
              { value: "Event", label: "Event" },
            ]}
            onChange={(option: any) =>
              setLocalFilters((prev: any) => ({
                ...prev,
                leadSource: option?.value || "",
              }))
            }
          /> */}

            <Select
              label="Filter by Lead Source"
              placeholder="Select Lead Source"
              value={
                localFilters.leadSource
                  ? {
                      value: localFilters.leadSource,
                      label: localFilters.leadSource,
                    }
                  : null
              }
              options={[
                { value: "Website Inquiry", label: "Website Inquiry" },
                { value: "Referral", label: "Referral" },
                { value: "Social Media", label: "Social Media" },
                { value: "Cold Call", label: "Cold Call" },
                { value: "Email Campaign", label: "Email Campaign" },
                {
                  value: "Trade Show/Exhibition",
                  label: "Trade Show/Exhibition",
                },
                { value: "Networking Event", label: "Networking Event" },
                {
                  value: "Google Ads/Search Ads",
                  label: "Google Ads/Search Ads",
                },
                { value: "Content Marketing", label: "Content Marketing" },
                {
                  value: "Organic Search (SEO)",
                  label: "Organic Search (SEO)",
                },
                { value: "Print Media", label: "Print Media" },
                { value: "Partner/Reseller", label: "Partner/Reseller" },
                { value: "Walk-in", label: "Walk-in" },
                { value: "Webinar/Event", label: "Webinar/Event" },
                { value: "LinkedIn Outreach", label: "LinkedIn Outreach" },
                {
                  value: "Advertising (TV/Radio)",
                  label: "Advertising (TV/Radio)",
                },
                { value: "Product Demo/Trial", label: "Product Demo/Trial" },
                { value: "Flyer/Brochure", label: "Flyer/Brochure" },
                { value: "Sales Outreach", label: "Sales Outreach" },
                { value: "Word of Mouth", label: "Word of Mouth" },
                { value: "SMS Marketing", label: "SMS Marketing" },
                {
                  value: "Customer Re-engagement",
                  label: "Customer Re-engagement",
                },
                { value: "CRM Database", label: "CRM Database" },
                { value: "Other", label: "Other" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  leadSource: option?.value || "",
                }))
              }
            />

            {/* Lead Status Filter */}
            <Select
              label="Filter by Lead Status"
              placeholder="Select Lead Status"
              value={
                localFilters.leadStatus
                  ? {
                      value: localFilters.leadStatus,
                      label: localFilters.leadStatus,
                    }
                  : null
              }
              options={[
                { value: "New", label: "New" },
                { value: "Contacted", label: "Contacted" },
                { value: "Qualified", label: "Qualified" },
                { value: "Proposal Sent", label: "Proposal Sent" },
                { value: "Won", label: "Won" },
                { value: "Lost", label: "Lost" },
              ]}
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  leadStatus: option?.value || "",
                }))
              }
            />

            {/* Assigned To Filter */}
            <Select
              label="Filter by Assigned To"
              placeholder="Select Employee"
              options={[
                { value: "employee1", label: "Employee 1" },
                { value: "employee2", label: "Employee 2" },
                { value: "employee3", label: "Employee 3" },
              ]}
              value={
                localFilters.assignedTo
                  ? {
                      value: localFilters.assignedTo,
                      label: localFilters.assignedTo,
                    }
                  : null
              }
              onChange={(option: any) =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  assignedTo: option?.value || "",
                }))
              }
            />

            {/* Date Created Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Date Created
              </label>
              <DatePicker
                selected={
                  localFilters.dateCreated
                    ? new Date(localFilters.dateCreated)
                    : null
                }
                onChange={(date: Date | null) => {
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    dateCreated: date ? date.toISOString().split("T")[0] : null,
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
