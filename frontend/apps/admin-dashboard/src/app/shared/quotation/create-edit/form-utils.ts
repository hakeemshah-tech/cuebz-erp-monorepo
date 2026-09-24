export function defaultValues(quotation?: any) {
  return {
    proposal_number: quotation?.proposal_number || "",
    customer_id: quotation?.customer_id?.full_name || null, // Reference to Lead
    proposal_date: quotation?.proposal_date || new Date().toISOString(), // Default to current date
    proposal_expiry_date: quotation?.proposal_expiry_date || "",
    proposal_title: quotation?.proposal_title || "",
    proposal_details: quotation?.proposal_details || "",
    items: quotation?.items || [
      {
        item_name: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        total_price: 0,
      },
    ], // Default item structure
    subtotal: quotation?.subtotal || 0,
    vat: quotation?.vat || 0,
    total_amount: quotation?.total_amount || 0,
    payment_terms: quotation?.payment_terms || "",
    status: quotation?.status || "Draft", // Default status
    comments: quotation?.comments || "",
    termsCondition: quotation?.termsCondition || "",
    attachments: quotation?.attachments || [], // Array of file objects or URLs
  };
}
