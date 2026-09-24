export type SubscriptionPlan = {
  _id: string;
  name: string;
  description: string;
  features: {
    max_organization: number;
    max_users: number;
  };
  interval: "day" | "week" | "month" | "year";
  interval_count: string;
  price: number;
  status: "Active" | "Inactive";
  stripePriceId: string;
  stripeProductId: string;
  trial_duration: number;
  createdAt: string;
  updatedAt: string;
};
