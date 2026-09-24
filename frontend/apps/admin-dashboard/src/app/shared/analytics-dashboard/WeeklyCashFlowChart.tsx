// "use client";

// import WidgetCard from "@core/components/cards/widget-card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { Title, Text } from "rizzui";
// import { CustomTooltip } from "@core/components/charts/custom-tooltip";

// export default function WeeklyCashFlowChart({
//   data,
//   className,
// }: {
//   data: { week: string; add: number; expense: number }[];
//   className?: string;
// }) {
//   return (
//     <WidgetCard
//       title="Weekly Petty Cash Flow"
//       description="Inflow vs Outflow summary by week"
//       className={className}
//       rounded="lg"
//       descriptionClassName="text-gray-500 mt-1.5"
//     >
//       <div className="h-72 w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={data} barSize={16}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="week" tickLine={false} axisLine={false} />
//             <YAxis tickLine={false} axisLine={false} />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar
//               dataKey="add"
//               stackId="cash"
//               fill="#27ae60"
//               name="Added"
//               radius={[4, 4, 0, 0]}
//             />
//             <Bar
//               dataKey="expense"
//               stackId="cash"
//               fill="#eb5757"
//               name="Expense"
//               radius={[4, 4, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </WidgetCard>
//   );
// }

"use client";

import WidgetCard from "@core/components/cards/widget-card";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Title } from "rizzui";

export default function WeeklyCashFlowChart({
  data,
  className,
}: {
  data: { _id: string; totalAdd: number; totalExpense: number }[];
  className?: string;
}) {
  const formattedData = data.map((entry) => ({
    date: entry._id,
    Add: entry.totalAdd,
    Expense: -entry.totalExpense, // show expense as negative
  }));

  return (
    <WidgetCard title="Petty Cash" className={className} rounded="lg">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 30, right: 20, left: 10, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-35}
              textAnchor="end"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{
                value: "Amount (AED)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fontSize: 12,
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend
              align="right"
              verticalAlign="top"
              iconType="circle"
              wrapperStyle={{
                fontSize: 12,
                marginBottom: "16px",
                paddingLeft: "10px",
              }}
            />
            <Bar dataKey="Add" fill="#2ecc71" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expense" fill="#e74c3c" radius={[0, 0, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
