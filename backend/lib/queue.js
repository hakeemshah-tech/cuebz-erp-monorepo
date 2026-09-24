const { Queue, Worker } = require("bullmq");
const connection = require("./bullmqConnection");

new Queue("reminders", { connection });
const reminderQueue = new Queue("reminders", { connection });

module.exports = { reminderQueue, Worker, connection };

// import { Queue, Worker, QueueScheduler } from "bullmq";
// import connection from "./bullmqConnection.js";

// new QueueScheduler("reminders", { connection });
// const reminderQueue = new Queue("reminders", { connection });

// export { reminderQueue, Worker, connection };
