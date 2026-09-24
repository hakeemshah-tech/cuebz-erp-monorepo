// "use client";

// import { useState } from "react";
// import { Select, Input, Button } from "rizzui";
// import { DatePicker } from "@core/ui/datepicker";
// import { PiArrowRightBold } from "react-icons/pi";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// import cn from "@core/utils/class-names";

// const COLORS = {
//   Sick: "#4F46E5",
//   Casual: "#60A5FA",
//   Paid: "#34D399",
// };

// const pieData = [
//   { name: "Sick", value: 50 },
//   { name: "Paid", value: 21.4 },
//   { name: "Paid Leave", value: 28.6 },
// ];

// const employeeList = new Array(15).fill("Muhammad");

// export default function LeaveManagementPage() {
//   const [selectedEmployee, setSelectedEmployee] = useState("John Doe");
//   const [leaveType, setLeaveType] = useState("Sick");
//   const [reason, setReason] = useState("");
//   const [dateRange, setDateRange] = useState<any>(null);

//   return (
//     <div className="flex h-full min-h-[600px] w-full">
//       {/* Employee List */}
//       <div className="w-64 border-r border-gray-200 p-3 overflow-y-auto">
//         <Input placeholder="Search Employees" className="mb-4" />
//         <ul className="space-y-1">
//           {employeeList.map((name, idx) => (
//             <li
//               key={idx}
//               className={cn(
//                 "cursor-pointer px-4 py-2 rounded-md hover:bg-gray-100 flex justify-between items-center",
//                 selectedEmployee === name && "bg-gray-100 font-medium"
//               )}
//               onClick={() => setSelectedEmployee(name)}
//             >
//               {name} <PiArrowRightBold className="h-3 w-3" />
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Main Panel */}
//       <div className="flex-1 px-6 py-4">
//         <div className="text-sm text-muted-foreground mb-2">
//           Employee &gt; Leave Management
//         </div>
//         <h1 className="text-xl font-semibold mb-4">Leave Management</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
//           {/* Calendar + Form */}
//           <div className="col-span-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Calendar */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Employee
//                 </label>
//                 <Select
//                   value={selectedEmployee}
//                   options={[{ value: "John Doe", label: "John Doe" }]}
//                   onChange={(val) => setSelectedEmployee(val.value)}
//                 />

//                 <div className="mt-4">
//                   <h4 className="text-sm font-medium mb-2">April 2024</h4>
//                   <div className="grid grid-cols-7 gap-1 text-center text-xs">
//                     {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
//                       <div key={d} className="font-semibold text-gray-500">
//                         {d}
//                       </div>
//                     ))}
//                     {new Array(30).fill(null).map((_, i) => (
//                       <div
//                         key={i}
//                         className={cn(
//                           "h-7 w-7 flex items-center justify-center rounded-full",
//                           i === 8 &&
//                             "bg-orange-100 text-orange-600 font-medium",
//                           i === 21 && "bg-blue-100 text-blue-600 font-medium",
//                           i === 27 && "bg-green-100 text-green-600 font-medium"
//                         )}
//                       >
//                         {i + 1}
//                       </div>
//                     ))}
//                   </div>

//                   <div className="flex gap-4 mt-4 text-xs">
//                     <div className="flex items-center gap-1">
//                       <span className="h-3 w-3 rounded-full bg-indigo-600 inline-block"></span>{" "}
//                       Sick
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <span className="h-3 w-3 rounded-full bg-blue-400 inline-block"></span>{" "}
//                       Casual
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <span className="h-3 w-3 rounded-full bg-green-400 inline-block"></span>{" "}
//                       Paid
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Apply Form */}
//               <div>
//                 <h4 className="text-base font-medium mb-4">Apply Leave</h4>
//                 <Input
//                   label="Reason"
//                   value={reason}
//                   onChange={(e) => setReason(e.target.value)}
//                   className="mb-4"
//                 />
//                 <DatePicker
//                   value={dateRange}
//                   onChange={setDateRange}
//                   className="mb-4"
//                 />
//                 <Select
//                   label="Type"
//                   value={leaveType}
//                   options={[
//                     { value: "Sick", label: "Sick" },
//                     { value: "Casual", label: "Casual" },
//                     { value: "Paid", label: "Paid" },
//                   ]}
//                   onChange={(val) => setLeaveType(val.value)}
//                   className="mb-4"
//                 />
//                 <Button className="w-full">Apply</Button>
//               </div>
//             </div>
//           </div>

//           {/* Right Panel */}
//           <div className="grid grid-cols-1 gap-4">
//             {/* Leave Details */}
//             <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
//               <h4 className="text-sm font-medium mb-3">Leave Details</h4>
//               <div className="text-sm space-y-2">
//                 <div className="flex justify-between items-center">
//                   <span>Sick Leave</span>
//                   <span className="text-muted-foreground text-xs">
//                     09–10.2024
//                   </span>
//                   <span className="text-green-500 font-semibold text-xs">
//                     Approved
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span>Casual Leave</span>
//                   <span className="text-muted-foreground text-xs">
//                     04.18.2024
//                   </span>
//                   <span className="text-yellow-500 font-semibold text-xs">
//                     Pending
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span>Paid Leave</span>
//                   <span className="text-muted-foreground text-xs">
//                     28–28.2024
//                   </span>
//                   <span className="text-green-500 font-semibold text-xs">
//                     Approved
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Leave Utilization Chart */}
//             <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
//               <h4 className="text-sm font-medium mb-3">Leave Utilization</h4>
//               <div className="h-40">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={pieData}
//                       dataKey="value"
//                       nameKey="name"
//                       innerRadius={30}
//                       outerRadius={50}
//                       paddingAngle={2}
//                       label
//                     >
//                       {pieData.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[entry.name as keyof typeof COLORS]}
//                         />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="flex justify-center gap-4 text-xs mt-2">
//                 {pieData.map((entry) => (
//                   <div key={entry.name} className="flex items-center gap-1">
//                     <span
//                       className="w-3 h-3 rounded-sm"
//                       style={{
//                         backgroundColor:
//                           COLORS[entry.name as keyof typeof COLORS],
//                       }}
//                     ></span>
//                     {entry.name}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
