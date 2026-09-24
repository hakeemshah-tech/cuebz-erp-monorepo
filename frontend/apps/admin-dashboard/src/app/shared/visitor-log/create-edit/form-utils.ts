export function defaultValues(visitor?: any) {
  return {
    visitor_name: visitor?.visitor_name || "",
    visitor_company: visitor?.visitor_company || "",
    visitor_type: visitor?.visitor_type || "",
    visitor_contact_number: visitor?.visitor_contact_number || "",
    purpose_of_visit: visitor?.purpose_of_visit || "",
    // person_visiting: visitor?.person_visiting || "",
    // reminder_action_date: visitor?.reminder_action_date || "",
    // date: visitor?.date || new Date(),
    follow_up_comment: visitor?.follow_up_comment || "",
    person_visiting: visitor?.person_visiting || null,
    person_visiting_model: visitor?.person_visiting_model || "",
    date: visitor?.date ? new Date(visitor.date) : null,
    reminder_action_date: visitor?.reminder_action_date
      ? new Date(visitor.reminder_action_date)
      : null,
  };
}
