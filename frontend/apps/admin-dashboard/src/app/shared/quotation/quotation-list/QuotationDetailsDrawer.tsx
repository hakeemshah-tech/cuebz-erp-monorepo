// "use client";

// import React from "react";
// import { Box, Flex, Badge, ActionIcon } from "rizzui";
// import { PiXBold } from "react-icons/pi";
// import dayjs from "dayjs";
// import { QuotationType } from "@/types/quotationTypes";

// type QuotationDetailsModalProps = {
//   quotation: QuotationType;
//   closeModal?: () => void;
// };

// export default function QuotationDetailsModal({
//   quotation,
//   closeModal,
// }: QuotationDetailsModalProps) {
//   return (
//     <Box className="p-6 space-y-6 rounded-lg bg-white shadow-md">
//       {/* Header */}
//       <Flex justify="between" align="center" className="border-b pb-4">
//         <h2 className="text-xl font-semibold">Quotation Details</h2>
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
//         {/* Proposal Number */}
//         <div>
//           <p className="text-sm text-gray-500">Proposal Number</p>
//           <p className="text-lg font-medium text-gray-900">
//             {quotation.proposal_number || "N/A"}
//           </p>
//         </div>

//         {/* Proposal Date */}
//         <div>
//           <p className="text-sm text-gray-500">Proposal Date</p>
//           <p className="text-lg font-medium text-gray-900">
//             {quotation.proposal_date
//               ? dayjs(quotation.proposal_date).format("DD-MMM-YYYY")
//               : "N/A"}
//           </p>
//         </div>

//         {/* Expiry Date */}
//         {quotation.proposal_expiry_date && (
//           <div>
//             <p className="text-sm text-gray-500">Expiry Date</p>
//             <p className="text-lg font-medium text-gray-900">
//               {dayjs(quotation.proposal_expiry_date).format("DD-MMM-YYYY")}
//             </p>
//           </div>
//         )}

//         {/* Lead Identifier */}
//         <div>
//           <p className="text-sm text-gray-500">Linked Lead</p>
//           <p className="text-lg font-medium text-gray-900">
//             {(quotation.lead_id as any)?.lead_identifier_name || "N/A"}
//           </p>
//         </div>

//         {/* Quotation Status */}
//         <div>
//           <p className="text-sm text-gray-500">Status</p>
//           <Badge
//             className={`capitalize px-2 py-1 rounded ${
//               quotation.status === "Draft"
//                 ? "bg-gray-300 text-gray-700"
//                 : quotation.status === "Sent"
//                   ? "bg-blue-100 text-blue-800"
//                   : quotation.status === "Accepted"
//                     ? "bg-green-100 text-green-800"
//                     : "bg-red-100 text-red-800"
//             }`}
//           >
//             {quotation.status || "N/A"}
//           </Badge>
//         </div>

//         {/* Proposal Title */}
//         <div className="col-span-2">
//           <p className="text-sm text-gray-500">Proposal Title</p>
//           <p className="text-lg font-medium text-gray-900">
//             {quotation.proposal_title || "N/A"}
//           </p>
//         </div>

//         {/* Proposal Details */}
//         <div className="col-span-2">
//           <p className="text-sm text-gray-500">Proposal Details</p>
//           <p className="text-lg font-medium text-gray-900">
//             {quotation.proposal_details || "N/A"}
//           </p>
//         </div>

//         {/* Items List */}
//         <div className="col-span-2">
//           <p className="text-sm text-gray-500 mb-2">Items</p>
//           <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
//             <table className="w-full text-sm text-gray-700">
//               <thead>
//                 <tr className="text-left font-medium border-b">
//                   <th className="py-2">Item Name</th>
//                   <th className="py-2">Description</th>
//                   <th className="py-2">Quantity</th>
//                   <th className="py-2">Unit Price</th>
//                   <th className="py-2">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {quotation.items.map((item, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="py-2">{item.item_name}</td>
//                     <td className="py-2">{item.description || "N/A"}</td>
//                     <td className="py-2">{item.quantity}</td>
//                     <td className="py-2">${item.unit_price.toFixed(2)}</td>
//                     <td className="py-2 font-semibold">
//                       ${item.total_price.toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Financial Summary */}
//         <div className="col-span-2">
//           <p className="text-sm text-gray-500">Financial Summary</p>
//           <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//             <div className="flex justify-between">
//               <span>Subtotal:</span>
//               <span className="font-medium">
//                 ${quotation.subtotal.toFixed(2)}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span>VAT:</span>
//               <span className="font-medium">${quotation.vat.toFixed(2)}</span>
//             </div>
//             <hr className="my-2" />
//             <div className="flex justify-between text-lg font-semibold">
//               <span>Total Amount:</span>
//               <span>${quotation.total_amount.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Payment Terms */}
//         <div className="col-span-2">
//           <p className="text-sm text-gray-500">Payment Terms</p>
//           <p className="text-lg font-medium text-gray-900">
//             {quotation.payment_terms || "N/A"}
//           </p>
//         </div>

