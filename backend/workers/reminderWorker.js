// const { Worker, connection } = require("../lib/queue.js");
// const sendEmail = require("../utils/sendEmail");
// const CallLog = require("../models/CallLog.schema");
// const ChequeTracking = require("../models/Checktracker.schema");
// const Visitor = require("../models/Visitor.schema");
// const Task = require("../models/TaskManagement.schema");
// const dbConnection = require("../config/db");

// (async () => {
//   // MongoDB connection
//   await dbConnection();
//   console.log("✅ MongoDB connected – starting reminder worker…");

//   const worker = new Worker(
//     "reminders",
//     async (job) => {
//       const { type, id, email } = job.data;
//       console.log(
//         `Reminder email worker started working for ${type} email ...`,
//       );

//       // Idempotency: if someone updated the doc after we queued the job,
//       // we verify it's still “pending” before emailing.
//       let doc;
//       switch (type) {
//         case "call":
//           doc = await CallLog.findById(id);
//           break;
//         case "cheque":
//           doc = await ChequeTracking.findById(id);
//           break;
//         case "visitor":
//           doc = await Visitor.findById(id);
//           break;
//         case "task":
//           doc = await Task.findById(id);
//           break;
//       }
//       if (!doc || doc.status !== "pending") return;

//       // Build message
//       await sendEmail({
//         to: email,
//         subject: "⏰ Friendly reminder",
//         text: `Hi! This is your reminder for ${type} ${id}.`,
//       });

//       // mark as done so it won’t be re‑queued next scan
//       doc.status = "sent";
//       await doc.save();
//     },
//     {
//       // tweak to fit your infra
//       connection,
//       concurrency: 30,
//       lockDuration: 90_000, // ms, > max expected email latency
//       autorun: true,
//     },
//   );

//   worker.on("completed", (job) => {
//     console.log(`✅ Completed: ${job.id}`);
//   });

//   worker.on("failed", (job, err) => {
//     console.error(`❌ Failed: ${job.id}`, err);
//   });

//   worker.on("error", (err) => {
//     console.error("❌ Worker error:", err);
//   });

//   console.log("📨 Reminder worker started.");
// })();

(async () => {
  const { Worker } = require("../lib/queue");
  const sendEmail = require("../utils/sendEmail");

  const CallLog = require("../models/CallLog.schema");
  const ChequeTracking = require("../models/Checktracker.schema");
  const Visitor = require("../models/Visitor.schema");
  const Task = require("../models/TaskManagement.schema");
  const dbConnection = require("../config/db");
  await dbConnection(); // ⬅️ waits for MongoDB
  console.log("✅ MongoDB connected – starting reminder worker…");

  const worker = new Worker(
    "reminders",
    async (job) => {
      const { type, id, email } = job.data;
      console.log(`📩 Processing ${type}:${id} → ${email}`);

      // 1️⃣ pick the right model
      const modelMap = {
        call: CallLog,
        cheque: ChequeTracking,
        visitor: Visitor,
        task: Task,
      };
      const Model = modelMap[type];
      if (!Model) throw new Error("Unknown type: " + type);

      // 2️⃣ re‑load the document and be sure it’s still pending
      const doc = await Model.findById(id);
      if (!doc) return console.log("⛔ Doc not found, skip");
      if (doc.reminder_status !== "pending") {
        return console.log("⏹ Already handled:", doc.reminder_status);
      }
      if (!email) return console.log("⛔ No e‑mail, skip");

      // 3️⃣ send the mail
      await sendEmail({
        to: email,
        subject: "⏰ Friendly reminder",
        text: `Hi! This is your reminder for ${type} ${id}.`,
      });

      // 4️⃣ mark as sent
      doc.reminder_status = "sent";
      await doc.save();
      console.log(`✅ Marked ${type}:${id} as sent`);
    },
    {
      connection: require("../lib/queue").connection,
      concurrency: 30,
      lockDuration: 90_000,
    },
  );

  worker.on("completed", (job) => console.log(`🎉 Completed ${job.id}`));
  worker.on("failed", (job, err) => console.error(`❌ Failed ${job?.id}`, err));
})();
