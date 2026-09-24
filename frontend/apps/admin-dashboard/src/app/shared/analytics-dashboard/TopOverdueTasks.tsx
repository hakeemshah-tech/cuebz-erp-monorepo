"use client";

import WidgetCard from "@core/components/cards/widget-card";
import { Title, Text, Accordion } from "rizzui";
import dayjs from "dayjs";

export default function TopOverdueTasks({ data }: { data: any[] }) {
  return (
    <WidgetCard
      title="Top Overdue Tasks"
      description="Tasks past their due date"
      rounded="lg"
      className="h-full"
      descriptionClassName="text-gray-500 mt-1.5"
    >
      <div className="space-y-4">
        {data.length === 0 && (
          <Text className="text-sm text-gray-500">No overdue tasks.</Text>
        )}

        {data.map((task) => (
          <div
            key={task._id}
            className="border p-3 rounded-lg bg-red-50 dark:bg-red-100/10 border-red-200 dark:border-red-500"
          >
            <Title as="h6" className="text-base font-semibold text-red-600">
              {task.title}
            </Title>
            <Text className="text-xs text-gray-500">
              Due: {dayjs(task.dueDate).format("DD MMM YYYY")}
            </Text>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
