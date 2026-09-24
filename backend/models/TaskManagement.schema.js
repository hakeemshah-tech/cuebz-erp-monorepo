const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Task Title is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Task Description is required."],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Assigned Employee is required."],
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low", "Urgent"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
      required: [true, "Due Date is required."],
    },
    reminder: {
      type: Date,
    },
    reminder_status: {
      type: String,
      enum: ["pending", "sent", "cancelled"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
      required: [true, "Status is required."],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task creator is required."],
    },
    comments: {
      type: String,
      trim: true,
    },
    attachments: [{ type: String }],
  },
  { timestamps: true },
);

taskSchema.index({ reminder_status: 1, dueDate: 1 });
module.exports = mongoose.model("Task", taskSchema);
