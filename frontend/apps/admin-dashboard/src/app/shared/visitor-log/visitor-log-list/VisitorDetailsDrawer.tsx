// "use client";

// import { useState } from "react";
// import { Drawer, Badge, Button, Text } from "rizzui";
// import { MdClose, MdDelete, MdEdit } from "react-icons/md";
// import dayjs from "dayjs";
// import toast from "react-hot-toast";
// import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
// import visitorService from "@/services/visitorLogService";
// import { VisitorLogType } from "@/types/visitorLogTypes";

// const statusColors: any = {
//   "Positive Intention": "bg-green-500 text-white",
//   "Neutral Intention": "bg-yellow-500 text-white",
//   "Negative Intention": "bg-red-500 text-white",
// };

// export default function VisitorDetailsDrawer({
//   visitor,
//   open,
//   onClose,
//   onDeleted,
//   setEditOpen,
//   onUpdated,
// }: {
//   visitor: VisitorLogType;
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
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//           Visitor Details
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
//                 toast.loading("Deleting visitor...");
//                 await visitorService.delete(visitor._id);
//                 toast.dismiss();
//                 toast.success(
//                   `Visitor ${visitor.visitor_name} deleted successfully.`
//                 );
//                 setDeleteOpen(false);
//                 if (onUpdated) onUpdated();
//                 onClose();
//                 if (onDeleted) onDeleted();
//               } catch {
//                 toast.dismiss();
//                 toast.error("Failed to delete visitor.");
//               } finally {
//                 setDeleting(false);
//               }
//             }}
//             loading={deleting}
//             title="Delete Visitor"
//             description={`Are you sure you want to delete ${visitor.visitor_name}?`}
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
//           <InfoGrid
//             items={[
//               { label: "Visitor Name", value: visitor.visitor_name },
//               { label: "Visitor Company", value: visitor.visitor_company },
//               { label: "Visitor Type", value: visitor.visitor_type },
//               {
//                 label: "Contact Number",
//                 value: visitor.visitor_contact_number,
//               },
//               { label: "Purpose", value: visitor.purpose_of_visit },
//               { label: "Person Visiting", value: visitor.person_visiting },
//               {
//                 label: "Reminder Action Date",
//                 value: visitor.reminder_action_date
//                   ? dayjs(visitor.reminder_action_date).format("DD-MMM-YYYY")
//                   : "N/A",
//               },
//               {
//                 label: "Status",
//                 value: (
//                   <Badge
//                     className={`py-1 px-3 rounded-full text-sm font-medium ${
//                       statusColors[visitor.status] || "bg-gray-500 text-white"
//                     }`}
//                   >
//                     {visitor.status || "N/A"}
//                   </Badge>
//                 ),
//               },
//             ]}
//           />

//           {visitor.comments && (
//             <div className="lg:col-span-2">
//               <h4 className="text-sm font-medium text-gray-500 mb-1">
//                 Comments/Notes
//               </h4>
//               <Text className="text-sm text-gray-800 whitespace-pre-line">
//                 {visitor.comments}
//               </Text>
//             </div>
//           )}
//         </div>
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

// "use client";

// import { useState, useEffect } from "react";
// import { Drawer, Button, Text, Badge } from "rizzui";
// import { MdClose, MdDelete, MdEdit } from "react-icons/md";
// import toast from "react-hot-toast";
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import dayjs from "dayjs";

// import WidgetCard from "@core/components/cards/widget-card";
// import FormFooter from "@core/components/form-footer";
// import visitorService from "@/services/visitorLogService";
// import VisitorForm from "../create-edit/form";
// import {
//   visitorLogSchema,
//   VisitorLogSchema,
// } from "@/validators/visitorLog.schema";
// import { VisitorLogType } from "@/types/visitorLogTypes";
// import DeletePopover from "@core/components/delete-popover";
// import DeleteConfirmModal from "@core/components/DeleteConfirmModal";

// const statusColors: any = {
//   "Positive Intention": "bg-green-500 text-white",
//   "Neutral Intention": "bg-yellow-500 text-white",
//   "Negative Intention": "bg-red-500 text-white",
// };

// export default function VisitorDetailsDrawer({
//   visitor,
//   open,
//   onClose,
//   onUpdated,
//   refreshData,
// }: {
//   visitor: VisitorLogType;
//   open: boolean;
//   onClose: () => void;
//   onUpdated?: () => void;
//   refreshData?: () => void;
// }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [deleting, setDeleting] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);

//   const methods = useForm<VisitorLogSchema>({
//     resolver: zodResolver(visitorLogSchema),
//     defaultValues: visitor,
//   });

//   useEffect(() => {
//     if (visitor) {
//       methods.reset(visitor);
//     }
//   }, [visitor]);

//   const handleSubmit = async (data: VisitorLogSchema) => {
//     setIsLoading(true);
//     try {
//       await visitorService.edit(visitor._id, data);
//       toast.success("Visitor updated successfully.");
//       refreshData?.();
//       onClose();
//       onUpdated?.();
//     } catch {
//       toast.error("Failed to update visitor.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCloseDrawer = () => {
//     setIsEditing(false);
//     onClose();
//   };

//   return (
//     <Drawer
//       isOpen={open}
//       onClose={onClose}
//       overlayClassName="backdrop-blur"
//       containerClassName="w-full sm:!max-w-[calc(100%-900px)] !shadow-2xl z-[999]"
//     >
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//           Visitor Details
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

