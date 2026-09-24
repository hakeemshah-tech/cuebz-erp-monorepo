export function defaultValues(vendor?: any) {
  return {
    vendor_name: vendor?.vendor_name || "",
    email: vendor?.email || "",
    phone_number: vendor?.phone_number || "",
    contact_person: vendor?.contact_person || "",
    vendor_type: vendor?.vendor_type || "Supplier", // Default vendor type
    address: {
      street: vendor?.address?.street || "",
      city: vendor?.address?.city || "",
      state: vendor?.address?.state || "",
      postal_code: vendor?.address?.postal_code || "",
      country: vendor?.address?.country || "UAE", // Default country is UAE
    },
    bank_details: {
      bank_name: vendor?.bank_details?.bank_name || "",
      account_number: vendor?.bank_details?.account_number || "",
      iban_number: vendor?.bank_details?.iban_number || "",
      branch: vendor?.bank_details?.branch || "",
    },
    services_offered: vendor?.services_offered || [], // Array of service strings
    tax_registration_number: vendor?.tax_registration_number || "",
    assigned_to: vendor?.assigned_to?._id || "", // Assuming assigned_to references an employee
    notes: vendor?.notes || "",
    // attachments: vendor?.attachments || [], // Array of file objects or URLs
  };
}
