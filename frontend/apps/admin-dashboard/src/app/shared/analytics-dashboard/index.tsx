// import WebsiteMetrics from '@/app/shared/analytics-dashboard/website-metrics';
// import AccountRetention from '@/app/shared/analytics-dashboard/account-retention';
// import Acquisition from '@/app/shared/analytics-dashboard/acquisition';
// import ConversionRates from '@/app/shared/analytics-dashboard/conversion-rates';
// import DeviceSessions from '@/app/shared/analytics-dashboard/device-sessions';
// import GoalAccomplished from '@/app/shared/analytics-dashboard/goal-accomplished';
// import StatCards from '@/app/shared/analytics-dashboard/stat-cards';
// import TopTrafficSource from '@/app/shared/analytics-dashboard/top-traffic-source';
// import UserMetrics from '@/app/shared/analytics-dashboard/user-metrics';
// import PageMetrics from '@/app/shared/analytics-dashboard/page-metric';

// export default function AnalyticsDashboard() {
//   return (
//     <div className="@container">
//       <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
//         <StatCards className="grid-cols-1 @xl:grid-cols-2 @4xl:col-span-2 @6xl:grid-cols-4 @7xl:col-span-12" />

//         <Acquisition className="@7xl:col-span-4" />

//         <DeviceSessions className="@7xl:col-span-4" />

//         <TopTrafficSource className="@7xl:col-span-4" />

//         <UserMetrics className="@4xl:col-span-2 @7xl:col-span-12" />

//         <ConversionRates className="@7xl:col-span-6 @[90rem]:col-span-7 @[112rem]:col-span-8" />

//         <GoalAccomplished className="@4xl:col-start-2 @4xl:row-start-3 @7xl:col-span-6 @7xl:col-start-auto @7xl:row-start-auto @[90rem]:col-span-5 @[112rem]:col-span-4" />

//         <PageMetrics className="@4xl:col-span-2 @4xl:row-start-5 @7xl:col-span-12 @7xl:row-start-auto @[90rem]:col-span-7 @[112rem]:col-span-8" />

//         <AccountRetention className="@7xl:col-span-12 @[90rem]:col-span-5 @[112rem]:col-span-4" />

//         <WebsiteMetrics className="@4xl:col-span-2 @7xl:col-span-12" />
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import analyticsService from "@/services/analyticsService";
import StatCards from "@/app/shared/analytics-dashboard/stat-cards";

import LeadConversionChart from "./LeadConversionChart";
import InvoiceStatusChart from "./InvoiceStatusChart";
import ExpandableSection from "./ExpandableSection";
import RecentTransactionsTable from "./RecentTransactionsTable";
import ActiveLeadsTable from "./ActiveLeadsTable";
import TaskStatusChart from "./TaskStatusChart";
import TopOverdueTasks from "./TopOverdueTasks";
import WorkspaceAlerts from "./WorkspaceAlerts";
import { Loader } from "rizzui";
import WeeklyCashFlowChart from "./WeeklyCashFlowChart";

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    analyticsService.getAnalytics().then(setAnalyticsData);
  }, []);

  if (!analyticsData)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" color="primary" />
      </div>
    );

  const sampleLeadConversionData = {
    new: 20,
    contacted: 30,
    won: 60,
    total: 110, // Sum of all above
    conversionRate: (60 / 110) * 100, // 54.55
  };

  const invoiceData = {
    Paid: 120,
    Unpaid: 45,
    // Cancelled: 15,
    // Refunded: 20,
  };

  const weeklyCashFlowData = [
    { _id: "2025-06-23", totalAdd: 1500, totalExpense: 800 },
    { _id: "2025-06-30", totalAdd: 1000, totalExpense: 1200 },
    { _id: "2025-07-07", totalAdd: 1800, totalExpense: 900 },
    { _id: "2025-07-14", totalAdd: 1300, totalExpense: 1500 },
    { _id: "2025-07-21", totalAdd: 2000, totalExpense: 1700 },
  ];

  return (
    <div className="@container">
      <StatCards
        data={analyticsData.topSection}
        // className="@container col-span-full"
      />
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 3xl:gap-8 mt-4">
          {/* <LeadConversionChart data={analyticsData.topSection.leads} /> */}
          <LeadConversionChart
            data={sampleLeadConversionData}
            className="border-0 shadow-md"
          />
          {/* <InvoiceStatusChart data={analyticsData.topSection.invoices} /> */}
          <InvoiceStatusChart
            data={invoiceData}
            className="border-0 shadow-md"
          />
          {/* <WeeklyCashFlowChart
            data={analyticsData.bottomSection.financeTracker.weeklyFlow}
          /> */}
          <WeeklyCashFlowChart
            data={weeklyCashFlowData}
            className="border-0 shadow-md"
          />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-5">
          <RecentTransactionsTable
            data={analyticsData.bottomSection.financeTracker.recentTransactions}
          />

          <ActiveLeadsTable
            data={analyticsData.bottomSection.salesHub.activeLeads}
          />
        </div>
      </div>

      {/* <ExpandableSection title="Finance Tracker"> */}

      {/* 
      <ExpandableSection title="Sales Hub">
        
      </ExpandableSection> */}

      {/* <ExpandableSection title="Team & Tasks">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TaskStatusChart
            data={analyticsData.bottomSection.teamTasks.taskStatus}
          />
          <TopOverdueTasks
            data={analyticsData.bottomSection.teamTasks.topOverdue}
          />
        </div>
      </ExpandableSection> */}

      {/* <ExpandableSection title="Workspace Alerts">
        <WorkspaceAlerts data={analyticsData.bottomSection.workspaceAlerts} />
      </ExpandableSection> */}
    </div>
  );
}

