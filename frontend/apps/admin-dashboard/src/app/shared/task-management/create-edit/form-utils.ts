export function defaultValues(task?: any) {
  return {
    title: task?.title || "",
    description: task?.description || "",
    assignedTo: task?.assignedTo?._id || "", // Assuming assignedTo references an employee
    priority: task?.priority || "Medium", // Default priority
    dueDate: task?.dueDate || null,
    status: task?.status || "Pending", // Default status
    createdBy: task?.createdBy || "", // Should be set dynamically (current user ID)
    comments: task?.comments || "",
    attachments: task?.attachments || [], // Assuming it's an array of file URLs or file objects
  };
}
