export interface VisitorLogType {
  _id: string; // Unique ID for the visitor log
  tenant_id: string; // ID of the tenant associated with the visitor
  organization_id: string; // ID of the organization the visitor belongs to
  visitor_name: string; // Name of the visitor
  visitor_company: string; // Visitor's company name
  visitor_type: "Customer" | "Vendor" | "Interview" | "Other"; // Type of the visitor
  visitor_contact_number: string; // Contact number of the visitor
  purpose_of_visit: string; // Purpose of the visit
  // person_visiting?: string; // Name of the employee being visited (optional)
  reminder_action_date?: string; // Reminder date for follow-up (optional)
  comments?: string; // Additional comments or notes (optional)
  createdAt: string; // Timestamp when the visitor log was created
  updatedAt: string; // Timestamp when the visitor log was last updated
  status: string;
  date: string;
  follow_up_comment?: string;
}
