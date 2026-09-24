import { z } from "zod";

export const subscriptionFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.coerce.number().min(1, { message: "Price must be at least 1" }),
  interval: z
    .enum(["day", "week", "month", "year"])
    .refine((val) => !!val, { message: "Interval is required" }),
  interval_count: z.coerce
    .number()
    .min(1, { message: "Interval count must be at least 1" }),
  trial_duration: z.coerce
    .number()
    .min(0, { message: "Trial duration must be at least 0" }),
});

export type CreateSubscriptionInput = z.infer<typeof subscriptionFormSchema>;
