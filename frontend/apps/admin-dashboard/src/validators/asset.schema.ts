import { z } from "zod";

// Asset Schema Validation
export const assetSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Asset name is required." })
    .max(100, { message: "Asset name cannot exceed 100 characters." }),

  category: z
    .string()
    .min(1, { message: "Asset type is required." })
    .max(100, { message: "Asset type cannot exceed 100 characters." }),

  serial_number: z
    .string()
    .min(1, { message: "Serial number is required." })
    .max(50, { message: "Serial number cannot exceed 50 characters." }),

  purchase_date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Purchase date must be a valid date.",
  }),

  warranty_expiration: z
    .string()
    .refine((value) => !value || !isNaN(Date.parse(value)), {
      message: "Warranty expiry date must be a valid date.",
    })
    .optional(), // Optional field

  assigned_to: z
    .string()
    .max(100, { message: "Assigned to cannot exceed 100 characters." })
    .optional(), // Optional field

  //   condition: z.enum(["New", "Good", "Fair", "Needs Repair", "Retired"], {
  //     errorMap: () => ({ message: "Condition is invalid." }),
  //   }),

  status: z.enum(["Available", "In Use", "Under Maintenance", "Retired"], {
    errorMap: () => ({ message: "Status is invalid." }),
  }),

  notes: z
    .string()
    .max(500, { message: "Notes cannot exceed 500 characters." })
    .optional(), // Optional field
});

// Infer TypeScript types from the schema
export type AssetSchema = z.infer<typeof assetSchema>;
