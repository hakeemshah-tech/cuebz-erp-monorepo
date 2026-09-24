import { z } from "zod";

// Roles User Schema Validation
export const rolesUserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(100, { message: "Name cannot exceed 100 characters." }),
  email: z
    .string()
    .email({ message: "Email must be a valid email address." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  employee_id: z.string(),
  accessible_modules: z
    .array(
      z.enum(
        [
          "dashboard",
          "visitor-log",
          "call-log",
          "documents",
          "employees",
          "task-management",
        ],
        { errorMap: () => ({ message: "Invalid module selected." }) }
      )
    )
    .nonempty({ message: "At least one module must be selected." }), // Ensure at least one module is selected
});

// Infer TypeScript types from the schema
export type RolesUserSchema = z.infer<typeof rolesUserSchema>;
