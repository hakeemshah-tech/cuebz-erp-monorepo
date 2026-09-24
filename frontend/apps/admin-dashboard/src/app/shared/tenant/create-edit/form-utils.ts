export function defaultValues(tenant?: any) {
  return {
    company_name: tenant?.company_name || "",
    name: tenant?.tenant_owner?.name || "",
    email: tenant?.tenant_owner?.email || "",
    password: "",
  };
}
