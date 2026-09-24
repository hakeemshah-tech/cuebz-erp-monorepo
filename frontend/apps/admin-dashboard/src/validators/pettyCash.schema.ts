import { z } from "zod";

// const fileOrUrlSchema = z.union([
//   z.instanceof(File).refine((file) => file.size > 0, {
//     message: "Uploaded file cannot be empty.",
//   }),
//   z.string().url({ message: "Must be a valid URL." }),
// ]);

export const pettyCashSchema = z.object({
  transaction_type: z.enum(["Add", "Expense"], {
    message: "Transaction type is invalid.",
  }),
  transaction_date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Transaction date must be a valid date.",
  }),
  amount: z
    .number()
    .min(0.01, { message: "Amount must be greater than zero." }),
  purpose: z
    .string()
    .min(1, { message: "Purpose is required." })
    .max(500, { message: "Purpose cannot exceed 500 characters." }),
  remarks: z
    .string()
    .max(500, { message: "Remarks cannot exceed 500 characters." })
    .optional(),
  // attachments: z
  //   .array(fileOrUrlSchema)
  //   .max(10, { message: "You can upload a maximum of 10 attachments." })
  //   .optional(),
});

export type PettyCashSchema = z.infer<typeof pettyCashSchema>;
