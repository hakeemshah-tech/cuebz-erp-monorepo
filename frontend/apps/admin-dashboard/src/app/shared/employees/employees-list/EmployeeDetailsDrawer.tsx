// "use client";

// import { useState } from "react";
// import { Drawer, Button, Text } from "rizzui";
// import { MdClose, MdEdit, MdDelete } from "react-icons/md";
// import dayjs from "dayjs";
// import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
// import { EmployeeType } from "@/types/employeeTypes";

// export default function EmployeeDetailsDrawer({
//   employee,
//   open,
//   onClose,
//   onDeleted,
//   setEditOpen,
//   onUpdated,
// }: {
//   employee: EmployeeType;
//   open: boolean;
//   onClose: () => void;
//   onDeleted?: () => void;
//   onUpdated?: () => void;
//   setEditOpen: (arg: boolean) => void;
// }) {
//   const [deleting, setDeleting] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);

//   return (
//     <Drawer
//       isOpen={open}
//       onClose={onClose}
//       overlayClassName="backdrop-blur"
//       containerClassName="!max-w-[calc(100%-480px)] !shadow-2xl z-[999]"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//           Employee Details
//         </h2>
//         <div className="flex items-center gap-2">
//           <Button
//             size="sm"
//             variant="outline"
//             onClick={() => {
//               setEditOpen(true);
//               onClose();
//             }}
//           >
//             <MdEdit className="me-1" />
//             Edit
//           </Button>

//           <DeleteConfirmModal
//             isOpen={deleteOpen}
//             onClose={() => setDeleteOpen(false)}
//             onConfirm={async () => {
//               try {
//                 setDeleting(true);
//                 await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delete
//                 setDeleteOpen(false);
//                 onClose();
//                 if (onUpdated) onUpdated();
//                 if (onDeleted) onDeleted();
//               } catch {
//                 // handle error
//               } finally {
//                 setDeleting(false);
//               }
//             }}
//             loading={deleting}
//             title="Delete Employee"
//             description={`Are you sure you want to delete ${employee.full_name}?`}
//           />

//           <Button
//             size="sm"
//             color="danger"
//             variant="outline"
//             onClick={() => setDeleteOpen(true)}
//           >
//             <MdDelete className="me-1" />
//             Delete
//           </Button>

//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <MdClose className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="p-4 overflow-y-auto overflow-x-auto max-w-full">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <DetailsCard title="Personal Info">
//             <InfoGrid
//               items={[
//                 { label: "Full Name", value: employee.full_name },
//                 { label: "Nationality", value: employee.nationality },
//                 {
//                   label: "Contact Number",
//                   value: employee.uae_contact_number,
//                 },
//                 {
//                   label: "Home Country Contact Number",
//                   value: employee.home_country_contact_number,
//                 },
//                 {
//                   label: "Emergency Contact Number",
//                   value: employee.emergency_contact_number,
//                 },
//                 { label: "Department", value: employee.department },
//                 { label: "Job Title", value: employee.job_title },
//                 {
//                   label: "Date of Joining",
//                   value: formatDate(employee.date_of_joining),
//                 },
//               ]}
//             />
//           </DetailsCard>

//           <DetailsCard title="Address">
//             <InfoGrid
//               items={[
//                 { label: "UAE Address", value: employee.uae_address },
//                 {
//                   label: "Home Country Address",
//                   value: employee.home_country_address,
//                 },
//               ]}
//             />
//           </DetailsCard>

//           <DetailsCard title="Contact Info">
//             <InfoGrid
//               items={[
//                 { label: "Personal Email", value: employee.personal_email },
//                 { label: "Company Email", value: employee.company_email },
//               ]}
//             />
//           </DetailsCard>

//           {employee.emergency_contact_info && (
//             <DetailsCard title="Emergency Contact Info">
//               <InfoGrid
//                 items={[
//                   {
//                     label: "Name",
//                     value: employee.emergency_contact_info.name,
//                   },
//                   {
//                     label: "Relationship",
//                     value: employee.emergency_contact_info.relationship,
//                   },
//                   {
//                     label: "Contact",
//                     value: employee.emergency_contact_info.contact_number,
//                   },
//                 ]}
//               />
//             </DetailsCard>
//           )}