//           {/* Delete Confirmation Modal */}
//           <DeleteConfirmModal
//             isOpen={deleteOpen}
//             onClose={() => setDeleteOpen(false)}
//             onConfirm={async () => {
//               try {
//                 setDeleting(true);
//                 toast.loading("Deleting visitor...");
//                 await visitorService.delete(visitor._id);
//                 toast.dismiss();
//                 toast.success(
//                   `Visitor ${visitor.visitor_name} deleted successfully.`
//                 );
//                 setDeleteOpen(false);
//                 if (onUpdated) onUpdated();
//                 onClose();
//                 if (refreshData) refreshData();
//               } catch {
//                 toast.dismiss();
//                 toast.error("Failed to delete visitor.");
//               } finally {
//                 setDeleting(false);
//               }
//             }}
//             loading={deleting}
//             title="Delete Visitor"
//             description={`Are you sure you want to delete ${visitor.visitor_name}?`}
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
//       {/* Content */}
//       <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
//         {isEditing ? (
//           <FormProvider {...methods}>
//             <form onSubmit={methods.handleSubmit(handleSubmit)}>
//               <VisitorForm />
//               <FormFooter
//                 submitBtnText="Update Visitor"
//                 isLoading={isLoading}
//               />
//             </form>
//           </FormProvider>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
//             <WidgetCard>
//               <InfoGrid
//                 items={[
//                   { label: "Visitor Name", value: visitor.visitor_name },
//                   { label: "Visitor Company", value: visitor.visitor_company },
//                   { label: "Visitor Type", value: visitor.visitor_type },
//                   {
//                     label: "Contact Number",
//                     value: visitor.visitor_contact_number,
//                   },
//                   { label: "Purpose", value: visitor.purpose_of_visit },
//                   // { label: "Person Visiting", value: visitor.person_visiting },
//                   {
//                     label: "Reminder Action Date",
//                     value: formatDate(visitor.reminder_action_date),
//                   },
//                 ]}
//               />
//             </WidgetCard>

//             {visitor.comments && (
//               <WidgetCard title="Comments / Notes">
//                 <Text className="text-sm text-gray-700 whitespace-pre-line">
//                   {visitor.comments}
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

// function formatDate(date: string | null | undefined) {
//   return date ? dayjs(date).format("DD-MMM-YYYY") : "N/A";
// }

"use client";

import { useState, useEffect } from "react";
import { Drawer, Button } from "rizzui";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

import FormFooter from "@core/components/form-footer";
import visitorService from "@/services/visitorLogService";
import VisitorForm from "../create-edit/form";
import {
  visitorLogSchema,
  VisitorLogSchema,
} from "@/validators/visitorLog.schema";
import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
import { VisitorLogType } from "@/types/visitorLogTypes";
import { defaultValues } from "../create-edit/form-utils";

export default function VisitorDetailsDrawer({
  visitor,
  open,
  onClose,
  onUpdated,
  refreshData,
}: {
  visitor: any;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  refreshData?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const methods = useForm<VisitorLogSchema>({
    resolver: zodResolver(visitorLogSchema),
    defaultValues: defaultValues(visitor),
  });

  useEffect(() => {
    if (visitor) methods.reset(visitor);
  }, [visitor]);

  const handleSubmit = async (data: VisitorLogSchema) => {
    setIsLoading(true);
    try {
      await visitorService.edit(visitor._id, data);
      toast.success("Visitor updated successfully.");
      refreshData?.();
      onClose();
      onUpdated?.();
      setIsEditing(false);
    } catch {
      toast.error("Failed to update visitor.");
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
          Visitor Details
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
                <VisitorForm />
              </div>

              {/* Footer at bottom */}
              <div className="border-muted">
                <FormFooter
                  submitBtnText="Update Visitor"
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
                  {visitor.visitor_name || "N/A"}
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
                <InfoItem label="Visitor Type" value={visitor.visitor_type} />
                <InfoItem
                  label="Phone Number"
                  value={visitor.visitor_contact_number}
                />
                <InfoItem
                  label="Date of Visit"
                  value={
                    visitor.date
                      ? dayjs(visitor.date).format("DD-MMM-YYYY hh:mm A")
                      : "N/A"
                  }
                />
                <InfoItem
                  label="Visitor Company"
                  value={visitor.visitor_company}
                />
                <InfoItem
                  label="Purpose of Visit"
                  value={visitor.purpose_of_visit}
                />
                <InfoItem
                  label="Reminder Date"
                  value={
                    visitor.reminder_action_date
                      ? dayjs(visitor.reminder_action_date).format(
                          "DD-MMM-YYYY"
                        )
                      : "N/A"
                  }
                />
              </div>
            </div>

            <div className="bg-white border rounded-md p-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                Follow Up Comment
              </h4>
              <p className="text-gray-800 text-sm whitespace-pre-wrap">
                {visitor.follow_up_comment || "—"}
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
            toast.loading("Deleting visitor...");
            await visitorService.delete(visitor._id);
            toast.dismiss();
            toast.success("Visitor deleted successfully.");
            setDeleteOpen(false);
            if (onUpdated) onUpdated();
            onClose();
            if (refreshData) refreshData();
          } catch {
            toast.dismiss();
            toast.error("Failed to delete visitor.");
          } finally {
            setDeleting(false);
          }
        }}
        loading={deleting}
        title="Delete Visitor"
        description={`Are you sure you want to delete this visitor?`}
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
