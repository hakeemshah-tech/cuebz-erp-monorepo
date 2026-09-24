export interface ChequeTrackerType {
  _id: string; // Unique identifier for the cheque entry
  cheque_number: string; // Cheque Number
  cheque_date: string; // Cheque Date
  amount: number; // Amount
  bank_name: string; // Bank Name
  payee_name: string; // Payee Name
  payeer_name: string; // Payer Name
  purpose: string; // Purpose of the cheque
  cheque_status: "Issued" | "Received" | "Cleared" | "Bounced"; // Cheque Status
  reminder_date: string; // Reminder Date
  attachments?: string[]; // Attachments (Optional, URLs for uploaded cheque images)
  additional_notes?: string; // Additional Notes (Optional)
  tenant_id: string; // Associated Tenant ID
  organization_id: string; // Associated Organization ID
  createdBy: string; // User ID of who created the cheque entry
  createdAt: string; // Cheque entry creation date
  updatedAt: string; // Cheque entry last update date
}
