"use client";

import WidgetCard from "@core/components/cards/widget-card";
import { Text, Title } from "rizzui";
import { PiKeyLight, PiWrenchLight } from "react-icons/pi";

export default function WorkspaceAlerts({
  data,
  className,
}: {
  data: { credentials: number; assetMaintenance: number };
  className?: string;
}) {
  return (
    <WidgetCard
      title="Workspace Alerts"
      description="Pending credentials and asset maintenance checks"
      rounded="lg"
      className={className}
      descriptionClassName="text-gray-500 mt-1.5"
    >
      <br />
      <div className="grid grid-cols-2 gap-6 text-sm text-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <PiKeyLight className="w-5 h-5" />
          </div>
          <div>
            <Text className="font-medium">Credentials</Text>
            <Title as="h5">{data.credentials}</Title>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-100 text-red-600">
            <PiWrenchLight className="w-5 h-5" />
          </div>
          <div>
            <Text className="font-medium">Asset Maintenance</Text>
            <Title as="h5">{data.assetMaintenance}</Title>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