//           {employee.comments && (
//             <DetailsCard title="Comments">
//               <Text className="text-sm text-gray-700 whitespace-pre-line">
//                 {employee.comments}
//               </Text>
//             </DetailsCard>
//           )}
//         </div>
//       </div>
//     </Drawer>
//   );
// }

// function DetailsCard({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="rounded border border-gray-200 dark:border-gray-700 p-4">
//       <h4 className="text-sm font-semibold mb-2 text-gray-800">{title}</h4>
//       {children}
//     </div>
//   );
// }

// function InfoGrid({
//   items,
// }: {
//   items: { label: string; value?: string | number }[];
// }) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//       {items.map(({ label, value }) => (
//         <div key={label} className="text-sm">
//           <p className="text-gray-500 font-medium text-xs mb-1">{label}</p>
//           <p className="text-gray-900 font-semibold break-words">
//             {value || "N/A"}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// function formatDate(date: string | null | undefined) {
//   return date && dayjs(date).isValid()
//     ? dayjs(date).format("DD-MMM-YYYY")
//     : "N/A";
// }

// --------------------------------------------------------------

// "use client";

// import { useEffect, useState } from "react";
// import { Drawer, Button, Text } from "rizzui";
// import { MdClose, MdEdit, MdDelete } from "react-icons/md";
// import dayjs from "dayjs";
// import toast from "react-hot-toast";
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
// import FormFooter from "@core/components/form-footer";
// import WidgetCard from "@core/components/cards/widget-card";
// import EmployeeForm from "../create-edit/form";
// import { defaultValues } from "../create-edit/form-utils";
// import employeeService from "@/services/employeeService";
// import { employeeSchema, EmployeeSchema } from "@/validators/employee.schema";

// export default function EmployeeDetailsDrawer({
//   employee,
//   open,
//   onClose,
//   onDeleted,
//   onUpdated,
// }: {
//   employee: any;
//   open: boolean;
//   onClose: () => void;
//   onDeleted?: () => void;
//   onUpdated?: () => void;
// }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [filePreviews, setFilePreviews] = useState<
//     Record<string, File | string | null>
//   >({
//     emirates_id: null,
//     passport_id: null,
//     visa_copy: null,
//     cv: null,
//     photo: null,
//   });

//   const methods = useForm<EmployeeSchema>({
//     resolver: zodResolver(employeeSchema),
//     defaultValues: defaultValues(employee),
//   });

//   useEffect(() => {
//     if (employee) {
//       methods.reset(defaultValues(employee));
//       setFilePreviews({
//         emirates_id: employee.emirates_id || null,
//         passport_id: employee.passport_id || null,
//         visa_copy: employee.visa_copy || null,
//         cv: employee.cv || null,
//         photo: employee.photo || null,
//       });
//     }
//   }, [employee]);

//   const handleSubmit = async (data: EmployeeSchema) => {
//     setIsLoading(true);
//     try {
//       await employeeService.edit(employee._id, data);
//       toast.success("Employee updated successfully.");
//       setIsEditing(false);
//       onUpdated?.();
//       onClose();
//     } catch {
//       toast.error("Failed to update employee.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       toast.loading("Deleting employee...");
//       await employeeService.delete(employee._id);
//       toast.dismiss();
//       toast.success(`Employee ${employee.full_name} deleted successfully.`);
//       setDeleteOpen(false);
//       onDeleted?.();
//       onClose();
//       onUpdated?.();
//     } catch {
//       toast.dismiss();
//       toast.error("Failed to delete employee.");
//     }
//   };

//   return (
//     <Drawer
//       isOpen={open}
//       onClose={onClose}
//       overlayClassName="backdrop-blur"
//       containerClassName="w-full sm:!max-w-[calc(100%-480px)] !shadow-2xl z-[999]"
//     >
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//           Employee Details
//         </h2>
//         <div className="flex flex-wrap items-center gap-2 sm:justify-end">
//           {isEditing ? (
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => setIsEditing(false)}
//             >
//               ← Back to Details
//             </Button>
//           ) : (
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => setIsEditing(true)}
//             >
//               <MdEdit className="me-1" />
//               Edit
//             </Button>
//           )}

//           <DeleteConfirmModal
//             isOpen={deleteOpen}
//             onClose={() => setDeleteOpen(false)}
//             onConfirm={handleDelete}
//             loading={isLoading}
//             title="Delete Employee"
//             description={`Are you sure you want to delete ${employee.full_name}?`}
//           />

