// "use client";

// import React from "react";
// import { Box, Flex, Badge, ActionIcon } from "rizzui";
// import { PiXBold } from "react-icons/pi";
// import { RolesUserType } from "@/types/rolesUserTypes";

// type RolesUserDetailsModalProps = {
//   user: RolesUserType;
//   closeModal?: () => void;
// };

// export default function RolesUserDetailsModal({
//   user,
//   closeModal,
// }: RolesUserDetailsModalProps) {
//   return (
//     <Box className="p-6 space-y-6 rounded-lg bg-white shadow-md">
//       {/* Header */}
//       <Flex justify="between" align="center" className="border-b pb-4">
//         <h2 className="text-xl font-semibold">Role User Details</h2>
//         <ActionIcon
//           size="sm"
//           variant="text"
//           onClick={closeModal}
//           className="text-gray-500 hover:!text-gray-900"
//         >
//           <PiXBold className="h-5 w-5" />
//         </ActionIcon>
//       </Flex>

//       {/* Content */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
//         {/* User Name */}
//         <div>
//           <p className="text-sm text-gray-500">Name</p>
//           <p className="text-lg font-medium text-gray-900">
//             {user.name || "N/A"}
//           </p>
//         </div>

//         {/* Email */}
//         <div>
//           <p className="text-sm text-gray-500">Email</p>
//           <p className="text-lg font-medium text-gray-900">
//             {user.email || "N/A"}
//           </p>
//         </div>

//         {/* Is verified */}
//         <div>
//           <p className="text-sm text-gray-500 mb-1">is Verified</p>
//           <Badge
//             className={`py-1 px-3 rounded-full text-sm font-medium ${
//               user.isVerified
//                 ? "bg-green-500 text-white"
//                 : "bg-red-500 text-white"
//             }`}
//           >
//             {user.status || "N/A"}
//           </Badge>
//         </div>

//         {/* Tenant */}
//         {user.tenant?.company_name && (
//           <div>
//             <p className="text-sm text-gray-500">Tenant</p>
//             <p className="text-lg font-medium text-gray-900">
//               {user.tenant.company_name}
//             </p>
//           </div>
//         )}

//         {/* Accessible Modules */}
//         {user.accessible_modules && user.accessible_modules.length > 0 && (
//           <div className="col-span-2">
//             <p className="text-sm text-gray-500">Accessible Modules</p>
//             <div className="flex flex-wrap gap-2">
//               {user.accessible_modules.map((module: string, index: number) => (
//                 <Badge
//                   key={index}
//                   className="py-1 px-3 rounded-full text-sm font-medium bg-indigo-500 text-white"
//                 >
//                   {module}
//                 </Badge>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Assigned Organization */}
//         {user.organization?.name && (
//           <div>
//             <p className="text-sm text-gray-500">Organization</p>
//             <p className="text-lg font-medium text-gray-900">
//               {user.organization.name}
//             </p>
//           </div>
//         )}
//       </div>
//     </Box>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Drawer, Button, Badge } from "rizzui";
import { PiXBold, PiTrashBold, PiPencilSimpleBold } from "react-icons/pi";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RolesUserType } from "@/types/rolesUserTypes";
import {
  rolesUserSchema,
  RolesUserSchema,
} from "@/validators/rolesUser.schema";
import rolesUserService from "@/services/rolesUserService";
import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
import RolesUserForm from "../create-edit/form";
import FormFooter from "@core/components/form-footer";
import employeeService from "@/services/employeeService";

export default function RolesUserDetailsDrawer({
  user,
  open,
  onClose,
  onUpdated,
  refreshData,
}: {
  user: RolesUserType;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  refreshData?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const methods = useForm<RolesUserSchema>({
    resolver: zodResolver(rolesUserSchema),
    defaultValues: user as any,
  });

  useEffect(() => {
    if (user) {
      methods.reset(user as any);
    }
  }, [user]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getList();
      const options = response.data.map((employee: any) => ({
        value: employee._id,
        label: employee.full_name,
        email: employee.personal_email,
        name: employee.full_name,
      }));
      setEmployeeOptions(options);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSubmit = async (data: RolesUserSchema) => {
    setIsLoading(true);
    try {
      const payload = {
        employee_id: data.employee_id,
        name: data.name,
        email: data.email,
        accessible_modules: data.accessible_modules,
      };

      if (!payload.employee_id) {
        toast.error("Employee selection is required.");
        setIsLoading(false);
        return;
      }

      await rolesUserService.updateRoleAndModules({
        userId: user._id,
        name: payload.name,
        accessible_modules: payload.accessible_modules,
      });

      toast.success("User updated successfully.");
      refreshData?.();
      onClose();
      onUpdated?.();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={open}
      onClose={handleCloseDrawer}
      containerClassName="w-full sm:!max-w-[calc(100%-530px)] !shadow-2xl z-[999]"
    >
      <div className="flex items-center justify-between px-5 py-3 bg-[#F5F6F7] border-b border-gray-300">
        <h2 className="text-base font-semibold text-gray-900">User Details</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="text" onClick={onClose}>
            <PiXBold className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-60px)]">
        {isEditing ? (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              className="min-h-[84vh] flex flex-col"
            >
              {/* Form Content */}
              <div className="flex-1">
                <RolesUserForm
                  isEditing={true}
                  employeeOptions={employeeOptions}
                />
              </div>

              {/* Footer at bottom */}
              <div className="border-muted">
                <FormFooter
                  submitBtnText="Update User"
                  isLoading={isLoading}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            </form>
          </FormProvider>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border rounded-md">
              <div className="flex items-center justify-between bg-[#F5F6F7] px-4 py-3">
                <h3 className="text-base font-semibold text-gray-900">
                  {user.name || "N/A"}
                </h3>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="text"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <img src="/delete.svg" alt="Delete" className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="text"
                    onClick={() => setIsEditing(true)}
                  >
                    <img src="/edit.svg" alt="Edit" className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm p-4">
                <InfoItem label="Email" value={user.email} />
                <InfoItem
                  label="Verified"
                  value={user.isVerified ? "Yes" : "No"}
                />
                {user.tenant?.company_name && (
                  <InfoItem label="Tenant" value={user.tenant.company_name} />
                )}
                {user.organization?.name && (
                  <InfoItem
                    label="Organization"
                    value={user.organization.name}
                  />
                )}
              </div>
            </div>

            {user.accessible_modules && user.accessible_modules.length > 0 && (
              <div className="bg-white border rounded-md p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2">
                  Accessible Modules
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.accessible_modules.map(
                    (module: string, index: number) => (
                      <Badge
                        key={index}
                        className="py-1 px-3 rounded-full text-sm font-medium bg-indigo-500 text-white"
                      >
                        {module}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          try {
            setDeleting(true);
            toast.loading("Deleting user...");
            await rolesUserService.delete(user._id);
            toast.dismiss();
            toast.success(`User deleted successfully.`);
            setDeleteOpen(false);
            onClose();
            onUpdated?.();
            refreshData?.();
          } catch {
            toast.dismiss();
            toast.error("Failed to delete user.");
          } finally {
            setDeleting(false);
          }
        }}
        loading={deleting}
        title="Delete User"
        description={`Are you sure you want to delete this user?`}
      />
    </Drawer>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div>
      <p className="text-gray-500 font-medium text-xs mb-1">{label}</p>
      <p className="text-gray-900 font-semibold break-words">
        {value || "N/A"}
      </p>
    </div>
  );
}
