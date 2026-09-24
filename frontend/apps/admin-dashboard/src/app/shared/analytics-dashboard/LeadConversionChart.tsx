// "use client";

// import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
// import WidgetCard from "@core/components/cards/widget-card";
// import { Title, Text } from "rizzui";
// import { CustomTooltip } from "@core/components/charts/custom-tooltip";

// const COLORS = ["#3498db", "#f39c12", "#2ecc71", "#95a5a6"]; // last one = other

// export default function LeadConversionChart({
//   data,
//   className,
// }: {
//   data: {
//     new: number;
//     contacted: number;
//     won: number;
//     total: number;
//     conversionRate: number;
//   };
//   className?: string;
// }) {
//   // display fallback for pie (invisible on zero)
//   const rawData = [
//     { name: "New", value: data.new },
//     { name: "Contacted", value: data.contacted },
//     { name: "Won", value: data.won },
//   ];

//   const knownTotal = rawData.reduce((sum, d) => sum + d.value, 0);
//   const remaining = Math.max((data.total || 0) - knownTotal, 0);

//   if (remaining > 0) {
//     rawData.push({ name: "Other", value: remaining });
//   }

//   const chartData = rawData.map((entry) => ({
//     ...entry,
//     value: entry.value === 0 ? 0.001 : entry.value,
//   }));

//   return (
//     <WidgetCard
//       title="Lead Conversion Rate"
//       description="Monthly lead status distribution"
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
//               nameKey="name"
//               label={({ name }) => name}
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
//         <div>
//           <Text className="font-medium">New</Text>
//           <Title as="h5">{data.new}</Title>
//         </div>
//         <div>
//           <Text className="font-medium">Contacted</Text>
//           <Title as="h5">{data.contacted}</Title>
//         </div>
//         <div>
//           <Text className="font-medium">Won</Text>
//           <Title as="h5">{data.won}</Title>
//         </div>
//         <div>
//           <Text className="font-medium">Total Leads</Text>
//           <Title as="h5">{data.total}</Title>
//         </div>
//         <div className="col-span-2">
//           <Text className="font-medium">Conversion Rate</Text>
//           <Title as="h4" className="text-green-600">
//             {data.conversionRate.toFixed(2)}%
//           </Title>
//         </div>
//       </div>
//     </WidgetCard>
//   );
// }

// "use client";

// import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
// import WidgetCard from "@core/components/cards/widget-card";
// import { Title, Text } from "rizzui";
// import { CustomTooltip } from "@core/components/charts/custom-tooltip";

// const COLORS = ["#3498db", "#f39c12", "#2ecc71", "#95a5a6"];

// export default function LeadConversionChart({
//   data,
//   className,
// }: {
//   data: {
//     new: number;
//     contacted: number;
//     won: number;
//     total: number;
//     conversionRate: number;
//   };
//   className?: string;
// }) {
//   const rawData = [
//     { name: "New", value: data.new },
//     { name: "Contacted", value: data.contacted },
//     { name: "Won", value: data.won },
//   ];

//   const knownTotal = rawData.reduce((sum, d) => sum + d.value, 0);
//   const remaining = Math.max((data.total || 0) - knownTotal, 0);

//   if (remaining > 0) {
//     rawData.push({ name: "Other", value: remaining });
//   }

//   const chartData = rawData.map((entry) => ({
//     ...entry,
//     value: entry.value === 0 ? 0.001 : entry.value,
//   }));

//   return (
//     <WidgetCard
//       title="Lead Conversion Rate"
//       description="Monthly lead status distribution"
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
//               nameKey="name"
//               label={({ name, value }) => (value > 0.001 ? name : "")}
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
//                   {item.value === 0.001 ? 0 : item.value}
//                 </Title>
//               </div>
//             </div>
//           ))}
//         <div className="col-span-2">
//           <Text className="font-medium">Conversion Rate</Text>
//           <Title as="h4" className="text-green-600">
//             {data.conversionRate.toFixed(2)}%
//           </Title>
//         </div>
//       </div>
//     </WidgetCard>
//   );
// }

"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import WidgetCard from "@core/components/cards/widget-card";
import { Text, Title } from "rizzui";

// Custom color scheme to match your design
const COLORS = {
  Won: "#2ecc71",
  Contacted: "#f39c12",
  New: "#5D6DDB",
};

export default function LeadConversionChart({
  data,
  className,
}: {
  data: {
    new: number;
    contacted: number;
    won: number;
    total: number;
    conversionRate: number;
  };
  className?: string;
}) {
  const chartData = [
    { name: "Won", value: data.won },
    { name: "Contacted", value: data.contacted },
    { name: "New", value: data.new },
  ];

  const hasData = chartData.some((item) => item.value > 0);

  return (
    <WidgetCard
      title="Lead Conversion Rate"
      className={className}
      rounded="lg"
      descriptionClassName="hidden"
    >
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              isAnimationActive={false}
              stroke="none"
              label={({ name, value }) =>
                value > 0
                  ? `${name} ${((value / data.total) * 100).toFixed(0)}%`
                  : ""
              }
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value}`, name]}
              labelStyle={{ display: "none" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-5 grid grid-cols-3 gap-4 px-4">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="w-full flex flex-col items-start gap-1"
          >
            <div className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: COLORS[item.name as keyof typeof COLORS],
                }}
              />
              <Text className="text-xs text-gray-600 font-medium">
                {item.name}
              </Text>
            </div>
            <Title as="h6" className="text-sm font-bold text-black">
              {item.value}
            </Title>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
