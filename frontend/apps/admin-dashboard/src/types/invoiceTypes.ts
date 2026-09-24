export interface InvoiceType {
  _id: string; // Unique identifier for the invoice
  invoice_number: string; // Auto-generated invoice number
  quotation_id: string | null; // Reference to the associated quotation
  invoice_date: string; // Date when the invoice was created
  due_date: string; // Due date for payment
  status: "Unpaid" | "Paid" | "Cancelled" | "Refunded"; // Invoice payment status
  tenant_id: string; // Associated Tenant ID
  organization_id: string; // Associated Organization ID
  payment_receipt?: {
    file_name: string; // Name of the payment receipt file
    file_url: string; // URL of the payment receipt
  } | null; // Payment receipt file (if applicable)
  attachments?: {
    file_name: string; // Name of the attached file
    file_url: string; // URL of the attached file
  }[]; // Optional attachments
  createdAt: string; // Invoice creation date
  updatedAt: string; // Invoice last update date
}