//           <Button
//             size="sm"
//             variant="outline"
//             onClick={() => setDeleteOpen(true)}
//           >
//             <MdDelete className="me-1" />
//             Delete
//           </Button>

//           <Button size="sm" variant="outline" onClick={onClose}>
//             <MdClose className="w-5 h-5" />
//             Close
//           </Button>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
//         {isEditing ? (
//           <FormProvider {...methods}>
//             <form onSubmit={methods.handleSubmit(handleSubmit)}>
//               <EmployeeForm
//                 filePreviews={filePreviews}
//                 setFilePreviews={setFilePreviews}
//               />
//               <FormFooter
//                 submitBtnText="Update Employee"
//                 isLoading={isLoading}
//               />
//             </form>
//           </FormProvider>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <WidgetCard title="Personal Info">
//               <br />
//               <InfoGrid
//                 items={[
//                   { label: "Full Name", value: employee.full_name },
//                   { label: "Employee Code", value: employee.employee_code },
//                   { label: "Employee Type", value: employee.employee_type },
//                   {
//                     label: "Total Years in Company",
//                     value: employee.total_years_in_company,
//                   },
//                   { label: "Nationality", value: employee.nationality },
//                   {
//                     label: "Contact Number",
//                     value: employee.uae_contact_number,
//                   },
//                   {
//                     label: "Home Country Contact Number",
//                     value: employee.home_country_contact_number,
//                   },
//                   {
//                     label: "Emergency Contact Number",
//                     value: employee.emergency_contact_number,
//                   },
//                   { label: "Department", value: employee.department },
//                   { label: "Job Title", value: employee.job_title },
//                   {
//                     label: "Date of Joining",
//                     value: formatDate(employee.date_of_joining),
//                   },
//                 ]}
//               />
//             </WidgetCard>

//             <WidgetCard title="Address">
//               <br />
//               <InfoGrid
//                 items={[
//                   { label: "UAE Address", value: employee.uae_address },
//                   {
//                     label: "Home Country Address",
//                     value: employee.home_country_address,
//                   },
//                 ]}
//               />
//             </WidgetCard>

//             <WidgetCard title="Contact Info">
//               <br />
//               <InfoGrid
//                 items={[
//                   { label: "Personal Email", value: employee.personal_email },
//                   { label: "Company Email", value: employee.company_email },
//                 ]}
//               />
//             </WidgetCard>

//             <WidgetCard title="Leave Information">
//               <br />
//               <InfoGrid
//                 items={[
//                   {
//                     label: "Casual Leave Allowed",
//                     value: employee?.leaves?.casual?.allowed,
//                   },
//                   {
//                     label: "Casual Leave Taken",
//                     value: employee?.leaves?.casual?.taken,
//                   },
//                   {
//                     label: "Sick Leave Allowed",
//                     value: employee?.leaves?.sick?.allowed,
//                   },
//                   {
//                     label: "Sick Leave Taken",
//                     value: employee?.leaves?.sick?.taken,
//                   },
//                   {
//                     label: "Annual Leave Allowed",
//                     value: employee?.leaves?.annual?.allowed,
//                   },
//                   {
//                     label: "Annual Leave Taken",
//                     value: employee?.leaves?.annual?.taken,
//                   },
//                   {
//                     label: "Total Leave Allowed",
//                     value: employee?.leaves?.total?.allowed,
//                   },
//                   {
//                     label: "Total Leave Taken",
//                     value: employee?.leaves?.total?.taken,
//                   },
//                 ]}
//               />
//             </WidgetCard>

//             {employee.emergency_contact_info && (
//               <WidgetCard title="Emergency Contact Info">
//                 <br />
//                 <InfoGrid
//                   items={[
//                     {
//                       label: "Name",
//                       value: employee.emergency_contact_info.name,
//                     },
//                     {
//                       label: "Relationship",
//                       value: employee.emergency_contact_info.relationship,
//                     },
//                     {
//                       label: "Contact",
//                       value: employee.emergency_contact_info.contact_number,
//                     },
//                   ]}
//                 />
//               </WidgetCard>
//             )}

//             {employee.comments && (
//               <WidgetCard title="Comments">
//                 <Text className="text-sm text-gray-700 whitespace-pre-line">
//                   {employee.comments}
//                 </Text>
//               </WidgetCard>
//             )}
//           </div>
//         )}
//       </div>
//     </Drawer>
//   );
// }

