// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import WidgetCard from "@core/components/cards/widget-card";
// import { Button, Drawer, Text } from "rizzui";
// import { MdClose, MdDelete, MdEdit } from "react-icons/md";
// import dayjs from "dayjs";
// import toast from "react-hot-toast";
// import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
// import customerService from "@/services/customerService";

// export default function CustomerDetailsDrawer({
//   customer,
//   open,
//   onClose,
//   onDeleted,
//   setEditOpen,
//   onUpdated,
// }: {
//   customer: any;
//   open: boolean;
//   onClose: () => void;
//   onDeleted?: () => void;
//   onUpdated?: () => void;
//   setEditOpen: (arg: boolean) => void;
// }) {
//   const router = useRouter();
//   const [deleting, setDeleting] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);

//   const handleDelete = async () => {
//     try {
//       setDeleting(true);
//       toast.loading("Deleting customer...");
//       await customerService.delete(customer._id);
//       toast.dismiss();
//       toast.success("Customer deleted successfully.");
//       onClose();
//       if (onDeleted) onDeleted();
//     } catch (err) {
//       toast.dismiss();
//       toast.error("Failed to delete customer.");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <Drawer
//       isOpen={open}
//       onClose={onClose}
//       overlayClassName="backdrop-blur"
//       containerClassName="!max-w-[calc(100%-480px)] !shadow-2xl z-[999]"
//     >
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//           Customer Details
//         </h2>
//         <div className="flex items-center gap-2">
//           <Button
//             size="sm"
//             variant="outline"
//             onClick={
//               () => {
//                 setEditOpen(true);
//                 onClose();
//               }
//               // router.push(
//               //   `/tenant/customers-vendors/customer/${customer._id}/edit`
//               // )
//             }
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
//                 toast.loading("Deleting customer...");
//                 await customerService.delete(customer._id);
//                 toast.dismiss();
//                 toast.success(
//                   `Customer ${customer.full_name} deleted successfully.`
//                 );
//                 setDeleteOpen(false);
//                 if (onUpdated) onUpdated();

//                 onClose();

//                 if (onDeleted) onDeleted();
//               } catch {
//                 toast.dismiss();
//                 toast.error("Failed to delete customer.");
//               } finally {
//                 setDeleting(false);
//               }
//             }}
//             loading={deleting}
//             title="Delete Customer"
//             description={`Are you sure you want to delete ${customer.full_name}?`}
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

//       <div className="p-4 overflow-y-auto overflow-x-auto max-w-full">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <WidgetCard title="Personal Info">
//             <br />
//             <InfoGrid
//               items={[
//                 { label: "Full Name", value: customer.full_name },
//                 { label: "Email", value: customer.email },
//                 { label: "Phone Number", value: customer.phone_number },
//                 {
//                   label: "Date of Birth",
//                   value: formatDate(customer.date_of_birth),
//                 },
//                 { label: "Customer Type", value: customer.customer_type },
//                 {
//                   label: "Assigned To",
//                   value: customer.assigned_to?.full_name || "N/A",
//                 },
//               ]}
//             />
//           </WidgetCard>

//           <WidgetCard title="Address">
//             <br />
//             <InfoGrid
//               items={[
//                 { label: "Street", value: customer.address?.street },
//                 { label: "City", value: customer.address?.city },
//                 { label: "State", value: customer.address?.state },
//                 { label: "Postal Code", value: customer.address?.postal_code },
//                 { label: "Country", value: customer.address?.country },
//               ]}
//             />
//           </WidgetCard>

//           <WidgetCard title="Metadata">
//             <br />
//             <InfoGrid
//               items={[
//                 { label: "Created By", value: customer.createdBy?.name },
//                 { label: "Created At", value: formatDate(customer.createdAt) },
//                 { label: "Updated At", value: formatDate(customer.updatedAt) },
//               ]}
//             />
//           </WidgetCard>

//           <WidgetCard title="Notes">
//             <Text className="text-sm text-gray-700 whitespace-pre-line">
//               {customer.notes || "No notes available."}
//             </Text>
//           </WidgetCard>
//         </div>
//       </div>
//     </Drawer>
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

// function formatDate(dateString: string) {
//   return dateString ? dayjs(dateString).format("DD-MMM-YYYY") : "N/A";
// }

