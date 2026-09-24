export type VendorType = {
  _id: string; // Unique identifier for the vendor
  tenant_id: string; // Tenant ID associated with the vendor
  organization_id: string; // Organization ID associated with the vendor
  vendor_name: string; // Name of the vendor
  email?: string; // Email address of the vendor (optional)
  phone_number: string; // Phone number of the vendor
  contact_person?: string; // Name of the contact person (optional)
  address?: {
    street?: string; // Street address (optional)
    city?: string; // City name (optional)
    state?: string; // State or region name (optional)
    postal_code?: string; // Postal code (optional)
    country?: string; // Country name (optional)
  }; // Address details for the vendor (optional)
  services_offered?: string[]; // List of services offered by the vendor (optional)
  vendor_type:
    | "Supplier"
    | "Manufacturer"
    | "Distributor"
    | "Service Provider"
    | "Other"; // Type of the vendor
  tax_registration_number?: string; // Tax registration number (optional)
  bank_details?: {
    bank_name?: string; // Bank name (optional)
    account_number?: string; // Encrypted bank account number (optional)
    iban_number?: string; // Encrypted IBAN number (optional)
    branch?: string; // Bank branch name (optional)
  }; // Bank details for the vendor (optional)
  assigned_to?: {
    _id: string; // Employee ID assigned to the vendor
    full_name: string; // Employee's full name
    email: string; // Employee's email address
  } | null; // Assigned employee details (optional)
  notes?: string; // Notes or additional information about the vendor (optional)
  attachments?: {
    file_name: string; // Name of the file
    file_url: string; // URL of the file
  }[]; // List of attachment details (optional)
  created_by: {
    _id: string; // Creator's ID
    full_name: string; // Creator's full name
    email: string; // Creator's email address
  }; // User who created the vendor record
  createdAt: string; // Vendor record creation date (ISO 8601 string)
  updatedAt: string; // Vendor record last updated date (ISO 8601 string)
};
