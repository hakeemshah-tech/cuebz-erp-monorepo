export function defaultValues(invoice?: any) {
  return {
    invoice_number: invoice?.invoice_number || "",
    quotation_id: invoice?.quotation_id || null, // Reference to linked Quotation
    invoice_date: invoice?.invoice_date || new Date().toISOString(), // Default to current date
    due_date: invoice?.due_date || "", // Due date for payment
    status: invoice?.status || "Unpaid", // Default status
    payment_receipt: invoice?.payment_receipt || null, // Payment receipt if applicable
    attachments: invoice?.attachments || [], // Array of file objects or URLs
  };
}
