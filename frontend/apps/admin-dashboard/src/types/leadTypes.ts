export interface LeadType {
  _id: string; // Unique identifier for the lead
  lead_source: string; // Source of the lead (e.g., Website, Referral, Phone Inquiry)
  lead_identifier_name: string;
  company_name?: string; // Company name (Optional)
  contact_person: string; // Contact person for the lead
  contact_number: string; // Contact number of the lead
  email: string; // Email address of the lead
  address?: {
    street?: string; // Street address (Optional)
    city?: string; // City name (Optional)
    state?: string; // State name (Optional)
    postal_code?: string; // Postal code (Optional)
    country?: string; // Country name (Optional)
  }; // Lead address information
  lead_status:
    | "New"
    | "Contacted"
    | "Qualified"
    | "Proposal Sent"
    | "Won"
    | "Lost"; // Status of the lead
  lead_score?: number; // Lead score for prioritization (Optional)
  next_steps: string; // Next action steps for the lead
  assigned_to: string; // Employee assigned to handle the lead
  comments?: string; // Additional comments or notes (Optional)
  customer_reference?: string; // Reference to an existing customer (if applicable)
  tenant_id: string; // Associated Tenant ID
  organization_id: string; // Associated Organization ID
  createdAt: string; // Lead creation date
  updatedAt: string; // Lead last update date
}
