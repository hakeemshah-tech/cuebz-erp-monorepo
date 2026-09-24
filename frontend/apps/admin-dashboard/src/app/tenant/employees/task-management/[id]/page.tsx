"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tab, Button } from "rizzui";
import taskService from "@/services/taskManagementService";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { MdArrowBack } from "react-icons/md";
import Image from "next/image";

export default function TaskDetailsPage() {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { id }: { id: string } = useParams(); // ✅ Extracts Task ID from URL

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
    }
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const response = await taskService.getById(id);
      if (response?.data) {
        setTask(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch task details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-600">
          Task details not found.
        </h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back Button & Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="px-4 py-2"
        >
          <MdArrowBack className="mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Task Details</h1>
      </div>

      {/* Tab Layout */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <Tab>
          <Tab.List className="border-b px-6 pt-4 bg-gray-50">
            <Tab.ListItem>Task Information</Tab.ListItem>
            <Tab.ListItem>Assignment</Tab.ListItem>
            <Tab.ListItem>Attachments</Tab.ListItem>
          </Tab.List>
          <Tab.Panels className="p-6">
            {/* Task Information */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailRow label="Title" value={task.title} />
                <DetailRow label="Description" value={task.description} />
                <DetailRow label="Priority" value={task.priority} />
                <DetailRow label="Status" value={task.status} />
                <DetailRow label="Due Date" value={formatDate(task.dueDate)} />
                <DetailRow
                  label="Created At"
                  value={formatDate(task.createdAt)}
                />
                <DetailRow
                  label="Last Updated"
                  value={formatDate(task.updatedAt)}
                />
              </div>
            </Tab.Panel>

            {/* Assignment Details */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailRow
                  label="Assigned To"
                  value={task.assignedTo?.full_name || "N/A"}
                />
                <DetailRow
                  label="Created By"
                  value={`${task.createdBy?.name} (${task.createdBy?.email})`}
                />
              </div>
            </Tab.Panel>

            {/* Attachments */}
            <Tab.Panel>
              {task.attachments && task.attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {task.attachments.map((fileUrl: string, index: number) => (
                    <FilePreview
                      key={index}
                      label={`Attachment ${index + 1}`}
                      fileUrl={fileUrl}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No attachments available.</p>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab>
      </div>
    </div>
  );
}

/* Utility function to format date using Day.js */
const formatDate = (dateString: string) => {
  return dateString ? dayjs(dateString).format("DD-MMM-YYYY HH:mm A") : "N/A";
};

/* Component for displaying detail rows */
const DetailRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-gray-800 text-lg font-semibold">{value || "N/A"}</p>
    </div>
  );
};

/* Component for file preview */
const FilePreview = ({
  label,
  fileUrl,
}: {
  label: string;
  fileUrl: string;
}) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      {fileUrl ? (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <Image src={fileUrl} alt={label} width={100} height={100} />
        </a>
      ) : (
        <p className="text-gray-800 text-lg font-semibold">N/A</p>
      )}
    </div>
  );
};
