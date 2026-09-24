export function defaultValues(pettyCash?: any) {
  return {
    transaction_type: pettyCash?.transaction_type || "Add", // Default to 'Add'
    transaction_date: pettyCash?.transaction_date || new Date(),
    amount: pettyCash?.amount || 0,
    purpose: pettyCash?.purpose || "",
    remarks: pettyCash?.remarks || "",
    // attachment: pettyCash?.attachment || null, // Assuming it's a file URL or file object
  };
}
