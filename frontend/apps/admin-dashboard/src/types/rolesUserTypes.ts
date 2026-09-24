export type RolesUserType = {
  _id: string;
  name: string;
  email: string;
  role: "super-admin" | "super-admin-user" | "tenant-owner" | "tenant-user";
  status: "Active" | "Inactive";
  isVerified: boolean;
  tenant?: {
    _id: string;
    company_name: string;
  };
  organization?: {
    _id: string;
    name: string;
  };
  accessible_modules: string[]; // Array of accessible module names (e.g., ["dashboard", "task-management"])
  createdAt?: string; // Optional: Date string for when the user was created
  updatedAt?: string; // Optional: Date string for when the user was last updated
};
