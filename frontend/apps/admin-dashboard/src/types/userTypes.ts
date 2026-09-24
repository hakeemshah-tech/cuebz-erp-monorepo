export interface Organization {
  _id: string;
  name: string;
  business_category: string;
  employees_count: string;
  tenant_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Tenant {
  _id: string;
  company_name: string;
  stripeCustomerId: string;
  subscription_start_date: string;
  subscription_end_date: string;
  subscription_status: string;
  tenant_owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
  accessible_modules: string[]; // Adjust this type if the modules have a specific shape
  selectedOrganization?: Organization;
  tenant_id?: Tenant;
  createdAt: string;
  updatedAt: string;
}
