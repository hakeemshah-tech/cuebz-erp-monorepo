export interface QuotationType {
  _id: string; // Unique identifier for the quotation
  proposal_number: string; // Auto-generated proposal number
  customer_id?: string | null; // Reference to the associated lead (if applicable)
  proposal_date: string; // Date when the proposal was created
  proposal_expiry_date?: string; // Expiry date for the proposal (Optional)
  proposal_title: string; // Title of the proposal
  proposal_details: string; // Detailed description of the proposal
  items: {
    item_name: string; // Name of the item/service
    description?: string; // Description of the item/service (Optional)
    quantity: number; // Quantity of items/services
    unit_price: number; // Unit price of the item/service
    total_price: number; // Calculated total price for the item/service
  }[]; // Array of items/services in the proposal
  subtotal: number; // Subtotal before tax
  vat: number; // VAT applied (if any)
  total_amount: number; // Total amount including VAT
  payment_terms: string; // Payment terms and conditions
  status: "Draft" | "Sent" | "Accepted" | "Rejected"; // Current status of the quotation
  comments?: string; // Additional comments (Optional)
  tenant_id: string; // Associated Tenant ID
  organization_id: string; // Associated Organization ID
  attachments?: {
    file_name: string; // Name of the attached file
    file_url: string; // URL of the attached file
  }[]; // Optional attachments
  termsCondition: string; // Terms and conditions of the quotation
  createdAt: string; // Quotation creation date
  updatedAt: string; // Quotation last update date
}
