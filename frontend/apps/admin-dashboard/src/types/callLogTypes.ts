export interface CallLogType {
  _id: string; // Unique identifier for the call log
  date_time: string; // Date and Time of Call
  caller_name: string; // Caller Name
  caller_company?: string; // Caller Company (Optional)
  visitor_type: "Customer" | "Vendor" | "Interview" | "Other"; // Visitor Type
  caller_contact_number: string; // Caller Contact Number
  purpose_of_call: string; // Purpose of Call
  call_handled_by?: string; // Call Handled By (Employee Name)
  reminder_action_date?: string; // Set Reminder for Action (Optional)
  // call_outcome?: string; // Call Outcome/Action Taken (Optional)
  tenant_id: string; // Associated Tenant ID
  organization_id: string; // Associated Organization ID
  createdAt: string; // Call log creation date
  updatedAt: string; // Call log last update date
  status: string;
}
