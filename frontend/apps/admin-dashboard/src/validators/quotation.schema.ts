import { z } from "zod";

// Define schema for file attachments (either File object or URL)
const fileOrUrlSchema = z.union([
  z.instanceof(File).refine((file) => file.size > 0, {
    message: "Uploaded file cannot be empty.",
  }),
  z.string().url({ message: "Must be a valid URL." }),
]);

export const quotationSchema = z.object({
  proposal_number: z
    .string()
    .min(1, { message: "Proposal number is required." })
    .max(100, { message: "Proposal number cannot exceed 100 characters." }),

  customer_id: z
    .string()
    .nonempty({ message: "Customer is required." })
    .optional(), // Optional since some quotations may not be linked to leads

  proposal_date: z
    .string()
    .nonempty({ message: "Proposal date is required." })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format.",
    }),

  proposal_expiry_date: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid expiry date format.",
    }),

  proposal_title: z
    .string()
    .min(1, { message: "Proposal title is required." })
    .max(200, { message: "Proposal title cannot exceed 200 characters." }),

  proposal_details: z
    .string()
    .min(1, { message: "Proposal details are required." })
    .max(1000, { message: "Proposal details cannot exceed 1000 characters." }),

  items: z
    .array(
      z.object({
        item_name: z
          .string()
          .min(1, { message: "Item name is required." })
          .max(100, { message: "Item name cannot exceed 100 characters." }),
        description: z
          .string()
          .max(500, { message: "Description cannot exceed 500 characters." })
          .optional(),
        quantity: z
          .number()
          .min(1, { message: "Quantity must be at least 1." }),
        unit_price: z
          .number()
          .min(0, { message: "Unit price cannot be negative." }),
        total_price: z
          .number()
          .min(0, { message: "Total price cannot be negative." }),
      })
    )
    .min(1, { message: "At least one item is required in the quotation." }),

  subtotal: z
    .number()
    .min(0, { message: "Subtotal must be a positive value." }),

  vat: z.number().default(0).optional(),

  total_amount: z
    .number()
    .min(0, { message: "Total amount must be a positive value." }),

  payment_terms: z.string().min(1, { message: "Payment terms are required." }),

  status: z
    .enum(["Draft", "Sent", "Accepted", "Rejected"], {
      errorMap: () => ({ message: "Invalid status value." }),
    })
    .optional(),

  comments: z
    .string()
    .max(1000, { message: "Comments cannot exceed 1000 characters." })
    .optional(),

  attachments: z
    .array(fileOrUrlSchema)
    .max(10, { message: "You can upload a maximum of 10 attachments." })
    .optional(),

  termsCondition: z
    .string()
    .min(1, { message: "Terms and conditions are required." }),
});

// Infer TypeScript types from the schema
export type QuotationSchema = z.infer<typeof quotationSchema>;
