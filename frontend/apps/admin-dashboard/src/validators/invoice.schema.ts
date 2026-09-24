import { z } from "zod";

// Define schema for file attachments (either File object or URL)
const fileOrUrlSchema = z.union([
  z.instanceof(File).refine((file) => file.size > 0, {
    message: "Uploaded file cannot be empty.",
  }),
  z.string().url({ message: "Must be a valid URL." }),
]);

export const invoiceSchema = z.object({
  invoice_number: z
    .string()
    .min(1, { message: "Invoice number is required." })
    .max(100, { message: "Invoice number cannot exceed 100 characters." }),

  quotation_id: z
    .string()
    .nonempty({ message: "Quotation reference is required." }),

  invoice_date: z
    .string()
    .nonempty({ message: "Invoice date is required." })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format.",
    }),

  due_date: z
    .string()
    .nonempty({ message: "Due date is required." })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid due date format.",
    }),

  status: z.enum(["Unpaid", "Paid", "Cancelled", "Refunded"], {
    errorMap: () => ({ message: "Invalid status value." }),
  }),

  // payment_receipt: fileOrUrlSchema.optional(),

  // attachments: z
  //   .array(fileOrUrlSchema)
  //   .max(10, { message: "You can upload a maximum of 10 attachments." })
  //   .optional(),
});

// Infer TypeScript types from the schema
export type InvoiceSchema = z.infer<typeof invoiceSchema>;
