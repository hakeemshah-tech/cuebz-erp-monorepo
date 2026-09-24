"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tab, Button } from "rizzui";
import employeeService from "@/services/employeeService";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { MdArrowBack } from "react-icons/md";
import Image from "next/image";

export default function EmployeeDetailsPage() {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { id }: { id: string } = useParams(); // ✅ Extracts Employee ID from URL

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails();
    }
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await employeeService.getById(id);
      if (response?.data) {
        setEmployee(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch employee details.");
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

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-600">
          Employee details not found.
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
        <h1 className="text-3xl font-bold">Employee Details</h1>
      </div>

      {/* Tab Layout */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <Tab>
          <Tab.List className="border-b px-6 pt-4 bg-gray-50">
            <Tab.ListItem>Personal Info</Tab.ListItem>
            <Tab.ListItem>Company Details</Tab.ListItem>
            <Tab.ListItem>Documents</Tab.ListItem>
            <Tab.ListItem>Bank & Emergency Info</Tab.ListItem>
            <Tab.ListItem>Comments</Tab.ListItem>
          </Tab.List>
          <Tab.Panels className="p-6">
            {/* Personal Info */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailRow label="Full Name" value={employee.full_name} />
                <DetailRow
                  label="Nationality"
                  value={employee.nationality || "N/A"}
                />
                <DetailRow
                  label="Date of Birth"
                  value={formatDate(employee.date_of_birth)}
                />
                <DetailRow label="Blood Group" value={employee.blood_group} />
                <DetailRow
                  label="Contact Number"
                  value={employee.uae_contact_number}
                />
                <DetailRow
                  label="Home Contact Number"
                  value={employee.home_country_contact_number}
                />
                <DetailRow
                  label="Personal Email"
                  value={employee.personal_email}
                />
              </div>
            </Tab.Panel>

            {/* Company Details */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailRow
                  label="Company Email"
                  value={employee.company_email}
                />
                <DetailRow
                  label="Date of Joining"
                  value={formatDate(employee.date_of_joining)}
                />
                <DetailRow label="Department" value={employee.department} />
                <DetailRow label="Job Title" value={employee.job_title} />
                <DetailRow label="UAE Address" value={employee.uae_address} />
                <DetailRow
                  label="Home Country Address"
                  value={employee.home_country_address || "N/A"}
                />
              </div>
            </Tab.Panel>

            {/* Documents */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FilePreview label="Photo" fileUrl={employee.photo} />
                <FilePreview
                  label="Emirates ID"
                  fileUrl={employee.emirates_id}
                />
                <FilePreview label="Passport" fileUrl={employee.passport_id} />
                <FilePreview label="Visa Copy" fileUrl={employee.visa_copy} />
                <FilePreview label="CV" fileUrl={employee.cv} />
              </div>
            </Tab.Panel>

            {/* Bank & Emergency Info */}
            <Tab.Panel>
              <h3 className="text-lg font-semibold mb-3">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailRow
                  label="Bank Name"
                  value={employee.bank_details?.bank_name}
                />
                <DetailRow
                  label="Account Number"
                  value={employee.bank_details?.account_number}
                />
                <DetailRow label="IBAN" value={employee.bank_details?.iban} />
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">
                Emergency Contact Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailRow
                  label="Contact Name"
                  value={employee.emergency_contact_info?.name}
                />
                <DetailRow
                  label="Relationship"
                  value={employee.emergency_contact_info?.relationship || "N/A"}
                />
                <DetailRow
                  label="Contact Number"
                  value={employee.emergency_contact_info?.contact_number}
                />
              </div>
            </Tab.Panel>

            {/* Comments */}
            <Tab.Panel>
              <div className="p-4 border rounded-lg bg-gray-100">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                <p className="text-gray-700">
                  {employee.comments || "No comments available."}
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
  return dateString ? dayjs(dateString).format("DD-MMM-YYYY") : "N/A";
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
