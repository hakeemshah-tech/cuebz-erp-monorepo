export const defaultValues = (asset?: any) => ({
  name: asset?.name || "",
  category: asset?.category || "",
  serialNumber: asset?.serialNumber || "",
  purchaseDate: asset?.purchaseDate || null,
  warrantyExpiry: asset?.warrantyExpiry || null,
  status: asset?.status || "In Use",
  assignedTo: asset?.assignedTo || "",
  notes: asset?.notes || "",
});
