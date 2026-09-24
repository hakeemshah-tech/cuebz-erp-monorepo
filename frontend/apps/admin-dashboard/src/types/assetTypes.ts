export interface category {
  _id: string; // Unique identifier for the asset
  name: string; // Asset Name
  category: "Laptop" | "Printer" | "Smart TV" | "Monitor" | "Other"; // Type of Asset
  serial_number?: string; // Serial Number (Optional)
  purchase_date?: string; // Date of Purchase
  warranty_expiry?: string; // Warranty Expiry Date
  assigned_to?: { _id: string; full_name: string }; // Employee Assigned To (Optional)
  location?: string; // Location of the Asset
  notes?: string; // Additional Notes (Optional)
  tenant_id: string; // Associated Tenant ID
  organization_id: string; // Associated Organization ID
  createdAt: string; // Asset creation date
  updatedAt: string; // Asset last update date
  status: "In Use" | "In Storage" | "Under Maintenance" | "Retired"; // Status of the Asset
}