// function InfoGrid({
//   items,
// }: {
//   items: { label: string; value?: string | number | JSX.Element }[];
// }) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//       {items.map(({ label, value }) => (
//         <div key={label} className="text-sm">
//           <p className="text-gray-500 font-medium text-xs mb-1">{label}</p>
//           <p className="text-gray-900 font-semibold break-words">
//             {typeof value === "string" || typeof value === "number"
//               ? value || "N/A"
//               : value}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// function formatDate(dateString: string) {
//   return dateString && dayjs(dateString).isValid()
//     ? dayjs(dateString).format("DD-MMM-YYYY")
//     : "N/A";
// }

import { useEffect, useState } from "react";
import { Drawer, Button, Text } from "rizzui";
import { MdClose, MdEdit, MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
import FormFooter from "@core/components/form-footer";
import WidgetCard from "@core/components/cards/widget-card";
import EmployeeForm from "../create-edit/form";
import { defaultValues } from "../create-edit/form-utils";
import employeeService from "@/services/employeeService";
import { employeeSchema, EmployeeSchema } from "@/validators/employee.schema";

interface EmployeeDetailsDrawerProps {
  employee: any; // Ideally replace `any` with your Employee type if available
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void;
  onUpdated?: () => void;
}

export default function EmployeeDetailsDrawer({
  employee,
  open,
  onClose,
  onDeleted,
  onUpdated,
}: EmployeeDetailsDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [filePreviews, setFilePreviews] = useState<
    Record<string, File | string | null>
  >({
    emirates_id: null,
    passport_id: null,
    visa_copy: null,
    cv: null,
    photo: null,
  });

  const methods = useForm<EmployeeSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultValues(employee),
  });

  useEffect(() => {
    if (employee) {
      employee.assigned_to = employee.assigned_to
        ? employee.assigned_to?._id
        : null;
      console.log(employee, "heuuuu");
      methods.reset(defaultValues(employee));
      setFilePreviews({
        emirates_id: employee.emirates_id || null,
        passport_id: employee.passport_id || null,
        visa_copy: employee.visa_copy || null,
        cv: employee.cv || null,
        photo: employee.photo || null,
      });
    }
  }, [employee]);
  //   useEffect(() => {
  //     if (employee) {
  //       methods.reset(defaultValues(employee));
  //       setFilePreviews({
  //         emirates_id: employee.emirates_id || null,
  //         passport_id: employee.passport_id || null,
  //         visa_copy: employee.visa_copy || null,
  //         cv: employee.cv || null,
  //         photo: employee.photo || null,
  //       });
  //     }
  //   }, [employee]);

  const handleSubmit = async (data: EmployeeSchema) => {
    setIsLoading(true);
    try {
      await employeeService.edit(employee._id, data);
      toast.success("Employee updated successfully.");
      setIsEditing(false);
      onUpdated?.();
      onClose();
    } catch {
      toast.error("Failed to update employee.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      toast.loading("Deleting employee...");
      await employeeService.delete(employee._id);
      toast.dismiss();
      toast.success(`Employee ${employee.full_name} deleted successfully.`);
      setDeleteOpen(false);
      onDeleted?.();
      onClose();
      onUpdated?.();
    } catch {
      toast.dismiss();
      toast.error("Failed to delete employee.");
    }
  };

  return (
    <Drawer
      isOpen={open}
      onClose={onClose}
      overlayClassName="backdrop-blur"
      containerClassName="w-full sm:!max-w-[calc(100%-480px)] !shadow-2xl z-[999]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#F5F6F7] border-b border-gray-300">
        <h2 className="text-base font-semibold text-gray-900">
          Employee Details
        </h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="text" onClick={onClose}>
            <MdClose className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-60px)]">
        {isEditing ? (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              className="min-h-[84vh] flex flex-col"
            >
              {/* Form Content */}
              <div className="flex-1">
                <EmployeeForm
                  filePreviews={filePreviews}
                  setFilePreviews={setFilePreviews}
                />
              </div>

              {/* Footer at bottom */}
              <div className="border-muted">
                <FormFooter
                  submitBtnText="Update Employee"
                  isLoading={isLoading}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            </form>
          </FormProvider>
        ) : (
          <div className="space-y-4">
            {/* Info Card */}
            <div className="bg-white rounded-md border border-gray-200">
              <div className="flex items-center justify-between bg-[#F5F6F7] px-4 py-3">
                <div className="flex items-center gap-2">
                  {employee.photo ? (
                    <img
                      src={employee.photo}
                      alt={employee.full_name}
                      className="min-w-[48px] h-12 w-12 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="min-w-[48px] h-12 w-12 bg-gray-100 rounded-full" />
                  )}
                  <h3 className="text-base font-semibold text-gray-900">
                    {employee.full_name}
                  </h3>
                </div>

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
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <img src="/edit.svg" alt="Edit" className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 pt-4 text-sm p-4">
                {infoRow("Email", employee.personal_email, true)}
                {infoRow("Employee Type", employee.employee_type)}
                {infoRow("Employee Code", employee.employee_code)}
                {infoRow("Date of Birth", formatDate(employee.date_of_birth))}
                {infoRow("Nationality", employee.nationality)}
                {infoRow(
                  "Total Years in Company",
                  employee.total_years_in_company
                )}
                {infoRow("Phone Number", employee.uae_contact_number)}
                {infoRow("Emergency Number", employee.emergency_contact_number)}
                {infoRow(
                  "Home Country Number",
                  employee.home_country_contact_number
                )}
                {infoRow("Department", employee.department)}
                {infoRow("Job Title", employee.job_title)}
                {infoRow(
                  "Date of Joining",
                  formatDate(employee.date_of_joining)
                )}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-md border border-gray-200 p-4">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Address
              </h4>
              <div className="grid sm:grid-cols-2 gap-6 text-sm">
                {infoRow("Current Address", employee.uae_address)}
                {infoRow("Home Country Address", employee.home_country_address)}
              </div>
            </div>

            {/* Leave Info and Comments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Leave Info */}
              <div className="bg-white rounded-md border border-gray-200 p-4">
                <h4 className="text-base font-semibold text-gray-900 mb-4">
                  Leave Information
                </h4>
                <LeaveBar
                  label="Casual"
                  taken={employee?.leaves?.casual?.taken}
                  allowed={employee?.leaves?.casual?.allowed}
                  color="bg-sky-400"
                />
                <LeaveBar
                  label="Sick Leave"
                  taken={employee?.leaves?.sick?.taken}
                  allowed={employee?.leaves?.sick?.allowed}
                  color="bg-green-400"
                />
                <LeaveBar
                  label="Annual Leave"
                  taken={employee?.leaves?.annual?.taken}
                  allowed={employee?.leaves?.annual?.allowed}
                  color="bg-orange-400"
                />
                <LeaveBar
                  label="Total Leave Leave"
                  taken={employee?.leaves?.total?.taken}
                  allowed={employee?.leaves?.total?.allowed}
                  color="bg-purple-500"
                />
              </div>

              {/* Comments */}
              <div className="bg-white rounded-md border border-gray-200 p-4">
                <h4 className="text-base font-semibold text-gray-900 mb-4">
                  Comments
                </h4>
                <Text className="text-sm text-gray-700 whitespace-pre-line">
                  {employee.comments || "No comments available."}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}

function infoRow(label: any, value: any, isBold = false) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-1 font-medium">{label}</p>
      <p
        className={`text-gray-900 ${isBold ? "font-semibold" : "font-medium"} break-words`}
      >
        {value || "N/A"}
      </p>
    </div>
  );
}

function formatDate(date: any) {
  return date && dayjs(date).isValid()
    ? dayjs(date).format("DD-MMM-YYYY")
    : "N/A";
}

function LeaveBar({
  label,
  taken = 0,
  allowed = 0,
  color,
}: {
  label: string;
  taken?: number;
  allowed?: number;
  color: string;
}) {
  const percent = allowed > 0 ? (taken / allowed) * 100 : 0;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm font-medium text-gray-600">
        <span>{label}</span>
        <span className="text-xs text-gray-700 font-semibold">
          {taken}/{allowed}
        </span>
      </div>
      <div className="w-full h-2 mt-1 bg-gray-200 rounded-md overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

{
  /* <div className="flex items-center gap-4 border-b h-20 bg-[#F8F8F8] pl-4">
                {employee.photo ? (
                  <img
                    src={employee.photo}
                    alt={employee.full_name}
                    className="min-w-[48px] h-12 w-12 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="min-w-[48px] h-12 w-12 bg-gray-100 rounded-full" />
                )}
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    {employee.full_name}
                  </h3>
                </div>
              </div> */
}
