// import { z } from "zod";

// const fileOrUrlSchema = z.union([
//   z.instanceof(File).refine((file) => file.size > 0, {
//     message: "Uploaded file cannot be empty.",
//   }),
//   z.string().url({ message: "Must be a valid URL." }),
// ]);

// export const chequeTrackerSchema = z.object({
//   cheque_number: z
//     .string()
//     .min(1, { message: "Cheque number is required." })
//     .max(50, { message: "Cheque number cannot exceed 50 characters." }),
//   cheque_date: z.string().refine((value) => !isNaN(Date.parse(value)), {
//     message: "Cheque date must be a valid date.",
//   }),
//   amount: z.number().min(1, { message: "Amount is required." }),
//   bank_name: z
//     .string()
//     .min(1, { message: "Bank name is required." })
//     .max(100, { message: "Bank name cannot exceed 100 characters." }),
//   payee_name: z
//     .string()
//     .min(1, { message: "Payee name is required." })
//     .max(100, { message: "Payee name cannot exceed 100 characters." }),
//   payer_name: z
//     .string()
//     .min(1, { message: "Payer name is required." })
//     .max(100, { message: "Payer name cannot exceed 100 characters." }),
//   purpose: z
//     .string()
//     .min(1, { message: "Purpose is required." })
//     .max(500, { message: "Purpose cannot exceed 500 characters." }),
//   cheque_status: z.enum(["Issued", "Received", "Cleared", "Bounced"], {
//     message: "Invalid cheque status.",
//   }),
//   reminder_date: z.string().refine((value) => !isNaN(Date.parse(value)), {
//     message: "Reminder date must be a valid date.",
//   }),
//   attachments: z
//     .array(fileOrUrlSchema)
//     .max(10, { message: "You can upload a maximum of 10 attachments." })
//     .optional(),
// });

// // Infer TypeScript types from the schema
// export type ChequeTrackerSchema = z.infer<typeof chequeTrackerSchema>;

import { z } from "zod";

const fileOrUrlSchema = z.union([
  z.instanceof(File).refine((file) => file.size > 0, {
    message: "Uploaded file cannot be empty.",
  }),
  z.string().url({ message: "Must be a valid URL." }),
]);

export const chequeTrackerSchema = z.object({
  cheque_number: z
    .string()
    .min(1, { message: "Cheque number is required." })
    .max(50, { message: "Cheque number cannot exceed 50 characters." }),
  cheque_date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Cheque date must be a valid date.",
  }),
  cheque_type: z.enum(["Incoming", "Outgoing"], {
    message: "Select a valid cheque type.",
  }),
  amount: z
    .number()
    .min(0.01, { message: "Amount must be greater than zero." }),
  bank_name: z
    .string()
    .min(1, { message: "Bank name is required." })
    .max(100, { message: "Bank name cannot exceed 100 characters." }),
  payee_name: z.string().optional(),
  payeer_name: z.string().optional(),
  purpose: z
    .string()
    .min(1, { message: "Purpose is required." })
    .max(500, { message: "Purpose cannot exceed 500 characters." }),
  cheque_status: z.enum(["Issued", "Received", "Cleared", "Bounced"], {
    message: "Invalid cheque status.",
  }),
  reminder_date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Reminder date must be a valid date.",
  }),
  attachments: z
    .array(fileOrUrlSchema)
    .max(10, { message: "You can upload a maximum of 10 attachments." })
    .optional(),
  additional_notes: z
    .string()
    .max(1000, { message: "Additional notes cannot exceed 1000 characters." })
    .optional(),
});

// Infer TypeScript types from the schema
export type ChequeTrackerSchema = z.infer<typeof chequeTrackerSchema>;
