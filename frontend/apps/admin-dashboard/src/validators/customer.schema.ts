import { z } from "zod";

// Customer Schema Validation
export const customerSchema = z.object({
  full_name: z
    .string()
    .min(1, { message: "Full name is required." })
    .max(150, { message: "Full name cannot exceed 150 characters." }),

  email: z.string().email({ message: "Invalid email address." }).optional(),

  phone_number: z.string().regex(/^[0-9]{10,15}$/, {
    message: "Phone number must be between 10 and 15 digits.",
  }),

  date_of_birth: z
    .any()
    // .refine((value) => !value || !isNaN(Date.parse(value)), {
    //   message: "Date of birth must be a valid date.",
    // })
    .optional(),

  customer_type: z.enum(["Individual", "Business"], {
    errorMap: () => ({ message: "Customer type is invalid." }),
  }),

  organization_name: z
    .string()
    .max(150, { message: "Organization name cannot exceed 150 characters." })
    .optional(),

  address: z
    .object({
      street: z
        .string()
        .max(255, { message: "Street cannot exceed 255 characters." })
        .optional(),
      city: z
        .string()
        .max(100, { message: "City cannot exceed 100 characters." })
        .optional(),
      state: z
        .string()
        .max(100, { message: "State cannot exceed 100 characters." })
        .optional(),
      postal_code: z
        .string()
        .max(20, { message: "Postal code cannot exceed 20 characters." })
        .optional(),
      country: z
        .string()
        .max(100, { message: "Country cannot exceed 100 characters." })
        .optional(),
    })
    .optional(),

  // assigned_to: z.string().optional(),

  notes: z
    .string()
    .max(1000, { message: "Notes cannot exceed 1000 characters." })
    .optional(),
});

// Infer TypeScript types from the schema
export type CustomerSchema = z.infer<typeof customerSchema>;
