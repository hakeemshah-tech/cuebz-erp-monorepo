"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tab, Button } from "rizzui";
import callLogService from "@/services/callLogService";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { MdArrowBack } from "react-icons/md";

export default function CallLogDetailsPage() {
  const [callLog, setCallLog] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { id }: { id: string } = useParams(); // ✅ Extracts the ID from the URL

  useEffect(() => {
    if (id) {
      fetchCallLogDetails();
    }
  }, [id]);

  const fetchCallLogDetails = async () => {
    try {
      const response = await callLogService.getById(id);
      if (response?.data) {
        setCallLog(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch call log details.");
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

  if (!callLog) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-600">
          Call log details not found.
        </h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  /* Component for displaying detail rows */
  const DetailRow = ({ label, value }: { label: string; value: string }) => {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-gray-800 text-lg font-semibold">{value || "N/A"}</p>
      </div>
    );
  };

  return (
    <div className="">
      {/* Back Button & Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="px-4 py-2"
        >
          <MdArrowBack className="mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Call Log Details</h1>
      </div>

      {/* Tab Layout */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <Tab>
          <Tab.List className="border-b px-6 pt-4 bg-gray-50">
            <Tab.ListItem>General Details</Tab.ListItem>
            <Tab.ListItem>Additional Info</Tab.ListItem>
            <Tab.ListItem>Comments</Tab.ListItem>
          </Tab.List>
          <Tab.Panels className="p-6">
            {/* General Details */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailRow label="Caller Name" value={callLog.caller_name} />
                <DetailRow
                  label="Caller Contact Number"
                  value={callLog.caller_contact_number}
                />
                <DetailRow
                  label="Caller Company"
                  value={callLog.caller_company}
                />
                <DetailRow label="Visitor Type" value={callLog.visitor_type} />
                <DetailRow
                  label="Purpose of Call"
                  value={callLog.purpose_of_call}
                />
                <DetailRow
                  label="Call Handled By"
                  value={callLog.call_handled_by}
                />
                {/* <DetailRow label="Call Outcome" value={callLog.call_outcome} /> */}
              </div>
            </Tab.Panel>

            {/* Additional Info */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailRow
                  label="Reminder Action Date"
                  value={formatDate(callLog.reminder_action_date)}
                />
                <DetailRow label="Status" value={callLog.status} />
                <DetailRow
                  label="Call Date & Time"
                  value={formatDate(callLog.date_time)}
                />
                <DetailRow
                  label="Created At"
                  value={formatDate(callLog.createdAt)}
                />
                <DetailRow
                  label="Last Updated"
                  value={formatDate(callLog.updatedAt)}
                />
              </div>
            </Tab.Panel>

            {/* Comments */}
            <Tab.Panel>
              <div className="p-4 border rounded-lg bg-gray-100">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                <p className="text-gray-700">
                  {callLog.comments || "No comments available."}
                </p>
              </div>
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
