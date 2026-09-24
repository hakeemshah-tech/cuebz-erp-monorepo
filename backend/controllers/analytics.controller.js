// // analytics.controller.js
// const PettyCash = require("../models/PettyCash.schema");
// const Task = require("../models/TaskManagement.schema");
// const Cheque = require("../models/Checktracker.schema");
// const Lead = require("../models/Lead.schema");
// const Invoice = require("../models/invoice.schema");
// const Credential = require("../models/credientials.schema");
// const { default: mongoose } = require("mongoose");

// exports.getAnalyticsOverview = async (req, res, next) => {
//   try {
//     const { tenant_id, selectedOrganization } = req.user;

//     // 1. Petty Cash Balance
//     const pettyCashData = await PettyCash.find({
//       tenant_id,
//       organization_id: selectedOrganization,
//     });
//     const cashIn = pettyCashData
//       .filter((t) => t.transaction_type === "Add")
//       .reduce((sum, t) => sum + t.amount, 0);
//     const cashOut = pettyCashData
//       .filter((t) => t.transaction_type === "Expense")
//       .reduce((sum, t) => sum + t.amount, 0);
//     const pettyCashBalance = cashIn - cashOut;

//     // 3. Tasks - Overdue and Completion Rate
//     const overdueTasks = await Task.find({
//       tenant_id,
//       organization_id: selectedOrganization,
//       status: { $ne: "Completed" },
//       dueDate: { $lt: new Date() },
//     });
//     const allTasksCount = await Task.countDocuments({
//       tenant_id,
//       organization_id: selectedOrganization,
//     });
//     const completedTasks = await Task.countDocuments({
//       tenant_id,
//       organization_id: selectedOrganization,
//       status: "Completed",
//     });
//     const taskCompletionRate = allTasksCount
//       ? (completedTasks / allTasksCount) * 100
//       : 0;

//     // 4. Cheques - Upcoming in 7 days
//     const today = new Date();
//     const upcomingCheques = await Cheque.find({
//       tenant_id,
//       organization_id: selectedOrganization,
//       cheque_date: {
//         $gte: today,
//         $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
//       },
//     }).select("cheque_date amount payee_name cheque_status");

//     // 5. Lead Conversion Rate
//     const leads = await Lead.find({
//       tenant_id,
//       organization_id: selectedOrganization,
//     });
//     const newLeads = leads.filter((l) => l.lead_status === "New").length;
//     const contactedLeads = leads.filter(
//       (l) => l.lead_status === "Contacted",
//     ).length;
//     const wonLeads = leads.filter((l) => l.lead_status === "Won").length;
//     const leadConversionRate = leads.length
//       ? (wonLeads / leads.length) * 100
//       : 0;

//     // 6. Invoices by Status

//     const invoiceStats = await Invoice.aggregate([
//       {
//         $match: {
//           tenant_id: new mongoose.Types.ObjectId(tenant_id),
//           organization_id: new mongoose.Types.ObjectId(selectedOrganization),
//         },
//       },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//         },
//       },
//     ]);

//     const defaultStatuses = ["Unpaid", "Paid", "Cancelled", "Refunded"];

//     const invoiceSummary = defaultStatuses.reduce((acc, status) => {
//       const match = invoiceStats.find((s) => s._id === status);
//       acc[status] = match ? match.count : 0;
//       return acc;
//     }, {});

//     // 7. Credentials Count
//     const credentialCount = await Credential.countDocuments({
//       tenant_id,
//       organization_id: selectedOrganization,
//     });

//     // 8. Weekly Petty Cash Flow (Bar Graph Data)
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
//     const weeklyPettyCash = await PettyCash.aggregate([
//       {
//         $match: {
//           tenant_id,
//           organization_id: selectedOrganization,
//           transaction_date: { $gte: oneWeekAgo },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%d-%m-%Y", date: "$transaction_date" },
//           },
//           totalAdd: {
//             $sum: {
//               $cond: [{ $eq: ["$transaction_type", "Add"] }, "$amount", 0],
//             },
//           },
//           totalExpense: {
//             $sum: {
//               $cond: [{ $eq: ["$transaction_type", "Expense"] }, "$amount", 0],
//             },
//           },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     // 9. Recent Transactions Table (latest 10)
//     const recentTransactions = await PettyCash.find({
//       tenant_id,
//       organization_id: selectedOrganization,
//     })
//       .sort({ transaction_date: -1 })
//       .limit(10);

//     // 10. Active Leads Table
//     const activeLeads = await Lead.find({
//       tenant_id,
//       organization_id: selectedOrganization,
//       lead_status: { $in: ["New", "Contacted", "Qualified", "Proposal Sent"] },
//     })
//       .sort({ updatedAt: -1 })
//       .limit(10);

