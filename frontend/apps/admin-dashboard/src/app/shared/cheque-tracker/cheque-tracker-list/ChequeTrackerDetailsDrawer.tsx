// "use client";

// import React from "react";
// import { Box, Flex, Badge, ActionIcon } from "rizzui";
// import { PiXBold } from "react-icons/pi";
// import dayjs from "dayjs";

// type ChequeTrackerDetailsModalProps = {
//   cheque: any;
//   closeModal?: () => void;
// };

// export default function ChequeTrackerDetailsModal({
//   cheque,
//   closeModal,
// }: ChequeTrackerDetailsModalProps) {
//   return (
//     <Box className="p-6 space-y-6 rounded-lg bg-white shadow-md">
//       {/* Header */}
//       <Flex justify="between" align="center" className="border-b pb-4">
//         <h2 className="text-xl font-semibold">Cheque Details</h2>
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
//         {/* Cheque Number */}
//         <div>
//           <p className="text-sm text-gray-500">Cheque Number</p>
//           <p className="text-lg font-medium text-gray-900">
//             {cheque.cheque_number || "N/A"}
//           </p>
//         </div>

//         {/* Cheque Date */}
//         <div>
//           <p className="text-sm text-gray-500">Cheque Date</p>
//           <p className="text-lg font-medium text-gray-900">
//             {dayjs(cheque.cheque_date).isValid()
//               ? dayjs(cheque.cheque_date).format("DD-MMM-YYYY")
//               : "N/A"}
//           </p>
//         </div>

//         {/* Amount */}
//         <div>
//           <p className="text-sm text-gray-500">Amount</p>
//           <p className="text-lg font-medium text-gray-900">
//             {cheque.amount ? `₹${cheque.amount}` : "N/A"}
//           </p>
//         </div>

//         {/* Bank Name */}
//         <div>
//           <p className="text-sm text-gray-500">Bank Name</p>
//           <p className="text-lg font-medium text-gray-900">
//             {cheque.bank_name || "N/A"}
//           </p>
//         </div>

//         {/* Payee/Payer Names */}
//         <div>
//           <p className="text-sm text-gray-500">Payee/Payer Name</p>
//           <p className="text-lg font-medium text-gray-900">
//             {cheque.payee_payeer_name || "N/A"}
//           </p>
//         </div>

//         {/* Purpose */}
//         <div>
//           <p className="text-sm text-gray-500">Purpose</p>
//           <p className="text-lg font-medium text-gray-900">
//             {cheque.purpose || "N/A"}
//           </p>
//         </div>

//         {/* Cheque Status */}
//         <div>
//           <p className="text-sm text-gray-500">Cheque Status</p>
//           <Badge
//             className={`capitalize ${
//               cheque.cheque_status === "Cleared"
//                 ? "bg-green-100 text-green-800"
//                 : cheque.cheque_status === "Bounced"
//                   ? "bg-red-100 text-red-800"
//                   : "bg-blue-100 text-blue-800"
//             }`}
//           >
//             {cheque.cheque_status || "N/A"}
//           </Badge>
//         </div>

//         {/* Reminder Date */}
//         <div>
//           <p className="text-sm text-gray-500">Reminder Date</p>
//           <p className="text-lg font-medium text-gray-900">
//             {dayjs(cheque.reminder_date).isValid()
//               ? dayjs(cheque.reminder_date).format("DD-MMM-YYYY")
//               : "N/A"}
//           </p>
//         </div>

//         {/* Attachments */}
//         {(cheque?.attachments as [])?.length > 0 && (
//           <div className="col-span-2">
//             <p className="text-sm text-gray-500 mb-4">Attachments</p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {(cheque.attachments as []).map(
//                 (attachment: string, index: number) => {
//                   const isImage = /\.(jpg|jpeg|png|gif)$/i.test(attachment);
//                   return (
//                     <div
//                       key={index}
//                       className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
//                     >
//                       {/* File Preview */}
//                       <div className="flex items-center justify-center h-32 w-32 bg-white border border-gray-300 rounded-lg overflow-hidden">
//                         {isImage ? (
//                           <img
//                             src={attachment}
//                             alt={`Attachment ${index + 1}`}
//                             className="object-cover h-full w-full"
//                           />
//                         ) : (
//                           <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500">
//                             <span className="text-sm font-medium">File</span>
//                           </div>
//                         )}
//                       </div>

//                       {/* File Name */}
//                       <p className="mt-3 text-sm font-medium text-gray-700 truncate">
//                         {`Attachment ${index + 1}`}
//                       </p>

