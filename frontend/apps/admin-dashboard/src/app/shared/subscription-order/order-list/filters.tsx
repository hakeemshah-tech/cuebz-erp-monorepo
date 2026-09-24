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
import tenantService from "@/services/tenantService";
import { MdFilterAltOff } from "react-icons/md";

interface IFilters {
  filters: {
    status: string;
    tenantId: string;
    subscriptionPlanId: string;
  };
  setFilters: (arg: any) => void;
  onApplyFilters: () => void;
}

export default function Filters({
  filters,
  setFilters,
  onApplyFilters,
}: IFilters) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [localFilters, setLocalFilters] = useState({ ...filters });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const tenantResponse = await tenantService.getList();
        const planResponse = await subscriptionService.getList();

        setTenants(
          tenantResponse.data.map((tenant: any) => ({
            value: tenant._id,
            label: tenant.company_name,
          }))
        );

        setPlans(
          planResponse.data.map((plan: any) => ({
            value: plan._id,
            label: plan.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch dropdown data.");
      }
    };
    if (openDrawer && tenants?.length === 0 && plans?.length === 0) {
      fetchDropdownData();
    }
  }, [openDrawer, tenants, plans]);

  const handleApplyFilters = () => {
    setFilters(localFilters); // Update parent filters
    onApplyFilters(); // Trigger API fetch with updated filters
    setOpenDrawer(false); // Close the drawer
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: "",
      tenantId: "",
      subscriptionPlanId: "",
    };
    setLocalFilters(clearedFilters); // Reset local filters
    setFilters(clearedFilters); // Reset parent filters
    onApplyFilters(); // Trigger API fetch to reset data
  };

  return (
    <Flex align="center" justify="end" className="mb-4">
      {/* Global Search */}
      {/* <Input
        type="search"
        placeholder="Search orders..."
        value={localFilters.status}
        onClear={() => setLocalFilters((prev) => ({ ...prev, status: "" }))}
        onChange={(e) =>
          setLocalFilters((prev) => ({ ...prev, status: e.target.value }))
        }
        inputClassName="h-9"
        clearable={true}
        prefix={<PiMagnifyingGlassBold className="size-4" />}
      /> */}

      {/* Filter Drawer */}
      <FilterDrawerView
        isOpen={openDrawer}
        drawerTitle="Subscription Order Filters"
        setOpenDrawer={setOpenDrawer}
        onApplyFilters={handleApplyFilters}
      >
        <div className="grid grid-cols-1 gap-6">
          {/* Tenant Filter */}
          <Select
            label="Filter by Tenant"
            placeholder="Select Tenant"
            value={
              localFilters.tenantId
                ? {
                    value: localFilters.tenantId,
                    label: tenants.find(
                      (tenant) => tenant.value === localFilters.tenantId
                    )?.label,
                  }
                : null
            }
            options={tenants}
            onChange={(option: any) =>
              setLocalFilters((prev) => ({
                ...prev,
                tenantId: option?.value || "",
              }))
            }
          />

          {/* Subscription Plan Filter */}
          <Select
            label="Filter by Subscription Plan"
            placeholder="Select Subscription Plan"
            value={
              localFilters.subscriptionPlanId
                ? {
                    value: localFilters.subscriptionPlanId,
                    label: plans.find(
                      (plan) => plan.value === localFilters.subscriptionPlanId
                    )?.label,
                  }
                : null
            }
            options={plans}
            onChange={(option: any) =>
              setLocalFilters((prev) => ({
                ...prev,
                subscriptionPlanId: option?.value || "",
              }))
            }
          />

          {/* Status Filter */}
          <Select
            label="Filter by Status"
            placeholder="Select Status"
            value={
              localFilters.status
                ? { value: localFilters.status, label: localFilters.status }
                : null
            }
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Paid", label: "Paid" },
              { value: "Failed", label: "Failed" },
              { value: "Canceled", label: "Canceled" },
            ]}
            onChange={(option: any) =>
              setLocalFilters((prev) => ({
                ...prev,
                status: option?.value || "",
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
      </Flex>
    </Flex>
  );
}
