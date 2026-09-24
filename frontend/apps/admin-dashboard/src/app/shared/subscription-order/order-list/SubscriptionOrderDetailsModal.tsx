"use client";

import React from "react";
import { Box, Flex, Badge, ActionIcon } from "rizzui";
import { PiXBold } from "react-icons/pi";
import dayjs from "dayjs";
import { SubscriptionOrderType } from "@/types/subscriptionOrdersTypes";

type SubscriptionOrderDetailsModalProps = {
  order: SubscriptionOrderType;
  closeModal: () => void;
};

const statusColors = {
  Pending: "bg-yellow-500",
  Paid: "bg-green-500",
  Failed: "bg-red-500",
  Canceled: "bg-gray-500",
};

export default function SubscriptionOrderDetailsModal({
  order,
  closeModal,
}: SubscriptionOrderDetailsModalProps) {
  return (
    <Box className="p-6 space-y-6 rounded-lg bg-white shadow-md">
      {/* Header */}
      <Flex justify="between" align="center" className="border-b pb-4">
        <h2 className="text-xl font-semibold">Order Details</h2>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {/* Company Name */}
        <div>
          <p className="text-sm text-gray-500">Company Name</p>
          <p className="text-lg font-medium text-gray-900">
            {order.tenant_id.company_name}
          </p>
        </div>

        {/* Plan Name */}
        <div>
          <p className="text-sm text-gray-500">Plan Name</p>
          <p className="text-lg font-medium text-gray-900">
            {order.subscription_plan.name}
          </p>
        </div>

        {/* Amount */}
        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="text-lg font-medium text-gray-900">
            {order.amount} {order.currency.toUpperCase()}
          </p>
        </div>

        {/* Start Date */}
        <div>
          <p className="text-sm text-gray-500">Start Date</p>
          <p className="text-lg font-medium text-gray-900">
            {dayjs(order.start_date).format("DD-MMM-YYYY")}
          </p>
        </div>

        {/* End Date */}
        <div>
          <p className="text-sm text-gray-500">End Date</p>
          <p className="text-lg font-medium text-gray-900">
            {dayjs(order.end_date).format("DD-MMM-YYYY")}
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <Badge
            className={`text-white ${
              statusColors[order.status] || "bg-gray-500"
            } py-1 px-3 rounded-full text-sm font-medium`}
          >
            {order.status}
          </Badge>
        </div>
      </div>
    </Box>
  );
}
