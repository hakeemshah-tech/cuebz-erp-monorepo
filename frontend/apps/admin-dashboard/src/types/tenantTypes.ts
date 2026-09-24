enum SubscriptionStatus {
  Active = "Active",
  Expired = "Expired",
  Trialing = "Trialing",
  PaymentFailed = "Payment Failed",
  PendingUpdate = "Pending Update",
}

export type TenantDataType = {
  _id: string;
  company_name: string;
  current_period_start: string; // ISO date string
  stripeCustomerId: string;
  subscription_end_date: string; // ISO date string
  subscription_start_date: string; // ISO date string
  subscription_status: SubscriptionStatus;
  subscription_plan: {
    _id: string;
    name: string;
    features: {
      max_organization: number;
      max_users: number;
    };
    price: number;
    interval: string; // e.g., "month", "year"
    interval_count: number;
    trial_duration?: number; // Optional if not always present
    stripeProductId?: string; // Optional if not always present
    stripePriceId?: string; // Optional if not always present
  };
  tenant_owner: {
    _id: string;
    name: string;
    email: string;
  };
};
