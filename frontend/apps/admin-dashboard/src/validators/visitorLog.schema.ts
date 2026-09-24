import { z } from "zod";

// Visitor Log Schema Validation
// export const visitorLogSchema = z.object({
//   visitor_name: z
//     .string()
//     .min(1, { message: "Visitor name is required." })
//     .max(100, { message: "Visitor name cannot exceed 100 characters." }),
//   visitor_company: z
//     .string()
//     .min(1, { message: "Visitor company is required." })
//     .max(100, { message: "Visitor company cannot exceed 100 characters." }),
//   visitor_type: z.enum(["Customer", "Vendor", "Interview", "Other"], {
//     errorMap: () => ({ message: "Visitor type is invalid." }),
//   }),
//   visitor_contact_number: z
//     .string()
//     .min(10, { message: "Contact number must be at least 10 digits." })
//     .max(15, { message: "Contact number cannot exceed 15 digits." }),
//   purpose_of_visit: z
//     .string()
//     .min(1, { message: "Purpose of visit is required." })
//     .max(500, { message: "Purpose of visit cannot exceed 500 characters." }),
//   person_visiting: z
//     .string()
//     .max(100, { message: "Person visiting cannot exceed 100 characters." })
//     .optional(), // Apply optional here
//   reminder_action_date: z
//     .string()
//     .refine(
//       (value) => !value || !isNaN(Date.parse(value)),
//       "Reminder action date must be a valid date."
//     )
//     .optional(), // Apply optional here
//   date: z
//     .string()
//     .refine(
//       (value) => !value || !isNaN(Date.parse(value)),
//       "Date must be a valid date."
//     )
//     .optional(), // Apply optional here
//   comments: z
//     .string()
//     .max(500, { message: "Comments cannot exceed 500 characters." })
//     .optional(), // Apply optional here
// import { z } from "zod";

export const visitorLogSchema = z.object({
  visitor_name: z
    .string()
    .min(1, { message: "Visitor name is required." })
    .max(100, { message: "Visitor name cannot exceed 100 characters." }),

  visitor_company: z
    .string()
    .min(1, { message: "Visitor company is required." })
    .max(100, { message: "Visitor company cannot exceed 100 characters." }),

  visitor_type: z.enum(
    [
      "Customer",
      "Lead",
      "Vendor",
      "Job Seeker",
      "Interview",
      "Payment Followup",
      "Other",
    ],
    {
      errorMap: () => ({ message: "Visitor type is invalid." }),
    }
  ),

  visitor_contact_number: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits." })
    .max(15, { message: "Contact number cannot exceed 15 digits." }),

  purpose_of_visit: z
    .string()
    .min(1, { message: "Purpose of visit is required." })
    .max(500, { message: "Purpose of visit cannot exceed 500 characters." }),

  // ✅ New fields
  person_visiting: z.string().optional().nullable(), // This allows empty string or null

  // person_visiting_model: z.enum(["Customer", "Vendor"]).optional().nullable(),

  date: z.any().nullable().optional(),

  reminder_action_date: z.any().nullable().optional(),

  follow_up_comment: z
    .string()
    .max(500, { message: "Comment cannot exceed 500 characters." })
    .optional(),
});

export type VisitorLogSchema = z.infer<typeof visitorLogSchema>;

// reminder_action_date: z
//   .string()
//   .refine(
//     (value) => !value || !isNaN(Date.parse(value)),
//     "Reminder action date must be a valid date."
//   )
//   .optional(),

// date: z
//   .string()
//   .refine(
//     (value) => !value || !isNaN(Date.parse(value)),
//     "Date must be a valid date."
//   )
//   .optional(),
