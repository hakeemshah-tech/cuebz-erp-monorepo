"use client";

import { useState, useEffect } from "react";
import { Button, Flex, Input, Select } from "rizzui";
import {
  PiMagnifyingGlassBold,
  PiFunnel,
  PiTrashDuotone,
} from "react-icons/pi";
import FilterDrawerView from "@core/components/controlled-table/table-filter";
import subscriptionService from "@/services/subscriptionservice";
import ToggleColumns from "@core/components/table-utils/toggle-columns";
import { MdFilterAltOff } from "react-icons/md";

interface IFilters {
  filters: any;
  setFilters: (arg: any) => void;
  onApplyFilters: any;
  table: any;
}

export default function Filters({
  filters,
  setFilters,
  onApplyFilters,
  table,
}: IFilters) {
  console.log(table);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any>([]);

  const [localFilters, setLocalFilters] = useState({ ...filters });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await subscriptionService.getList();
        setSubscriptionPlans(
          response.data.map((plan: any) => ({
            value: plan._id,
            label: plan.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch subscription plans.");
      }
    };
    if (openDrawer && subscriptionPlans?.length === 0) {
      fetchPlans();
    }
  }, [openDrawer, subscriptionPlans]);

  const handleApplyFilters = () => {
    setFilters(localFilters); // Update the parent state with new filters
    onApplyFilters(); // Trigger API fetch with updated filters
    setOpenDrawer(false); // Close the drawer
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      globalSearch: "",
      subscriptionStatus: "",
      subscriptionPlan: "",
    };
    setLocalFilters(clearedFilters); // Reset local filters
    setFilters(clearedFilters); // Reset parent filters
    onApplyFilters(); // Trigger API call to reset data
  };

  return (
    <Flex align="center" justify="between" className="mb-4">
      {/* Global Search */}
      <Input
        type="search"
        placeholder="Search by company name..."
        value={filters.globalSearch}
        onClear={() =>
          setFilters((prev: any) => ({ ...prev, globalSearch: "" }))
        }
        onChange={(e) =>
          setFilters((prev: any) => ({ ...prev, globalSearch: e.target.value }))
        }
        inputClassName="h-9"
        clearable={true}
        prefix={<PiMagnifyingGlassBold className="size-4" />}
      />

      {/* Filters Drawer */}
      <FilterDrawerView
        isOpen={openDrawer}
        drawerTitle="Table Filters"
        setOpenDrawer={setOpenDrawer}
        onApplyFilters={handleApplyFilters}
      >
        <div className="grid grid-cols-1 gap-6">
          {/* Status Filter */}
          <Select
            label="Filter by Status"
            placeholder="Select Status"
            value={
              localFilters.subscriptionStatus
                ? {
                    value: localFilters.subscriptionStatus,
                    label: localFilters.subscriptionStatus,
                  }
                : null
            }
            options={[
              { value: "Active", label: "Active" },
              { value: "Expired", label: "Expired" },
              { value: "Trialing", label: "Trialing" },
              { value: "Payment Failed", label: "Payment Failed" },
              { value: "Pending Update", label: "Pending Update" },
            ]}
            onChange={(option: any) =>
              setLocalFilters((prev: any) => ({
                ...prev,
                subscriptionStatus: option?.value || "",
              }))
            }
          />

          {/* Subscription Plan Filter */}
          <Select
            label="Filter by Subscription Plan"
            placeholder="Select Subscription Plan"
            value={
              localFilters.subscriptionPlan
                ? {
                    value: localFilters.subscriptionPlan,
                    label: subscriptionPlans.find(
                      (plan: any) =>
                        plan.value === localFilters.subscriptionPlan
                    )?.label,
                  }
                : null
            }
            options={subscriptionPlans}
            onChange={(option: any) =>
              setLocalFilters((prev: any) => ({
                ...prev,
                subscriptionPlan: option?.value || "",
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
  );
}
