export const defaultValues = (customer?: any) => ({
  full_name: customer?.full_name || "",
  email: customer?.email || "",
  phone_number: customer?.phone_number || "",
  address: {
    street: customer?.address?.street || "",
    city: customer?.address?.city || "",
    state: customer?.address?.state || "",
    postal_code: customer?.address?.postal_code || "",
    country: customer?.address?.country || "",
  },
  date_of_birth: customer?.date_of_birth || null,
  customer_type: customer?.customer_type || "Individual",
  organization_name: customer?.organization_name || "",
  assigned_to: customer?.assigned_to || "",
  notes: customer?.notes || "",
});