//                       {/* Actions */}
//                       <div className="mt-2 flex items-center space-x-2">
//                         <a
//                           href={attachment}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 text-sm font-medium hover:underline"
//                         >
//                           View
//                         </a>
//                         <a
//                           href={attachment}
//                           download
//                           className="text-gray-600 text-sm font-medium hover:underline"
//                         >
//                           Download
//                         </a>
//                       </div>
//                     </div>
//                   );
//                 }
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </Box>
//   );
// }

// chequeTrackerDetailsDrawer.tsx
// chequeTrackerDetailsDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import { Drawer, Button, Badge } from "rizzui";
import { MdClose, MdDeleteOutline, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormFooter from "@core/components/form-footer";
import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
import {
  chequeTrackerSchema,
  ChequeTrackerSchema,
} from "@/validators/chequeTracker.schema";
import ChequeTrackerForm from "../create-edit/form";
import chequeService from "@/services/chequeTrackerService";

export default function ChequeTrackerDetailsDrawer({
  cheque,
  open,
  onClose,
  onUpdated,
}: {
  cheque: any;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const methods = useForm<ChequeTrackerSchema>({
    resolver: zodResolver(chequeTrackerSchema),
    defaultValues: cheque,
  });

  useEffect(() => {
    if (cheque) methods.reset(cheque);
  }, [cheque]);

  const handleSubmit = async (data: ChequeTrackerSchema) => {
    setIsLoading(true);
    try {
      await chequeService.edit(cheque._id, data);
      toast.success("Cheque updated successfully.");
      setIsEditing(false);
      onClose();
      onUpdated?.();
    } catch {
      toast.error("Failed to update cheque.");
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
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#F5F6F7] border-b border-gray-300">
        <h2 className="text-base font-semibold text-gray-900">
          Cheque Details
        </h2>
        <Button size="sm" variant="text" onClick={handleCloseDrawer}>
          <MdClose className="w-5 h-5" />
        </Button>
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
                <ChequeTrackerForm />
              </div>

              {/* Footer at bottom */}
              <div className="border-muted">
                <FormFooter
                  submitBtnText="Update Cheque"
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
                  Cheque Number: {cheque.cheque_number || "N/A"}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm p-4">
                <InfoItem
                  label="Cheque Date"
                  value={formatDate(cheque.cheque_date)}
                />
                <InfoItem label="Type" value={cheque.cheque_type} />
                <InfoItem
                  label="Amount"
                  value={cheque.amount ? `AED ${cheque.amount}` : "N/A"}
                />
                <InfoItem label="Bank Name" value={cheque.bank_name} />
                <InfoItem label="Payeer Name" value={cheque.payeer_name} />
                <InfoItem label="Payee Name" value={cheque.payee_name} />
                <InfoItem label="Purpose" value={cheque.purpose} />
                <InfoItem
                  label="Status"
                  value={
                    <Badge
                      className={`capitalize ${
                        cheque.cheque_status === "Cleared"
                          ? "bg-green-500 text-white"
                          : cheque.cheque_status === "Bounced"
                            ? "bg-red-500 text-white"
                            : "bg-blue-500 text-white"
                      }`}
                    >
                      {cheque.cheque_status || "N/A"}
                    </Badge>
                  }
                />
                <InfoItem
                  label="Reminder Date"
                  value={formatDate(cheque.reminder_date)}
                />
              </div>
            </div>

            {cheque.attachments?.length > 0 && (
              <div className="bg-white border rounded-md p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2">
                  Attachments
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cheque.attachments.map(
                    (attachment: string, index: number) => {
                      const isImage = /\.(jpg|jpeg|png|gif)$/i.test(attachment);
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center justify-center h-32 w-32 bg-white border border-gray-300 rounded-lg overflow-hidden">
                            {isImage ? (
                              <img
                                src={attachment}
                                alt={`Attachment ${index + 1}`}
                                className="object-cover h-full w-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500">
                                <span className="text-sm font-medium">
                                  File
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="mt-3 text-sm font-medium text-gray-700 truncate">
                            {`Attachment ${index + 1}`}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <a
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 text-sm font-medium hover:underline"
                            >
                              View
                            </a>
                            <a
                              href={attachment}
                              download
                              className="text-gray-600 text-sm font-medium hover:underline"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          try {
            setDeleting(true);
            toast.loading("Deleting cheque...");
            await chequeService.delete(cheque._id);
            toast.dismiss();
            toast.success("Cheque deleted successfully.");
            setDeleteOpen(false);
            onClose();
            onUpdated?.();
          } catch {
            toast.dismiss();
            toast.error("Failed to delete cheque.");
          } finally {
            setDeleting(false);
          }
        }}
        loading={deleting}
        title="Delete Cheque"
        description={`Are you sure you want to delete cheque ${cheque.cheque_number}?`}
      />
    </Drawer>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | JSX.Element;
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

function formatDate(date: string | Date) {
  return date ? dayjs(date).format("DD-MMM-YYYY") : "N/A";
}
