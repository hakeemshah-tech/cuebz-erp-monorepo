"use client";

import WidgetCard from "@core/components/cards/widget-card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Text, Title } from "rizzui";
import { CustomTooltip } from "@core/components/charts/custom-tooltip";

const COLORS = ["#f39c12", "#2ecc71"];

export default function TaskStatusChart({
  data,
}: {
  data: { pending: number; completed: number };
}) {
  const rawData = [
    { name: "Pending", value: data.pending || 0 },
    { name: "Completed", value: data.completed || 0 },
  ];

  const chartData = rawData.map((item) => ({
    ...item,
    value: item.value === 0 ? 0.001 : item.value,
  }));

  return (
    <WidgetCard
      title="Task Status"
      description="Overall task distribution"
      rounded="lg"
      descriptionClassName="text-gray-500 mt-1.5"
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="[&_.recharts-sector:focus]:outline-none">
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              label={({ name, value }) => (value > 0.001 ? name : "")}
              isAnimationActive={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
        {rawData
          .filter((item) => item.value > 0)
          .map((item, index) => (
            <div
              key={item.name}
              className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-900"
            >
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <div>
                <Text className="text-xs text-gray-500 font-medium">
                  {item.name}
                </Text>
                <Title as="h6" className="text-sm">
                  {item.value === 0.001 ? 0 : item.value}
                </Title>
              </div>
            </div>
          ))}
      </div>
    </WidgetCard>
  );
}
