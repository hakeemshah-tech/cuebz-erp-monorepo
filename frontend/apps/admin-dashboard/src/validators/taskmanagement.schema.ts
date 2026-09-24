import { z } from "zod";

const fileOrUrlSchema = z.union([
  z.instanceof(File).refine((file) => file.size > 0, {
    message: "Uploaded file cannot be empty.",
  }),
  z.string().url({ message: "Must be a valid URL." }),
]);

export const taskManagementSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Task title is required." })
    .max(200, { message: "Task title cannot exceed 200 characters." }),
  description: z
    .string()
    .min(1, { message: "Task description is required." })
    .max(1000, { message: "Task description cannot exceed 1000 characters." }),
  assignedTo: z.string().min(1, { message: "Assigned employee is required." }),
  priority: z
    .enum(["High", "Medium", "Low", "Urgent"], {
      message: "Priority must be either 'High', 'Medium', 'Urgent' or 'Low'.",
    })
    .default("Medium"),
  dueDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Due date must be a valid date.",
  }),
  status: z
    .enum(["Pending", "In Progress", "Completed"], {
      message:
        "Status must be either 'Pending', 'In Progress', or 'Completed'.",
    })
    .default("Pending"),
  attachments: z
    .array(fileOrUrlSchema)
    .max(10, { message: "You can upload a maximum of 10 attachments." })
    .optional(),
});

// Infer TypeScript types from the schema
export type TaskManagementSchema = z.infer<typeof taskManagementSchema>;
