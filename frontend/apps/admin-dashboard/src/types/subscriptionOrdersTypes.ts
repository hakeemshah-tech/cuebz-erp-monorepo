export interface SubscriptionOrderType {
  _id: string;
  amount: number;
  createdAt: string; // ISO date string
  created_at: string; // ISO date string
  currency: string;
  end_date: string; // ISO date string
  start_date: string; // ISO date string
  status: "Pending" | "Paid" | "Failed" | "Canceled";
  subscription_plan: {
    _id: string;
    name: string;
    price: number;
    interval: "day" | "week" | "month" | "year";
  };
  tenant_id: {
    _id: string;
    company_name: string;
    tenant_owner: string; // Reference to the tenant owner
  };
  updatedAt: string; // ISO date string
}
