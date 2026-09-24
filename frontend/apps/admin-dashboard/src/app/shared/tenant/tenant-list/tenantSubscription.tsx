"use client";

import { useState, useEffect } from "react";
import subscriptionService from "@/services/subscriptionservice";
import tenantService from "@/services/tenantService";
import { Button, Select, Flex, Box, Input, ActionIcon, Badge } from "rizzui";
import { PiXBold } from "react-icons/pi"; // Close icon
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { SubscriptionPlan } from "@/types/subscriptionPlanTypes";

type Props = {
  tenantId: string;
  action: "create" | "update" | "renew";
  onSuccess: () => void;
  closeModal?: () => void;
};

const TenantSubscription = ({
  tenantId,
  action,
  onSuccess,
  closeModal,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState<{
    value: string;
    label: string;
    intervalCount: number;
    interval: "year" | "month";
  } | null>(null);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState("");
  const [currentPlanName, setCurrentPlanName] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      const response = await subscriptionService.getList();
      setPlans(
        response.data.map((plan: SubscriptionPlan) => ({
          value: plan._id,
          label: `${plan.name} - $${plan.price}`,
          intervalCount: parseInt(plan.interval_count, 10),
          interval: plan.interval, // "month" or "year"
        }))
      );
    } catch (error) {
      toast.error("Failed to fetch subscription plans.");
    }
  };

  const fetchCurrentPlan = async () => {
    try {
      const tenant = await tenantService.getById(tenantId);
      console.log(tenant, "jdjj");
      const currentPlan = tenant?.data?.subscription_plan;

      if (currentPlan) {
        const defaultPlan = {
          value: currentPlan._id,
          label: `${currentPlan.name} - $${currentPlan.price}`,
          intervalCount: parseInt(currentPlan.interval_count, 10),
          interval: currentPlan.interval,
        };

        console.log(currentPlan, "jeiiio");

        setSelectedPlan(action === "renew" ? defaultPlan : null);

        setCurrentPlanName(currentPlan.name);

        // Set default startDate and endDate
        const today = dayjs().format("YYYY-MM-DD");
        setStartDate(today);
        setEndDate(
          dayjs(today)
            .add(
              defaultPlan.intervalCount,
              defaultPlan.interval === "year" ? "year" : "month"
            )
            .format("YYYY-MM-DD")
        );
      }
    } catch (error) {
      toast.error("Failed to fetch current subscription details.");
    }
  };

  useEffect(() => {
    fetchPlans();
    if (action !== "create") {
      fetchCurrentPlan();
    } else {
      setEndDate(""); // Reset endDate for create
    }
  }, [action]);

  const handlePlanChange = (option: any) => {
    setSelectedPlan(option);
    if (startDate) {
      const calculatedEndDate = dayjs(startDate)
        .add(
          option.intervalCount,
          option.interval === "year" ? "year" : "month"
        )
        .format("YYYY-MM-DD");
      setEndDate(calculatedEndDate);
    }
  };

  const handleStartDateChange = (newStartDate: any) => {
    setStartDate(newStartDate);
    if (selectedPlan) {
      const calculatedEndDate = dayjs(newStartDate)
        .add(
          selectedPlan.intervalCount,
          selectedPlan.interval === "year" ? "year" : "month"
        )
        .format("YYYY-MM-DD");
      setEndDate(calculatedEndDate);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlan?.value) {
      toast.error("Please select a subscription plan.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        tenantId,
        subscriptionPlanId: selectedPlan.value,
        ...(action !== "create" && { startDate, endDate }),
      };

      if (action === "create") {
        await tenantService.createSubscription(payload);
      } else if (action === "update") {
        await tenantService.updateSubscription(payload);
      } else if (action === "renew") {
        await tenantService.renewSubscription(payload);
      }

      toast.success(
        `${action.charAt(0).toUpperCase() + action.slice(1)} Subscription Successful!`
      );
      onSuccess();
    } catch (error) {
      toast.error("Failed to manage subscription.");
    } finally {
      setLoading(false);
    }
  };

  console.log(currentPlanName, "heyy");

  return (
    <Box className="p-6 space-y-6">
      {/* Header */}
      <Flex justify="between" align="center" className="border-b pb-4">
        <Flex align="center" gap="4">
          <h2 className="text-xl font-semibold">
            {action === "create" && "Create Subscription"}
            {action === "update" && "Update Subscription"}
            {action === "renew" && "Renew Subscription"}
          </h2>
          {currentPlanName && (
            <Badge color="success" className="text-white">
              {currentPlanName}
            </Badge>
          )}
        </Flex>
        <ActionIcon
          size="sm"
          variant="text"
          onClick={closeModal}
          className="text-gray-500 hover:!text-gray-900"
        >
          <PiXBold className="h-5 w-5" />
        </ActionIcon>
      </Flex>

      {/* Content */}
      <div className="space-y-4">
        <Select
          label={
            action === "renew"
              ? "Selected Subscription Plan"
              : "Select Subscription Plan"
          }
          options={plans}
          value={selectedPlan}
          placeholder="Choose a plan"
          onChange={(option) => handlePlanChange(option)}
          disabled={action === "renew"}
        />
        {action === "update" && (
          <>
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              disabled // End date is calculated based on the selected plan
            />
          </>
        )}
      </div>

      {/* Footer */}
      <Flex justify="end" className="pt-4">
        <Button onClick={handleSubmit} isLoading={loading}>
          {action === "create" && "Create"}
          {action === "update" && "Update"}
          {action === "renew" && "Renew"}
        </Button>
      </Flex>
    </Box>
  );
};

export default TenantSubscription;