// import Acquisition from "@/app/shared/analytics-dashboard/acquisition";
// import DeviceSessions from "@/app/shared/analytics-dashboard/device-sessions";
// import TopTrafficSource from "@/app/shared/analytics-dashboard/top-traffic-source";
// import UserMetrics from "@/app/shared/analytics-dashboard/user-metrics";
// import ConversionRates from "@/app/shared/analytics-dashboard/conversion-rates";
// import GoalAccomplished from "@/app/shared/analytics-dashboard/goal-accomplished";
// import PageMetrics from "@/app/shared/analytics-dashboard/page-metric";
// import AccountRetention from "@/app/shared/analytics-dashboard/account-retention";
// import WebsiteMetrics from "@/app/shared/analytics-dashboard/website-metrics";
// import WeeklyCashFlowChart from "./WeeklyCashFlowChart";

{
  /* <div className="grid grid-cols-1 xl:grid-cols-2 gap-6"> */
}
{
  /* <WeeklyCashFlowChart
          data={analyticsData.bottomSection.financeTracker.weeklyFlow}
        /> */
}
{
  /* 
        <ExpandableSection title="Finance Tracker">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <WeeklyCashFlowChart
              data={analyticsData.bottomSection.financeTracker.weeklyFlow}
            />
            <RecentTransactionsTable
              data={
                analyticsData.bottomSection.financeTracker.recentTransactions
              }
            />
          </div>
        </ExpandableSection>

        <ExpandableSection title="Sales Hub">
          <ActiveLeadsTable
            data={analyticsData.bottomSection.salesHub.activeLeads}
          />
        </ExpandableSection>

        <ExpandableSection title="Team & Tasks">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TaskStatusChart
              data={analyticsData.bottomSection.teamTasks.taskStatus}
            />
            <TopOverdueTasks
              data={analyticsData.bottomSection.teamTasks.topOverdue}
            />
          </div>
        </ExpandableSection>

        <ExpandableSection title="Workspace Alerts">
          <WorkspaceAlerts data={analyticsData.bottomSection.workspaceAlerts} />
        </ExpandableSection> */
}

{
  /* <GoalAccomplished
          data={analyticsData.bottomSection.teamTasks.topOverdue}
          className="@4xl:col-start-2 @4xl:row-start-3 @7xl:col-span-6 @7xl:col-start-auto @7xl:row-start-auto @[90rem]:col-span-5 @[112rem]:col-span-4"
        /> */
}

{
  /* <Acquisition
          data={analyticsData.bottomSection.salesHub.activeLeads}
          className="@7xl:col-span-4"
        /> */
}
{
  /* <DeviceSessions
          data={analyticsData.bottomSection.teamTasks.taskStatus}
          className="@7xl:col-span-4"
        />
        <TopTrafficSource
          data={analyticsData.topSection.leads}
          className="@7xl:col-span-4"
        />

        <UserMetrics
          data={analyticsData.topSection.tasks}
          className="@4xl:col-span-2 @7xl:col-span-12"
        />
        <ConversionRates
          data={analyticsData.topSection.invoices}
          className="@7xl:col-span-6 @[90rem]:col-span-7 @[112rem]:col-span-8"
        />
        <GoalAccomplished
          data={analyticsData.bottomSection.teamTasks.topOverdue}
          className="@4xl:col-start-2 @4xl:row-start-3 @7xl:col-span-6 @7xl:col-start-auto @7xl:row-start-auto @[90rem]:col-span-5 @[112rem]:col-span-4"
        />

        <PageMetrics
          data={analyticsData.bottomSection.financeTracker.recentTransactions}
          className="@4xl:col-span-2 @4xl:row-start-5 @7xl:col-span-12 @7xl:row-start-auto @[90rem]:col-span-7 @[112rem]:col-span-8"
        />
        <AccountRetention
          data={analyticsData.bottomSection.financeTracker.weeklyFlow}
          className="@7xl:col-span-12 @[90rem]:col-span-5 @[112rem]:col-span-4"
        />
        <WebsiteMetrics
          data={analyticsData.bottomSection.workspaceAlerts}
          className="@4xl:col-span-2 @7xl:col-span-12"
        /> */
}
