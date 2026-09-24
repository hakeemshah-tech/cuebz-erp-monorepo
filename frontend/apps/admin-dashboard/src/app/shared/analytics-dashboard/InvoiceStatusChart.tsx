// "use client";

// import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
// import WidgetCard from "@core/components/cards/widget-card";
// import { Title, Text } from "rizzui";
// import { CustomTooltip } from "@core/components/charts/custom-tooltip";

// const COLORS = ["#f39c12", "#2ecc71", "#e74c3c", "#95a5a6"];

// const STATUS_LABELS: Record<string, string> = {
//   Unpaid: "Unpaid",
//   Paid: "Paid",
//   Cancelled: "Cancelled",
//   Refunded: "Refunded",
// };

// export default function InvoiceStatusChart({
//   data,
//   className,
// }: {
//   data: Record<string, number>;
//   className?: string;
// }) {
//   console.log(data, "helloo");
//   const rawData = Object.entries(data).map(([key, value]) => ({
//     name: STATUS_LABELS[key] || key,
//     value: value || 0,
//   }));

//   const chartData = rawData.map((entry) => ({
//     ...entry,
//     value: entry.value === 0 ? 0.001 : entry.value,
//   }));

//   return (
//     <WidgetCard
//       title="Invoice Status"
//       description="Breakdown of invoice statuses"
//       rounded="lg"
//       className={className}
//       descriptionClassName="text-gray-500 mt-1.5"
//     >
//       <div className="h-72 w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart className="[&_.recharts-sector:focus]:outline-none">
//             <Pie
//               data={chartData}
//               innerRadius={60}
//               outerRadius={100}
//               fill="#8884d8"
//               paddingAngle={3}
//               dataKey="value"
//               isAnimationActive={false}
//             >
//               {chartData.map((_, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
//         {rawData.map((item, index) => (
//           <div key={item.name}>
//             <Text className="font-medium">{item.name}</Text>
//             <Title as="h5">{item.value}</Title>
//           </div>
//         ))}
//       </div>
//     </WidgetCard>
//   );
// }

// "use client";

// import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
// import WidgetCard from "@core/components/cards/widget-card";
// import { Title, Text } from "rizzui";
// import { CustomTooltip } from "@core/components/charts/custom-tooltip";

// const COLORS = ["#f39c12", "#2ecc71", "#e74c3c", "#95a5a6"];

// const STATUS_LABELS: Record<string, string> = {
//   Unpaid: "Unpaid",
//   Paid: "Paid",
//   Cancelled: "Cancelled",
//   Refunded: "Refunded",
// };

// export default function InvoiceStatusChart({
//   data,
//   className,
// }: {
//   data: Record<string, number>;
//   className?: string;
// }) {
//   const rawData = Object.entries(data).map(([key, value]) => ({
//     name: STATUS_LABELS[key] || key,
//     value: value || 0,
//   }));

//   const chartData = rawData.map((entry) => ({
//     ...entry,
//     value: entry.value === 0 ? 0.001 : entry.value,
//   }));

//   return (
//     <WidgetCard
//       title="Invoice Status"
//       description="Breakdown of invoice statuses"
//       rounded="lg"
//       className={className}
//       descriptionClassName="text-gray-500 mt-1.5"
//     >
//       <div className="h-72 w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart className="[&_.recharts-sector:focus]:outline-none">
//             <Pie
//               data={chartData}
//               dataKey="value"
//               nameKey="name"
//               innerRadius={60}
//               outerRadius={100}
//               paddingAngle={3}
//               label={({ name, value }) => (value > 0.001 ? name : "")}
//               isAnimationActive={false}
//             >
//               {chartData.map((_, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
//         {rawData
//           .filter((item) => item.value > 0)
//           .map((item, index) => (
//             <div
//               key={item.name}
//               className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-900"
//             >
//               <span
//                 className="inline-block w-3 h-3 rounded-full"
//                 style={{ backgroundColor: COLORS[index % COLORS.length] }}
//               ></span>
//               <div>
//                 <Text className="text-xs text-gray-500 font-medium">
//                   {item.name}
//                 </Text>
//                 <Title as="h6" className="text-sm">
//                   {item.value}
//                 </Title>
//               </div>
//             </div>
//           ))}
//       </div>
//     </WidgetCard>
//   );
// }

"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import WidgetCard from "@core/components/cards/widget-card";
import { Title, Text } from "rizzui";

// Custom color mapping
const COLOR_MAP: Record<string, string> = {
  Paid: "#2ecc71",
  Unpaid: "#f39c12",
  Cancelled: "#e74c3c",
  Refunded: "#95a5a6",
};

export default function InvoiceStatusChart({
  data,
  className,
}: {
  data: Record<string, number>;
  className?: string;
}) {
  const rawData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([status, value]) => ({
      name: status,
      value,
    }));

  const total = rawData.reduce((sum, item) => sum + item.value, 0);

  return (
    <WidgetCard title="Invoice Status" className={className} rounded="lg">
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rawData}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              labelLine
              isAnimationActive={false}
              label={({ name, value }) =>
                total > 0
                  ? `${name} ${Math.round((value / total) * 100)}% : ${value}`
                  : ""
              }
            >
              {rawData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLOR_MAP[entry.name] || "#95a5a6"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "6px",
                padding: "8px 12px",
                border: "none",
              }}
              formatter={(value: number, name: string) => [`${value}`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-around text-sm text-gray-700">
        {rawData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: COLOR_MAP[item.name] || "#95a5a6" }}
            />
            <Text className="text-xs font-medium text-gray-700">
              {item.name}
            </Text>
            <Title as="h6" className="text-sm font-bold text-primary">
              {item.value}
            </Title>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
