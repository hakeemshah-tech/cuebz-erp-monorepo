// "use client";

// import React from "react";
// import { Box, Flex, Badge, ActionIcon } from "rizzui";
// import { PiXBold } from "react-icons/pi";
// import dayjs from "dayjs";
// import { TaskType } from "@/types/taskTypes";

// type TaskDetailsModalProps = {
//   task: TaskType;
//   closeModal?: () => void;
// };

// export default function TaskDetailsModal({
//   task,
//   closeModal,
// }: TaskDetailsModalProps) {
//   return (
//     <Box className="p-6 space-y-6 rounded-lg bg-white shadow-md">
//       {/* Header */}
//       <Flex justify="between" align="center" className="border-b pb-4">
//         <h2 className="text-xl font-semibold">Task Details</h2>
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
//         {/* Task Title */}
//         <div>
//           <p className="text-sm text-gray-500">Task Title</p>
//           <p className="text-lg font-medium text-gray-900">
//             {task.title || "N/A"}
//           </p>
//         </div>

//         {/* Assigned To */}
//         <div>
//           <p className="text-sm text-gray-500">Assigned To</p>
//           <p className="text-lg font-medium text-gray-900">
//             {task.assignedTo?.full_name || "N/A"}
//           </p>
//         </div>

//         {/* Priority */}
//         <div>
//           <p className="text-sm text-gray-500">Priority</p>
//           <Badge
//             className={`capitalize ${
//               task.priority === "High"
//                 ? "bg-red-100 text-red-800"
//                 : task.priority === "Medium"
//                   ? "bg-yellow-100 text-yellow-800"
//                   : "bg-green-100 text-green-800"
//             }`}
//           >
//             {task.priority || "N/A"}
//           </Badge>
//         </div>

//         {/* Due Date */}
//         <div>
//           <p className="text-sm text-gray-500">Due Date</p>
//           <p className="text-lg font-medium text-gray-900">
//             {dayjs(task.dueDate).isValid()
//               ? dayjs(task.dueDate).format("DD-MMM-YYYY")
//               : "N/A"}
//           </p>
//         </div>

//         {/* Status */}
//         <div>
//           <p className="text-sm text-gray-500">Status</p>
//           <Badge
//             className={`capitalize ${
//               task.status === "Completed"
//                 ? "bg-green-100 text-green-800"
//                 : task.status === "In Progress"
//                   ? "bg-blue-100 text-blue-800"
//                   : "bg-gray-100 text-gray-800"
//             }`}
//           >
//             {task.status || "N/A"}
//           </Badge>
//         </div>

//         {/* Task Created By */}
//         <div>
//           <p className="text-sm text-gray-500">Created By</p>
//           <p className="text-lg font-medium text-gray-900">
//             {task.createdBy?.full_name || "N/A"}
//           </p>
//         </div>

//         {/* Description */}
//         <div className="col-span-2">
//           <p className="text-sm text-gray-500">Description</p>
//           <p className="text-lg font-medium text-gray-900">
//             {task.description || "N/A"}
//           </p>
//         </div>

//         {/* Comments/Notes */}
//         {task.comments && (
//           <div className="col-span-2">
//             <p className="text-sm text-gray-500">Comments/Notes</p>
//             <p className="text-lg font-medium text-gray-900">
//               {task.comments || "N/A"}
//             </p>
//           </div>
//         )}

//         {/* Attachments */}
//         {(task?.attachments as [])?.length > 0 && (
//           <div className="col-span-2">
//             <p className="text-sm text-gray-500 mb-4">Attachments</p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {(task.attachments as []).map(
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
"use client";

import { useState, useEffect } from "react";
import { Drawer, Button } from "rizzui";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import TaskForm from "../create-edit/form";
import { FormProvider, useForm } from "react-hook-form";
import {
  TaskManagementSchema,
  taskManagementSchema,
} from "@/validators/taskmanagement.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import taskService from "@/services/taskManagementService";
import FormFooter from "@core/components/form-footer";
import dayjs from "dayjs";
import DeleteConfirmModal from "@core/components/DeleteConfirmModal";

export default function TaskManagementDetailsDrawer({
  task,
  open,
  onClose,
  onUpdated,
  refreshData,
}: {
  task: any;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  refreshData?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const methods = useForm<TaskManagementSchema>({
    resolver: zodResolver(taskManagementSchema),
    defaultValues: task,
  });

  useEffect(() => {
    if (task) {
      methods.reset({ ...task, assignedTo: task?.assignedTo?._id });
    }
  }, [task]);

  const handleSubmit = async (data: TaskManagementSchema) => {
    setIsLoading(true);
    try {
      await taskService.edit(task._id, data);
      toast.success("Task updated successfully.");
      refreshData?.();
      onClose();
      onUpdated?.();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update task.");
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
        <h2 className="text-base font-semibold text-gray-900">Task Details</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="text" onClick={onClose}>
            <MdClose className="w-5 h-5" />
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
                <TaskForm />
              </div>

              {/* Footer at bottom */}
              <div className="border-muted">
                <FormFooter
                  submitBtnText="Update Task"
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
                  {task.title || "N/A"}
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
                  label="Assigned To"
                  value={task.assignedTo?.full_name}
                />
                <InfoItem label="Priority" value={task.priority} />
                <InfoItem label="Due Date" value={formatDate(task.dueDate)} />
                <InfoItem label="Status" value={task.status} />
                <InfoItem
                  label="Created By"
                  value={task.createdBy?.full_name}
                />
              </div>
            </div>

            <div className="bg-white border rounded-md p-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                Description
              </h4>
              <p className="text-gray-800 text-sm whitespace-pre-wrap">
                {task.description || "—"}
              </p>
            </div>

            {task.comments && (
              <div className="bg-white border rounded-md p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2">
                  Comments
                </h4>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">
                  {task.comments}
                </p>
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
            toast.loading("Deleting task...");
            await taskService.delete(task._id);
            toast.dismiss();
            toast.success("Task deleted successfully.");
            setDeleteOpen(false);
            if (onUpdated) onUpdated();
            onClose();
            if (refreshData) refreshData();
          } catch {
            toast.dismiss();
            toast.error("Failed to delete task.");
          } finally {
            setDeleting(false);
          }
        }}
        loading={deleting}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
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

function formatDate(dateString: string) {
  return dateString ? dayjs(dateString).format("DD-MMM-YYYY") : "N/A";
}

{
  /* {Array.isArray(task.attachments) && task.attachments.length > 0 && (
              <WidgetCard title="Attachments">
                <br />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {task.attachments.map((attachment: string, index: number) => {
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
                              <span className="text-sm font-medium">File</span>
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
                  })}
                </div>
              </WidgetCard>
            )} */
}
