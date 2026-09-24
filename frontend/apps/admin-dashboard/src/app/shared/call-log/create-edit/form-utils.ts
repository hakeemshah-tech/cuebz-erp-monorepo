export const defaultValues = (callLog?: any) => ({
  date_time: callLog?.date_time || null,
  caller_name: callLog?.caller_name || "",
  caller_company: callLog?.caller_company || "",
  visitor_type: callLog?.visitor_type || "",
  caller_contact_number: callLog?.caller_contact_number || "",
  purpose_of_call: callLog?.purpose_of_call || "",
  call_handled_by: callLog?.call_handled_by || "",
  // call_outcome: callLog?.call_outcome || "",
  // status: callLog?.status || "",
  reminder_action_date: callLog?.reminder_action_date || "",
  follow_up_comment: callLog?.follow_up_comment || "",
});
