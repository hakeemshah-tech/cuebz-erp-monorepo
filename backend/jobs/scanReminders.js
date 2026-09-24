/**
 * Runs every minute, finds docs whose reminder_* field
 * is <= now and status === "pending", then enqueues one job per doc.
 * Uses jobId = collectionName:docId to guarantee de‑duplication.
 */

const cron = require("node-cron");
const { reminderQueue } = require("../lib/queue.js");
const CallLog = require("../models/CallLog.schema");
const ChequeTracking = require("../models/Checktracker.schema");
const Visitor = require("../models/Visitor.schema");
const Task = require("../models/TaskManagement.schema");

function startReminderCron() {
  // runs every 1 minute, "* * * * *"
  //runs once
  //2:00 AM IST (which is 8:30 PM UTC), "30 20 * * *"
  cron.schedule("30 20 * * *", async () => {
    console.log("🕒 Running reminder check...");

    const now = new Date();
    // up to 4 queries run in parallel
    const [calls, cheques, visitors, tasks] = await Promise.all([
      CallLog.find({
        reminder_action_date: { $lte: now },
        reminder_status: "pending",
      }).populate({
        path: "tenant_id",
        populate: { path: "tenant_owner", select: "email" },
      }),

      ChequeTracking.find({
        reminder_date: { $lte: now },
        reminder_status: "pending",
      }).populate("createdBy", "email"),

      Visitor.find({
        reminder_action_date: { $lte: now },
        reminder_status: "pending",
      }).populate({
        path: "tenant_id",
        populate: { path: "tenant_owner", select: "email" },
      }),

      Task.find({
        dueDate: { $lte: now },
        reminder_status: "pending",
      }).populate("createdBy", "email"),
    ]);

    const docs = [
      ...calls.map((d) => ({
        type: "call",
        id: d._id,
        email: d.tenant_id?.tenant_owner?.email, // call → tenant → user
      })),
      ...cheques.map((d) => ({
        type: "cheque",
        id: d._id,
        email: d.createdBy?.email,
      })),
      ...visitors.map((d) => ({
        type: "visitor",
        id: d._id,
        email: d.tenant_id?.tenant_owner?.email, // visitor → tenant → user
      })),
      ...tasks.map((d) => ({
        type: "task",
        id: d._id,
        email: d.createdBy?.email,
      })),
    ];

    const filteredDocs = docs.filter((d) => !!d.email);

    await Promise.all(
      filteredDocs.map((doc) =>
        reminderQueue.add("sendReminder", doc, {
          // jobId: `${doc.type}:${doc.id}`, // prevents duplicates
          removeOnComplete: 1000,
          removeOnFail: 500,
        }),
      ),
    );

    const waiting = await reminderQueue.getWaiting();
    const active = await reminderQueue.getActive();
    const completed = await reminderQueue.getCompleted();
    const failed = await reminderQueue.getFailed();

    console.log("Waiting jobs:", waiting.length);
    console.log("Active jobs:", active.length);
    console.log("Completed jobs:", completed.length);
    console.log("Failed jobs:", failed.length);
  });

  console.log("✅ Reminder cron job scheduled.");
}

module.exports = startReminderCron;
