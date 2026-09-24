import { z } from "zod";

// Lead Schema Validation
export const leadSchema = z.object({
  lead_source: z
    .string()
    .min(1, { message: "Lead source is required." })
    .max(150, { message: "Lead source cannot exceed 100 characters." }),

  lead_identifier_name: z
    .string()
    .min(1, { message: "Lead Identifier is required." })
    .max(150, { message: "Lead source cannot exceed 100 characters." }),

  company_name: z
    .string()
    .max(150, { message: "Company name cannot exceed 150 characters." })
    .optional(),

  contact_person: z
    .string()
    .min(1, { message: "Contact person is required." })
    .max(100, { message: "Contact person cannot exceed 100 characters." }),

  contact_number: z
    .string()
    .min(7, { message: "Contact number must be at least 7 digits." })
    .max(15, { message: "Contact number cannot exceed 15 digits." })
    .regex(/^[0-9]+$/, { message: "Contact number must contain only digits." }),

  email: z
    .string()
    .min(1, { message: "Email address is required." })
    .email({ message: "Invalid email address format." }),

  address: z
    .object({
      street: z
        .string()
        .max(255, { message: "Street address cannot exceed 255 characters." })
        .optional(),
      city: z
        .string()
        .max(100, { message: "City name cannot exceed 100 characters." })
        .optional(),
      state: z
        .string()
        .max(100, { message: "State name cannot exceed 100 characters." })
        .optional(),
      postal_code: z
        .string()
        .max(20, { message: "Postal code cannot exceed 20 characters." })
        .optional(),
      country: z
        .string()
        .max(100, { message: "Country name cannot exceed 100 characters." })
        .default("UAE")
        .optional(),
    })
    .optional(),

  lead_status: z.enum(
    ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"],
    {
      errorMap: () => ({ message: "Lead status is invalid." }),
    }
  ),

  lead_score: z
    .number()
    .min(0, { message: "Lead score must be at least 0." })
    .max(100, { message: "Lead score cannot exceed 100." })
    .optional(),

  next_steps: z
    .string()
    .min(1, { message: "Next steps are required." })
    .max(1000, { message: "Next steps cannot exceed 1000 characters." }),

  // assigned_to: z.string().optional(),

  comments: z
    .string()
    .max(1000, { message: "Comments cannot exceed 1000 characters." })
    .optional(),

  // customer_reference: z.string().optional(),
});

// Infer TypeScript types from the schema
export type LeadSchema = z.infer<typeof leadSchema>;