//         {/* Terms & Conditions */}
//         <div className="col-span-2">
//           <p className="text-sm text-gray-500">Terms & Conditions</p>
//           <p className="text-lg font-medium text-gray-900">
//             {quotation.termsCondition || "N/A"}
//           </p>
//         </div>

//         {/* Comments */}
//         {quotation.comments && (
//           <div className="col-span-2">
//             <p className="text-sm text-gray-500">Comments</p>
//             <p className="text-lg font-medium text-gray-900">
//               {quotation.comments}
//             </p>
//           </div>
//         )}

//         {/* Attachments */}
//         {(quotation.attachments as any)?.length > 0 && (
//           <div className="col-span-2">
//             <p className="text-sm text-gray-500 mb-4">Attachments</p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {(quotation.attachments as any).map(
//                 (attachment: any, index: number) => (
//                   <div key={index} className="p-4 bg-gray-50 border rounded-lg">
//                     <p className="text-sm font-medium text-gray-700 truncate">
//                       {attachment.file_name}
//                     </p>
//                     <a
//                       href={attachment.file_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 text-sm font-medium hover:underline"
//                     >
//                       View
//                     </a>
//                   </div>
//                 )
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </Box>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Drawer, Button, Badge } from "rizzui";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

import quotationService from "@/services/quotationService";
import {
  quotationSchema,
  QuotationSchema,
} from "@/validators/quotation.schema";
import QuotationForm from "../create-edit/form";
import FormFooter from "@core/components/form-footer";
import DeleteConfirmModal from "@core/components/DeleteConfirmModal";

export default function QuotationDetailsDrawer({
  quotation,
  open,
  onClose,
  refreshData,
}: {
  quotation: any;
  open: boolean;
  onClose: () => void;
  refreshData?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const methods = useForm<QuotationSchema>({
    resolver: zodResolver(quotationSchema),
    defaultValues: quotation,
  });

  useEffect(() => {
    if (quotation) methods.reset(quotation);
  }, [quotation]);

  const handleSubmit = async (data: QuotationSchema) => {
    setIsLoading(true);
    try {
      await quotationService.edit(quotation._id, data);
      toast.success("Quotation updated successfully.");
      refreshData?.();
      onClose();
    } catch {
      toast.error("Failed to update quotation.");
    } finally {
      setIsLoading(false);
    }
  };

  const InfoItem = ({ label, value }: { label: string; value?: string }) => (
    <div>
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 break-words">
        {value || "N/A"}
      </p>
    </div>
  );

  return (
    <Drawer
      isOpen={open}
      onClose={() => {
        setIsEditing(false);
        onClose();
      }}
      containerClassName="w-full sm:!max-w-[calc(100%-530px)] !shadow-2xl z-[999]"
    >
      <div className="flex items-center justify-between px-5 py-3 bg-[#F5F6F7] border-b border-gray-300">
        <h2 className="text-base font-semibold text-gray-900">
          Quotation Details
        </h2>
        <Button size="sm" variant="text" onClick={onClose}>
          <MdClose className="w-5 h-5" />
        </Button>
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
                <QuotationForm />
              </div>

              {/* Footer at bottom */}
              <div className="border-muted">
                <FormFooter
                  submitBtnText="Update Quotation"
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
                  {quotation.proposal_title || "Untitled Quotation"}
                </h3>
                <div className="flex items-center gap-2">
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
                  label="Proposal Number"
                  value={quotation.proposal_number}
                />
                <InfoItem
                  label="Proposal Date"
                  value={dayjs(quotation.proposal_date).format("DD-MMM-YYYY")}
                />
                <InfoItem
                  label="Expiry Date"
                  value={dayjs(quotation.proposal_expiry_date).format(
                    "DD-MMM-YYYY"
                  )}
                />
                <InfoItem
                  label="Customer"
                  value={(quotation.customer_id as any)?.full_name}
                />
                <InfoItem label="Status" value={quotation.status} />
                <InfoItem
                  label="Payment Terms"
                  value={quotation.payment_terms}
                />
              </div>
            </div>

            <div className="bg-white border rounded-md p-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                Proposal Details
              </h4>
              <p className="text-gray-800 text-sm whitespace-pre-wrap">
                {quotation.proposal_details || "—"}
              </p>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          try {
            setDeleting(true);
            toast.loading("Deleting quotation...");
            await quotationService.delete(quotation._id);
            toast.dismiss();
            toast.success("Quotation deleted successfully.");
            setDeleteOpen(false);
            onClose();
            refreshData?.();
          } catch {
            toast.dismiss();
            toast.error("Failed to delete quotation.");
          } finally {
            setDeleting(false);
          }
        }}
        loading={deleting}
        title="Delete Quotation"
        description="Are you sure you want to delete this quotation?"
      />
    </Drawer>
  );
}
