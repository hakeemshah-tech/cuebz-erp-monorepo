export interface PettyCashType {
  _id: string; // Unique identifier for the petty cash entry
  transaction_type: "Add" | "Expense"; // Type of transaction (Add or Expense)
  transaction_date: string; // Date of the transaction
  amount: number; // Amount of the transaction
  purpose: string; // Purpose of the transaction
  remarks?: string; // Remarks (Optional)
  attachment?: string; // Attachment (Optional, URL for uploaded file)
  tenant_id: string; // Associated Tenant ID
  organization_id: string; // Associated Organization ID
  createdBy: string; // User ID of who created the entry
  createdAt: string; // Entry creation date
  updatedAt: string; // Entry last update date
}