//     // 11. Top 5 Overdue Tasks
//     const topOverdueTasks = await Task.find({
//       tenant_id,
//       organization_id: selectedOrganization,
//       status: { $ne: "Completed" },
//       dueDate: { $lt: new Date() },
//     })
//       .sort({ dueDate: 1 })
//       .limit(5);

//     res.status(200).json({
//       topSection: {
//         pettyCash: { balance: pettyCashBalance },
//         // documentRenewals: { count: expiringDocsCount },
//         tasks: {
//           overdueCount: overdueTasks.length,
//           completionRate: taskCompletionRate,
//         },
//         cheques: { upcoming: upcomingCheques },
//         leads: {
//           total: leads.length,
//           new: newLeads,
//           contacted: contactedLeads,
//           won: wonLeads,
//           conversionRate: leadConversionRate,
//         },
//         invoices: invoiceSummary,
//         credentials: { count: credentialCount },
//       },
//       bottomSection: {
//         financeTracker: {
//           weeklyFlow: weeklyPettyCash,
//           recentTransactions,
//         },
//         salesHub: {
//           activeLeads,
//         },
//         teamTasks: {
//           taskStatus: {
//             pending: allTasksCount - completedTasks,
//             completed: completedTasks,
//           },
//           topOverdue: topOverdueTasks,
//         },
//         workspaceAlerts: {
//           credentials: credentialCount,
//           assetMaintenance: 0, // Placeholder until asset data is connected
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// analytics.controller.js
const PettyCash = require("../models/PettyCash.schema");
const Task = require("../models/TaskManagement.schema");
const Cheque = require("../models/Checktracker.schema");
const Lead = require("../models/Lead.schema");
const Invoice = require("../models/invoice.schema");
const Credential = require("../models/credientials.schema");
const Visitor = require("../models/Visitor.schema");
const CallLog = require("../models/CallLog.schema");
const EventCalendar = require("../models/eventCalendar.schema");
const { default: mongoose } = require("mongoose");

