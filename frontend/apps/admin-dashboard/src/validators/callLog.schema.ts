// import { z } from "zod";

// // Call Log Schema Validation
// export const callLogSchema = z.object({
//   caller_name: z
//     .string()
//     .min(1, { message: "Caller name is required." })
//     .max(100, { message: "Caller name cannot exceed 100 characters." }),
//   caller_company: z
//     .string()
//     .max(100, { message: "Caller company cannot exceed 100 characters." })
//     .optional(), // Optional field
//   visitor_type: z.enum(["Customer", "Vendor", "Interview", "Other"], {
//     errorMap: () => ({ message: "Visitor type is invalid." }),
//   }),
//   caller_contact_number: z
//     .string()
//     .min(10, { message: "Contact number must be at least 10 digits." })
//     .max(15, { message: "Contact number cannot exceed 15 digits." }),
//   purpose_of_call: z
//     .string()
//     .min(1, { message: "Purpose of call is required." })
//     .max(500, { message: "Purpose of call cannot exceed 500 characters." }),
//   call_handled_by: z
//     .string()
//     .max(100, { message: "Call handled by cannot exceed 100 characters." })
//     .optional(), // Optional field
//   date_time: z
//     .string()
//     .refine(
//       (value) => !isNaN(Date.parse(value)),
//       "Date and time of call must be a valid date."
//     ), // Required field
//   reminder_action_date: z
//     .string()
//     .refine(
//       (value) => !value || !isNaN(Date.parse(value)),
//       "Reminder action date must be a valid date."
//     )
//     .optional(), // Optional field
//   call_outcome: z
//     .string()
//     .max(500, { message: "Call outcome cannot exceed 500 characters." })
//     .optional(), // Optional field
//   organization_id: z
//     .string()
//     .nonempty({ message: "Organization ID is required." }), // Required field for organization
//   status: z.enum(
//     ["Positive Intention", "Neutral Intention", "Negative Intention"],
//     {
//       errorMap: () => ({ message: "Status is invalid." }),
//     }
//   ), // Added status field here
// });

// // Infer TypeScript types from the schema
// export type CallLogSchema = z.infer<typeof callLogSchema>;

import { z } from "zod";

// Call Log Schema Validation
export const callLogSchema = z.object({
  caller_name: z
    .string()
    .min(1, { message: "Caller name is required." })
    .max(100, { message: "Caller name cannot exceed 100 characters." }),
  caller_company: z
    .string()
    .max(100, { message: "Caller company cannot exceed 100 characters." })
    .optional(), // Optional field
  visitor_type: z.enum(["Customer", "Vendor", "Interview", "Other"], {
    errorMap: () => ({ message: "Visitor type is invalid." }),
  }),
  caller_contact_number: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits." })
    .max(15, { message: "Contact number cannot exceed 15 digits." }),
  purpose_of_call: z
    .string()
    .min(1, { message: "Purpose of call is required." })
    .max(500, { message: "Purpose of call cannot exceed 500 characters." }),
  call_handled_by: z
    .string()
    .max(100, { message: "Call handled by cannot exceed 100 characters." })
    .optional(), // Optional field
  date_time: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Date and time of call must be a valid date.",
  }), // Required field

  // call_outcome: z
  //   .string()
  //   .max(500, { message: "Call outcome cannot exceed 500 characters." })
  //   .optional(), // Optional field
  // status: z.enum(
  //   ["Positive Intention", "Neutral Intention", "Negative Intention"],
  //   {
  //     errorMap: () => ({ message: "Status is invalid." }),
  //   }
  // ), // Status field validation

  reminder_action_date: z
    .string()
    .refine(
      (value) => !value || !isNaN(Date.parse(value)),
      "Reminder action date must be a valid date."
    )
    .optional(),
  // date: z
  //   .string()
  //   .refine(
  //     (value) => !value || !isNaN(Date.parse(value)),
  //     "Date must be a valid date."
  //   )
  //   .optional(),

  // ✅ Renamed from "comments"
  follow_up_comment: z
    .string()
    .max(500, { message: "Comment cannot exceed 500 characters." })
    .optional(),
});

// Infer TypeScript types from the schema
export type CallLogSchema = z.infer<typeof callLogSchema>;
