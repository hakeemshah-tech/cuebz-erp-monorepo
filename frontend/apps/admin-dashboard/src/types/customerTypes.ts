export interface CustomerType {
  _id: string; // Unique ID for the customer
  tenant_id: string; // ID of the tenant associated with the customer
  organization_id: string; // ID of the organization the customer belongs to
  full_name: string; // Full name of the customer
  email: string; // Email address of the customer
  phone_number: string; // Contact number of the customer
  date_of_birth?: string; // Date of birth of the customer (optional)
  address?: {
    street?: string; // Street address (optional)
    city?: string; // City name (optional)
    state?: string; // State name (optional)
    postal_code?: string; // Postal code (optional)
    country?: string; // Country name (optional)
  }; // Address object (optional)
  customer_type: "Individual" | "Business"; // Type of the customer
  organization_name?: string; // Organization name (for business customers, optional)
  assigned_to?: string; // ID of the user assigned to the customer (optional)
  notes?: string; // Additional notes or comments (optional)
  createdAt: string; // Timestamp when the customer was created
  updatedAt: string; // Timestamp when the customer was last updated
  status: string; // Status of the customer
}
