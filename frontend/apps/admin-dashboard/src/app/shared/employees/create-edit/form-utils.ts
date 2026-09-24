// export function defaultValues(employee?: any) {
//   return {
//     full_name: employee?.full_name || "",
//     nationality: employee?.nationality || "",
//     uae_contact_number: employee?.uae_contact_number || "",
//     home_country_contact_number: employee?.home_country_contact_number || "",
//     emergency_contact_number: employee?.emergency_contact_number || "",
//     personal_email: employee?.personal_email || "",
//     company_email: employee?.company_email || "",
//     date_of_birth: employee?.date_of_birth || "",
//     blood_group: employee?.blood_group || "",
//     emirates_id: employee?.emirates_id || "",
//     passport_id: employee?.passport_id || "",
//     visa_copy: employee?.visa_copy || "",
//     date_of_joining: employee?.date_of_joining,
//     department: employee?.department || "",
//     job_title: employee?.job_title || "",
//     employee_code: employee?.employee_code || "",
//     employee_type: employee?.employee_type || "",
//     total_years_in_company:
//       typeof employee?.total_years_in_company === "number"
//         ? employee.total_years_in_company
//         : null,
//     reporting_manager: employee?.reporting_manager?._id || "",
//     uae_address: employee?.uae_address || "",
//     home_country_address: employee?.home_country_address || "",
//     cv: employee?.cv || "",
//     photo: employee?.photo || "",
//     bank_details: {
//       bank_name: employee?.bank_details?.bank_name || "",
//       account_number: employee?.bank_details?.account_number || "",
//       iban: employee?.bank_details?.iban || "",
//     },
//     emergency_contact_info: {
//       name: employee?.emergency_contact_info?.name || "",
//       relationship: employee?.emergency_contact_info?.relationship || "",
//       contact_number: employee?.emergency_contact_info?.contact_number || "",
//     },
//     medical_conditions: employee?.medical_conditions || "",
//     comments: employee?.comments || "",
//   };
// }

export function defaultValues(employee?: any) {
  return {
    full_name: employee?.full_name || "",
    nationality: employee?.nationality || "",
    uae_contact_number: employee?.uae_contact_number || "",
    home_country_contact_number: employee?.home_country_contact_number || "",
    emergency_contact_number: employee?.emergency_contact_number || "",
    personal_email: employee?.personal_email || "",
    company_email: employee?.company_email || "",
    date_of_birth: employee?.date_of_birth || "",
    blood_group: employee?.blood_group || "",
    emirates_id: employee?.emirates_id || "",
    passport_id: employee?.passport_id || "",
    visa_copy: employee?.visa_copy || "",
    date_of_joining: employee?.date_of_joining || "",
    department: employee?.department || "",
    job_title: employee?.job_title || "",
    employee_code: employee?.employee_code || "",
    employee_type: employee?.employee_type || "",
    total_years_in_company:
      typeof employee?.total_years_in_company === "number"
        ? employee.total_years_in_company
        : null,
    reporting_manager: employee?.reporting_manager?._id || "",
    uae_address: employee?.uae_address || "",
    home_country_address: employee?.home_country_address || "",
    cv: employee?.cv || "",
    photo: employee?.photo || "",
    bank_details: {
      bank_name: employee?.bank_details?.bank_name || "",
      account_number: employee?.bank_details?.account_number || "",
      iban: employee?.bank_details?.iban || "",
      salary_transfer_mode:
        employee?.bank_details?.salary_transfer_mode || "Bank Transfer",
    },
    emergency_contact_info: {
      name: employee?.emergency_contact_info?.name || "",
      relationship: employee?.emergency_contact_info?.relationship || "",
      contact_number: employee?.emergency_contact_info?.contact_number || "",
    },
    medical_conditions: employee?.medical_conditions || "",
    comments: employee?.comments || "",
    // ✅ Leave fields
    leaves: {
      casual: {
        allowed: employee?.leaves?.casual?.allowed ?? 0,
        taken: employee?.leaves?.casual?.taken ?? 0,
      },
      sick: {
        allowed: employee?.leaves?.sick?.allowed ?? 0,
        taken: employee?.leaves?.sick?.taken ?? 0,
      },
      annual: {
        allowed: employee?.leaves?.annual?.allowed ?? 0,
        taken: employee?.leaves?.annual?.taken ?? 0,
      },
      total: {
        allowed: employee?.leaves?.total?.allowed ?? 0,
        taken: employee?.leaves?.total?.taken ?? 0,
      },
    },
  };
}
