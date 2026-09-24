import { z } from "zod";
import { messages } from "@/config/messages";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "./common-rules";

// Options for employees_count
const employeesCountOptions = ["0-9", "10-20", "21-50", "51-100", "101+"];

// Options for business_category
const businessCategoryOptions = [
  "General Trading",
  "E-commerce",
  "Consultancy",
  "Accounting and Auditing",
  "Engineering Services",
  "Healthcare (clinics, medical centers)",
  "Education and Training",
  "Manufacturing",
  "Construction and Contracting",
  "Energy",
  "Hotels and Resorts",
  "Restaurants and Cafes",
  "Travel Agencies",
  "Entertainment",
  "Real Estate",
  "Commercial Brokerage",
  "Transportation",
  "Logistics & Freight forwarding",
  "Courier services",
  "Financial Services",
  "Technology",
  "Other",
];

// form zod validation schema
export const signUpSchema = z.object({
  name: z
    .string({ message: "Name must be a character" })
    .min(3, { message: "Name must be at least 3 characters" }),
  company_name: z
    .string({ message: "Company must be a character" })
    .min(3, { message: "Company name must be at least 3 characters" }),
  email: validateEmail,
  password: validatePassword,
  isAgreed: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions",
  }),
  employees_count: z
    .string()
    .refine((value) => employeesCountOptions.includes(value), {
      message: "Invalid employees count",
    }),
  business_category: z
    .string()
    .refine((value) => businessCategoryOptions.includes(value), {
      message: "Invalid business category",
    }),
});

// generate form types from zod validation schema
export type SignUpSchema = z.infer<typeof signUpSchema>;
