import React from "react";
import { Badge, ActionIcon } from "rizzui";
import dayjs from "dayjs";
import { PiXBold } from "react-icons/pi";
import { TenantDataType } from "@/types/tenantTypes";

const statusColors = {
  Active: "bg-green-500",
  Expired: "bg-red-500",
  Trialing: "bg-yellow-500",
  "Payment Failed": "bg-orange-500",
  "Pending Update": "bg-blue-500",
};

interface ITenantDetailsModal {
  tenant: TenantDataType;
  closeModal: any;
}

export default function TenantDetailsModal({
  tenant,
  closeModal,
}: ITenantDetailsModal) {
  return (
    <div className="rounded-lg bg-white shadow-md">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-5 md:p-7">
        <h2 className="font-lexend text-lg font-semibold text-gray-900">
          Tenant Details
        </h2>
        <ActionIcon
          size="sm"
          variant="text"
          onClick={closeModal}
          className="p-0 text-gray-500 hover:!text-gray-900"
        >
          <PiXBold className="h-5 w-5" />
        </ActionIcon>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-6">
        {/* Tenant Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Company Name</p>
            <p className="text-lg font-medium text-gray-900">
              {tenant.company_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Owner Name</p>
            <p className="text-lg font-medium text-gray-900">
              {tenant.tenant_owner?.name}
            </p>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Subscription Start</p>
            <p className="text-lg font-medium text-gray-900">
              {dayjs(tenant.subscription_start_date).format("DD-MMM-YYYY")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Subscription End</p>
            <p className="text-lg font-medium text-gray-900">
              {dayjs(tenant.subscription_end_date).format("DD-MMM-YYYY")}
            </p>
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500">Subscription Status</p>
          <Badge
            className={`text-white ${
              statusColors[tenant.subscription_status] || "bg-gray-500"
            } py-1 px-3 rounded-full text-sm font-medium`}
          >
            {tenant.subscription_status}
          </Badge>
        </div>
      </div>
    </div>
  );
}