exports.getAnalyticsOverview = async (req, res, next) => {
  try {
    const { tenant_id, selectedOrganization } = req.user;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. Petty Cash Balance
    const pettyCashData = await PettyCash.find({
      tenant_id,
      organization_id: selectedOrganization,
    });
    const cashIn = pettyCashData
      .filter((t) => t.transaction_type === "Add")
      .reduce((sum, t) => sum + t.amount, 0);
    const cashOut = pettyCashData
      .filter((t) => t.transaction_type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const pettyCashBalance = cashIn - cashOut;

    // 3. Tasks - Overdue and Completion Rate
    const overdueTasks = await Task.find({
      tenant_id,
      organization_id: selectedOrganization,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });
    const allTasksCount = await Task.countDocuments({
      tenant_id,
      organization_id: selectedOrganization,
    });
    const completedTasks = await Task.countDocuments({
      tenant_id,
      organization_id: selectedOrganization,
      status: "Completed",
    });
    const taskCompletionRate = allTasksCount
      ? (completedTasks / allTasksCount) * 100
      : 0;

    // 4. Cheques - Upcoming in 7 days
    const today = new Date();
    const upcomingCheques = await Cheque.find({
      tenant_id,
      organization_id: selectedOrganization,
      cheque_date: {
        $gte: today,
        $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    }).select("cheque_date amount payee_name cheque_status");

    // 5. Lead Conversion Rate
    const leads = await Lead.find({
      tenant_id,
      organization_id: selectedOrganization,
    });
    const newLeads = leads.filter((l) => l.lead_status === "New").length;
    const contactedLeads = leads.filter(
      (l) => l.lead_status === "Contacted",
    ).length;
    const wonLeads = leads.filter((l) => l.lead_status === "Won").length;
    const leadConversionRate = leads.length
      ? (wonLeads / leads.length) * 100
      : 0;

    // 6. Invoices by Status
    const invoiceStats = await Invoice.aggregate([
      {
        $match: {
          tenant_id: new mongoose.Types.ObjectId(tenant_id),
          organization_id: new mongoose.Types.ObjectId(selectedOrganization),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const defaultStatuses = ["Unpaid", "Paid", "Cancelled", "Refunded"];
    const invoiceSummary = defaultStatuses.reduce((acc, status) => {
      const match = invoiceStats.find((s) => s._id === status);
      acc[status] = match ? match.count : 0;
      return acc;
    }, {});

    // 7. Credentials Count
    const credentialCount = await Credential.countDocuments({
      tenant_id,
      organization_id: selectedOrganization,
    });

    // 8. Weekly Petty Cash Flow
    // const oneWeekAgo = new Date();
    // oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

    // const startDate = new Date();
    // startDate.setHours(0, 0, 0, 0);
    // startDate.setDate(startDate.getDate() - 6);

    // const endDate = new Date();
    // endDate.setHours(23, 59, 59, 999);

    // const weeklyPettyCash = await PettyCash.aggregate([
    //   {
    //     $match: {
    //       tenant_id,
    //       organization_id: selectedOrganization,
    //       transaction_date: {
    //         $gte: startDate,
    //         $lte: endDate,
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         $dateToString: { format: "%d-%b-%Y", date: "$transaction_date" },
    //       },
    //       totalAdd: {
    //         $sum: {
    //           $cond: [{ $eq: ["$transaction_type", "Add"] }, "$amount", 0],
    //         },
    //       },
    //       totalExpense: {
    //         $sum: {
    //           $cond: [{ $eq: ["$transaction_type", "Expense"] }, "$amount", 0],
    //         },
    //       },
    //     },
    //   },
    //   { $sort: { _id: 1 } },
    // ]);

    // const today = new Date();
    today.setHours(23, 59, 59, 999);

    const weekStart = new Date();
    weekStart.setDate(today.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    console.log("Weekly Cash Start Date:", weekStart);
    console.log("Weekly Cash End Date:", today);

    const weeklyPettyCash = await PettyCash.aggregate([
      {
        $match: {
          tenant_id: new mongoose.Types.ObjectId(tenant_id),
          organization_id: new mongoose.Types.ObjectId(selectedOrganization),
          transaction_date: {
            $gte: weekStart,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%d-%b-%Y", date: "$transaction_date" }, // e.g., 31-May-2025
          },
          totalAdd: {
            $sum: {
              $cond: [{ $eq: ["$transaction_type", "Add"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$transaction_type", "Expense"] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // const weeklyPettyCash = await PettyCash.aggregate([
    //   {
    //     $match: {
    //       tenant_id,
    //       organization_id: selectedOrganization,
    //       transaction_date: { $gte: oneWeekAgo },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         $dateToString: { format: "%d-%m-%Y", date: "$transaction_date" },
    //       },
    //       totalAdd: {
    //         $sum: {
    //           $cond: [{ $eq: ["$transaction_type", "Add"] }, "$amount", 0],
    //         },
    //       },
    //       totalExpense: {
    //         $sum: {
    //           $cond: [{ $eq: ["$transaction_type", "Expense"] }, "$amount", 0],
    //         },
    //       },
    //     },
    //   },
    //   { $sort: { _id: 1 } },
    // ]);

    // 9. Recent Transactions
    const recentTransactions = await PettyCash.find({
      tenant_id,
      organization_id: selectedOrganization,
    })
      .sort({ transaction_date: -1 })
      .limit(10);

    // 10. Active Leads
    const activeLeads = await Lead.find({
      tenant_id,
      organization_id: selectedOrganization,
      lead_status: { $in: ["New", "Contacted", "Qualified", "Proposal Sent"] },
    })
      .sort({ updatedAt: -1 })
      .limit(10);

    // 11. Top Overdue Tasks
    const topOverdueTasks = await Task.find({
      tenant_id,
      organization_id: selectedOrganization,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    })
      .sort({ dueDate: 1 })
      .limit(5);

    // 12. Today's Visitors
    const todayVisitors = await Visitor.find({
      tenant_id,
      organization_id: selectedOrganization,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    // 13. Today's Call Logs
    const todayCalls = await CallLog.find({
      tenant_id,
      organization_id: selectedOrganization,
      date_time: { $gte: todayStart, $lte: todayEnd },
    });

    // 14. Upcoming Events (within next 7 days)
    const upcomingEvents = await EventCalendar.find({
      tenant_id,
      organization_id: selectedOrganization,
      date: {
        $gte: today,
        $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({
      topSection: {
        pettyCash: { balance: pettyCashBalance },
        tasks: {
          overdueCount: overdueTasks.length,
          completionRate: taskCompletionRate,
        },
        cheques: { upcoming: upcomingCheques },
        leads: {
          total: leads.length,
          new: newLeads,
          contacted: contactedLeads,
          won: wonLeads,
          conversionRate: leadConversionRate,
        },
        invoices: invoiceSummary,
        credentials: { count: credentialCount },
        todayVisitors: todayVisitors,
        todayCalls: todayCalls,
        upcomingEvents: upcomingEvents,
      },
      bottomSection: {
        financeTracker: {
          weeklyFlow: weeklyPettyCash,
          recentTransactions,
        },
        salesHub: {
          activeLeads,
        },
        teamTasks: {
          taskStatus: {
            pending: allTasksCount - completedTasks,
            completed: completedTasks,
          },
          topOverdue: topOverdueTasks,
        },
        workspaceAlerts: {
          credentials: credentialCount,
          assetMaintenance: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
