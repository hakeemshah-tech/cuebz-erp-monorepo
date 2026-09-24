export function defaultValues(cheque?: any) {
  return {
    cheque_number: cheque?.cheque_number || "",
    cheque_date: cheque?.cheque_date || null,
    amount: cheque?.amount || 0,
    bank_name: cheque?.bank_name || "",
    payee_name: cheque?.payee_name || "",
    payeer_name: cheque?.payeer_name || "",
    purpose: cheque?.purpose || "",
    cheque_status: cheque?.cheque_status || "Issued", // Default status
    cheque_type: cheque?.cheque_type || "Incoming", // Default status
    reminder_date: cheque?.reminder_date || null,
    attachments: cheque?.attachments || [], // Assuming it's an array of file URLs or file objects
    additional_notes: cheque?.additional_notes || "", // Default to an empty string if not provided
  };
}