// "use client";

// import { useState, useEffect } from "react";
// import { Drawer, Button, Text } from "rizzui";
// import { MdClose, MdEdit, MdDelete } from "react-icons/md";
// import toast from "react-hot-toast";
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import WidgetCard from "@core/components/cards/widget-card";
// import FormFooter from "@core/components/form-footer";
// import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
// import { customerSchema, CustomerSchema } from "@/validators/customer.schema";
// import customerService from "@/services/customerService";
// import CustomerForm from "../create-edit/form";
// import dayjs from "dayjs";

// export default function CustomerDetailsDrawer({
//   customer,
//   open,
//   onClose,
//   onUpdated,
// }: {
//   customer: any;
//   open: boolean;
//   onClose: () => void;
//   onUpdated?: () => void;
// }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);

//   const methods = useForm<CustomerSchema>({
//     resolver: zodResolver(customerSchema),
//     defaultValues: customer,
//   });

//   useEffect(() => {
//     if (customer) {
//       methods.reset(customer);
//     }
//   }, [customer]);

//   const handleSubmit = async (data: CustomerSchema) => {
//     setIsLoading(true);
//     try {
//       await customerService.edit(customer._id, data);
//       toast.success("Customer updated successfully.");
//       setIsEditing(false);
//       onUpdated?.();
//       onClose();
//     } catch (error) {
//       toast.error("Failed to update customer.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       toast.loading("Deleting customer...");
//       await customerService.delete(customer._id);
//       toast.dismiss();
//       toast.success(`Customer ${customer.full_name} deleted successfully.`);
//       setDeleteOpen(false);
//       onUpdated?.();
//       onClose();
//     } catch {
//       toast.dismiss();
//       toast.error("Failed to delete customer.");
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
//           Customer Details
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
//               <MdEdit className="me-1" /> Edit
//             </Button>
//           )}

//           <DeleteConfirmModal
//             isOpen={deleteOpen}
//             onClose={() => setDeleteOpen(false)}
//             onConfirm={handleDelete}
//             loading={isLoading}
//             title="Delete Customer"
//             description={`Are you sure you want to delete ${customer.full_name}?`}
//           />

//           <Button
//             size="sm"
//             variant="outline"
//             onClick={() => setDeleteOpen(true)}
//           >
//             <MdDelete className="me-1" /> Delete
//           </Button>

//           <Button size="sm" variant="outline" onClick={onClose}>
//             <MdClose className="w-5 h-5" />
//             Close
//           </Button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
//         {isEditing ? (
//           <FormProvider {...methods}>
//             <form onSubmit={methods.handleSubmit(handleSubmit)}>
//               <CustomerForm />
//               <FormFooter
//                 submitBtnText="Update Customer"
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
//                   { label: "Full Name", value: customer.full_name },
//                   { label: "Email", value: customer.email },
//                   { label: "Phone Number", value: customer.phone_number },
//                   {
//                     label: "Date of Birth",
//                     value: formatDate(customer.date_of_birth),
//                   },
//                   { label: "Customer Type", value: customer.customer_type },
//                   {
//                     label: "Assigned To",
//                     value: customer.assigned_to?.full_name || "N/A",
//                   },
//                 ]}
//               />
//             </WidgetCard>

//             <WidgetCard title="Address">
//               <br />
//               <InfoGrid
//                 items={[
//                   { label: "Street", value: customer.address?.street },
//                   { label: "City", value: customer.address?.city },
//                   { label: "State", value: customer.address?.state },
//                   {
//                     label: "Postal Code",
//                     value: customer.address?.postal_code,
//                   },
//                   { label: "Country", value: customer.address?.country },
//                 ]}
//               />
//             </WidgetCard>

//             <WidgetCard title="Metadata">
//               <br />
//               <InfoGrid
//                 items={[
//                   { label: "Created By", value: customer.createdBy?.name },
//                   {
//                     label: "Created At",
//                     value: formatDate(customer.createdAt),
//                   },
//                   {
//                     label: "Updated At",
//                     value: formatDate(customer.updatedAt),
//                   },
//                 ]}
//               />
//             </WidgetCard>

//             <WidgetCard title="Notes">
//               <Text className="text-sm text-gray-700 whitespace-pre-line">
//                 {customer.notes || "No notes available."}
//               </Text>
//             </WidgetCard>
//           </div>
//         )}
//       </div>
//     </Drawer>
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

