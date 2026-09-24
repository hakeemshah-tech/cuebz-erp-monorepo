export type TaskType = {
  _id: string; // Unique identifier for the task
  title: string; // Task title or name
  description: string; // Task description
  assignedTo: {
    _id: string; // Employee ID
    full_name: string; // Employee's full name
    email: string; // Employee's email address
  } | null; // Employee assigned to the task
  priority: "High" | "Medium" | "Low" | "Urgent"; // Priority of the task
  dueDate: string; // Due date of the task (ISO 8601 string)
  status: "Pending" | "In Progress" | "Completed"; // Task status
  createdBy: {
    _id: string; // Creator's ID
    full_name: string; // Creator's full name
    email: string; // Creator's email address
  }; // User who created the task
  comments?: string; // Optional comments or notes for the task
  attachments?: string[]; // URLs of attachments related to the task
  tenant_id: string; // Tenant ID associated with the task
  organization_id: string; // Organization ID associated with the task
  createdAt: string; // Task creation date (ISO 8601 string)
  updatedAt: string; // Task last updated date (ISO 8601 string)
};
