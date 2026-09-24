// "use client";

// import { useRef } from "react";
// import MetricCard from "@core/components/cards/metric-card";
// import {
//   PiMoneyLight,
//   PiCheckCircleLight,
//   PiUserSwitchLight,
//   PiPhoneCallLight,
//   PiUsersLight,
//   PiCalendarCheckLight,
//   PiCaretLeftBold,
//   PiCaretRightBold,
// } from "react-icons/pi";
// import cn from "@core/utils/class-names";

// export default function StatCards({
//   data,
//   className,
// }: {
//   data: any;
//   className?: string;
// }) {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const scroll = (direction: "left" | "right") => {
//     if (scrollRef.current) {
//       const scrollAmount = 280;
//       scrollRef.current.scrollBy({
//         left: direction === "left" ? -scrollAmount : scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   const cards = [
//     {
//       id: "petty-cash",
//       title: "Petty Cash Balance",
//       metric: `AED ${data.pettyCash.balance.toFixed(2)}`,
//       icon: <PiMoneyLight className="w-6 h-6 text-blue-500" />,
//     },
//     {
//       id: "tasks",
//       title: "Overdue Tasks",
//       metric: `${data.tasks.overdueCount} Tasks`,
//       icon: <PiCheckCircleLight className="w-6 h-6 text-orange-500" />,
//     },
//     {
//       id: "conversion",
//       title: "Lead Conversion Rate",
//       metric: `${data.leads.conversionRate.toFixed(2)}%`,
//       icon: <PiUserSwitchLight className="w-6 h-6 text-green-600" />,
//     },
//     {
//       id: "today-calls",
//       title: "Today's Calls",
//       metric: `${data.todayCalls?.length || 0}`,
//       icon: <PiPhoneCallLight className="w-6 h-6 text-purple-500" />,
//     },
//     {
//       id: "today-visitors",
//       title: "Today's Visitors",
//       metric: `${data.todayVisitors?.length || 0}`,
//       icon: <PiUsersLight className="w-6 h-6 text-indigo-500" />,
//     },
//     {
//       id: "upcoming-events",
//       title: "Upcoming Events",
//       metric: `${data.upcomingEvents?.length || 0}`,
//       icon: <PiCalendarCheckLight className="w-6 h-6 text-teal-500" />,
//     },
//   ];

//   return (
//     <div className="relative w-full">
//       {/* Chevron Buttons */}
//       <button
//         onClick={() => scroll("left")}
//         className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 rounded-full shadow-md p-2 hidden md:inline-flex"
//         aria-label="Scroll Left"
//       >
//         <PiCaretLeftBold className="w-5 h-5 text-gray-600" />
//       </button>
//       <button
//         onClick={() => scroll("right")}
//         className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 rounded-full shadow-md p-2 hidden md:inline-flex"
//         aria-label="Scroll Right"
//       >
//         <PiCaretRightBold className="w-5 h-5 text-gray-600" />
//       </button>

//       {/* Scrollable Row */}
//       <div
//         ref={scrollRef}
//         className={cn(
//           "flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1",
//           "scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent",
//           "scrollbar-hide", // hide scrollbar (requires Tailwind plugin or custom CSS)
//           className
//         )}
//         style={{
//           scrollbarWidth: "none", // Firefox
//           msOverflowStyle: "none", // IE 10+
//         }}
//       >
//         {cards.map((stat) => (
//           <div
//             key={stat.id}
//             className="min-w-[270px] snap-start snap-always transition-transform duration-200 hover:scale-[1.015]"
//           >
//             <MetricCard
//               title={stat.title}
//               metric={stat.metric}
//               icon={stat.icon}
//               className="p-5 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md rounded-2xl"
//               iconClassName="!bg-transparent mb-2"
//               metricClassName="text-2xl font-semibold mt-1 text-gray-900"
//               titleClassName="text-sm text-gray-500 font-medium"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import {
  PiMoneyLight,
  PiCheckCircleLight,
  PiUserSwitchLight,
  PiPhoneCallLight,
  PiUsersLight,
  PiCalendarCheckLight,
} from "react-icons/pi";

export default function StatCards({ data }: { data: any }) {
  const cards = [
    {
      id: "tasks",
      title: "Overdue Tasks",
      value: `${data.tasks.overdueCount} Tasks`,
      icon: <PiCheckCircleLight className="w-5 h-5 text-gray-700" />,
    },
    {
      id: "conversion",
      title: "Lead Conversion Rate",
      value: `${data.leads.conversionRate.toFixed(2)}%`,
      icon: <PiUserSwitchLight className="w-5 h-5 text-gray-700" />,
    },
    {
      id: "today-calls",
      title: "Today's Calls",
      value: `${data.todayCalls?.length || 0}`,
      icon: <PiPhoneCallLight className="w-5 h-5 text-gray-700" />,
    },
    {
      id: "today-visitors",
      title: "Today's Visitors",
      value: `${data.todayVisitors?.length || 0}`,
      icon: <PiUsersLight className="w-5 h-5 text-gray-700" />,
    },
    {
      id: "upcoming-events",
      title: "Upcoming Events",
      value: `${data.upcomingEvents?.length || 0}`,
      icon: <PiCalendarCheckLight className="w-5 h-5 text-gray-700" />,
    },
  ];

  return (
    <div className="w-full bg-[#e9dcf8] px-6 py-4 flex flex-wrap gap-6 items-center justify-start mt-3">
      {cards.map((card) => (
        <div key={card.id} className="flex items-center gap-3">
          {/* Icon Circle */}
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow">
            {card.icon}
          </div>

          {/* Label & Value */}
          <div className="flex flex-col text-sm">
            <span className="text-gray-600">{card.title}</span>
            <span className="text-primary font-semibold">{card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