// function formatDate(dateString: string) {
//   return dateString ? dayjs(dateString).format("DD-MMM-YYYY") : "N/A";
// }

"use client";

import { useEffect, useState } from "react";
import { Drawer, Button, Text } from "rizzui";
import { MdClose, MdEdit, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import dayjs from "dayjs";
import FormFooter from "@core/components/form-footer";
import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
import { customerSchema, CustomerSchema } from "@/validators/customer.schema";
import customerService from "@/services/customerService";
import CustomerForm from "../create-edit/form";

export default function CustomerDetailsDrawer({
  customer,
  open,
  onClose,
  onUpdated,
}: {
  customer: any;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const methods = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer,
  });

  useEffect(() => {
    if (customer) {
      const sanitizedCustomer = {
        ...customer,
        assigned_to: customer.assigned_to?._id ?? null, // ✅ Fix here
        assigned_name: customer.assigned_to?.full_name ?? null,
        date_of_birth: customer.date_of_birth
          ? new Date(customer.date_of_birth)
          : null, // Also fix date if using z.date()
      };

      methods.reset(sanitizedCustomer);
    }
  }, [customer]);

  const handleSubmit = async (data: CustomerSchema) => {
    setIsLoading(true);
    try {
      await customerService.edit(customer._id, data);
      toast.success("Customer updated successfully.");
      setIsEditing(false);
      onUpdated?.();
      onClose();
    } catch {
      toast.error("Failed to update customer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      toast.loading("Deleting customer...");
      await customerService.delete(customer._id);
      toast.dismiss();
      toast.success(`Customer ${customer.full_name} deleted successfully.`);
      setDeleteOpen(false);
      onUpdated?.();
      onClose();
    } catch {
      toast.dismiss();
      toast.error("Failed to delete customer.");
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
          Customer Details
        </h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="text" onClick={onClose}>
            <MdClose className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-60px)]">
        {isEditing ? (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              className="min-h-[84vh] flex flex-col"
            >
              {/* Form Content */}
              <div className="flex-1">
                <CustomerForm />
              </div>

              {/* Footer at bottom */}
              <div className="border-muted">
                <FormFooter
                  submitBtnText="Update Customer"
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
                  {customer.photo ? (
                    <img
                      src={customer.photo}
                      alt={customer.full_name}
                      className="min-w-[48px] h-12 w-12 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="min-w-[48px] h-12 w-12 bg-gray-100 rounded-full" />
                  )}
                  <h3 className="text-base font-semibold text-gray-900">
                    {customer.full_name}
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
                    onClick={() => setIsEditing(true)}
                  >
                    <img src="/edit.svg" alt="Edit" className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 pt-4 text-sm p-4">
                {infoRow("Email", customer.email)}
                {infoRow("Phone Number", customer.phone_number)}
                {infoRow("Customer Type", customer.customer_type)}
                {infoRow("Date of Birth", formatDate(customer.date_of_birth))}
                {infoRow("Assigned To", customer.assigned_name)}
                {infoRow("Created At", formatDate(customer.createdAt))}
                {infoRow("Updated At", formatDate(customer.updatedAt))}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-md border border-gray-200 p-4">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Address
              </h4>
              <div className="grid sm:grid-cols-3 gap-6 text-sm">
                {infoRow("Street", customer.address?.street)}
                {infoRow("City", customer.address?.city)}
                {infoRow("State", customer.address?.state)}
                {infoRow("Postal Code", customer.address?.postal_code)}
                {infoRow("Country", customer.address?.country)}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-md border border-gray-200 p-4">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Notes
              </h4>
              <Text className="text-sm text-gray-700 whitespace-pre-line">
                {customer.notes || "No notes available."}
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
        title="Delete Customer"
        description={`Are you sure you want to delete ${customer.full_name}?`}
      />
    </Drawer>
  );
}

function infoRow(label: string, value: any) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-1 font-medium">{label}</p>
      <p className="text-gray-900 font-medium break-words">{value || "N/A"}</p>
    </div>
  );
}

function formatDate(date: any) {
  return date && dayjs(date).isValid()
    ? dayjs(date).format("DD-MMM-YYYY")
    : "N/A";
}
