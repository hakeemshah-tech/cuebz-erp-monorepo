export interface EmployeeType {
  _id: string; // Unique identifier for the employee
  tenant_id: string; // Associated Tenant ID
  organization_id: string; // Associated Organization ID
  full_name: string; // Full Name
  nationality: string; // Nationality
  uae_contact_number: string; // Contact Number
  home_country_contact_number: string; // Home Country Contact Number
  emergency_contact_number: string; // Emergency Contact Number
  personal_email: string; // Personal Email
  company_email?: string; // Company Email (Optional)
  date_of_birth?: string; // Date of Birth (Optional)
  blood_group?: string; // Blood Group (Optional)
  emirates_id: string; // Emirates ID
  passport_id: string; // Passport Number
  visa_copy: string; // Visa Copy
  date_of_joining: string; // Date of Joining
  department: string; // Department
  job_title: string; // Job Title/Position
  reporting_manager?: string; // Reporting Manager (Optional, Employee ID)
  uae_address: string; // UAE Address
  home_country_address?: string; // Home Country Address (Optional)
  cv: string; // CV (Attachment)
  photo?: string; // Photo (Attachment, Optional)
  bank_details?: {
    bank_name?: string;
    account_number?: string;
    iban?: string;
  }; // Bank Details (Optional)
  emergency_contact_info?: {
    name?: string;
    relationship?: string;
    contact_number?: string;
  }; // Emergency Contact Information (Optional)
  medical_conditions?: string; // Any Medical Conditions (Optional)
  comments?: string; // Additional Comments or Notes (Optional)
  createdAt: string; // Record creation date
  updatedAt: string; // Record last update date
}
