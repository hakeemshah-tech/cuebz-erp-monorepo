import { z } from "zod";

// const fileOrUrlSchema = z.union([
//   z.instanceof(File).refine((file) => file.size > 0, {
//     message: "Uploaded file cannot be empty.",
//   }),
//   z.string().url({ message: "Must be a valid URL." }),
// ]);

export const vendorSchema = z.object({
  vendor_name: z
    .string()
    .min(1, { message: "Vendor name is required." })
    .max(150, { message: "Vendor name cannot exceed 150 characters." }),

  email: z.string().email({ message: "Invalid email address." }).optional(),

  phone_number: z
    .string()
    .min(7, { message: "Phone number must be at least 7 digits." })
    .max(15, { message: "Phone number cannot exceed 15 digits." })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only digits." }),

  contact_person: z
    .string()
    .max(100, {
      message: "Contact person's name cannot exceed 100 characters.",
    })
    .optional(),

  address: z
    .object({
      street: z
        .string()
        .max(255, { message: "Street address is too long." })
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
        .default("UAE"),
    })
    .optional(),

  services_offered: z.array(z.string().max(100)).optional(),

  vendor_type: z.enum(
    ["Supplier", "Manufacturer", "Distributor", "Service Provider", "Other"],
    {
      message:
        "Vendor type must be one of 'Supplier', 'Manufacturer', 'Distributor', 'Service Provider', or 'Other'.",
    }
  ),

  trade_license_number: z
    .string()
    .max(50, { message: "Trade license number cannot exceed 50 characters." })
    .optional(),

  tax_registration_number: z
    .string()
    .max(20, {
      message: "Tax registration number cannot exceed 20 characters.",
    })
    .regex(/^[A-Z0-9-]{5,20}$/, {
      message: "Invalid tax registration number format.",
    })
    .optional(),

  bank_details: z
    .object({
      bank_name: z
        .string()
        .max(100, { message: "Bank name cannot exceed 100 characters." })
        .optional(),
      account_number: z
        .string()
        .max(20, { message: "Account number cannot exceed 20 characters." })
        .optional(),
      iban_number: z
        .string()
        .max(34, { message: "IBAN cannot exceed 34 characters." })
        .optional(),
      branch: z
        .string()
        .max(100, { message: "Branch name cannot exceed 100 characters." })
        .optional(),
    })
    .optional(),

  notes: z
    .string()
    .max(1000, { message: "Notes cannot exceed 1000 characters." })
    .optional(),

  // attachments: z
  //   .array(fileOrUrlSchema)
  //   .max(10, { message: "You can upload a maximum of 10 attachments." })
  //   .optional(),

  assigned_to: z
    .string()
    .nonempty({ message: "Assigned employee is required." })
    .optional(),
});

// Infer TypeScript types from the schema
export type VendorSchema = z.infer<typeof vendorSchema>;
