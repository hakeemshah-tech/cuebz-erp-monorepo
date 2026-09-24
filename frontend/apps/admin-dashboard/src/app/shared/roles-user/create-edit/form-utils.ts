export const defaultValues = (rolesUser?: any) => ({
  name: rolesUser?.name || "",
  email: rolesUser?.email || "",
  accessible_modules: rolesUser?.accessible_modules || [],
});
