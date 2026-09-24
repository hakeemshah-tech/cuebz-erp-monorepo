"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tab, Button } from "rizzui";
import vendorService from "@/services/vendorService";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { MdArrowBack } from "react-icons/md";
import Image from "next/image";

export default function VendorDetailsPage() {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { id }: { id: string } = useParams(); // ✅ Extracts Vendor ID from URL

  useEffect(() => {
    if (id) {
      fetchVendorDetails();
    }
  }, [id]);

  const fetchVendorDetails = async () => {
    try {
      const response = await vendorService.getById(id);
      if (response?.data) {
        setVendor(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch vendor details.");
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

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-600">
          Vendor details not found.
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
        <h1 className="text-3xl font-bold">Vendor Details</h1>
      </div>

      {/* Tab Layout */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <Tab>
          <Tab.List className="border-b px-6 pt-4 bg-gray-50">
            <Tab.ListItem>General Info</Tab.ListItem>
            <Tab.ListItem>Address</Tab.ListItem>
            <Tab.ListItem>Bank Details</Tab.ListItem>
            <Tab.ListItem>Attachments</Tab.ListItem>
            <Tab.ListItem>Additional Info</Tab.ListItem>
          </Tab.List>
          <Tab.Panels className="p-6">
            {/* General Info */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailRow label="Vendor Name" value={vendor.vendor_name} />
                <DetailRow label="Email" value={vendor.email} />
                <DetailRow label="Phone Number" value={vendor.phone_number} />
                <DetailRow
                  label="Contact Person"
                  value={vendor.contact_person}
                />
                <DetailRow label="Vendor Type" value={vendor.vendor_type} />
                <DetailRow
                  label="Assigned To"
                  value={vendor.assigned_to?.full_name || "N/A"}
                />
              </div>
            </Tab.Panel>

            {/* Address */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailRow
                  label="Street"
                  value={vendor.address?.street || "N/A"}
                />
                <DetailRow label="City" value={vendor.address?.city || "N/A"} />
                <DetailRow
                  label="State"
                  value={vendor.address?.state || "N/A"}
                />
                <DetailRow
                  label="Postal Code"
                  value={vendor.address?.postal_code || "N/A"}
                />
                <DetailRow
                  label="Country"
                  value={vendor.address?.country || "N/A"}
                />
              </div>
            </Tab.Panel>

            {/* Bank Details */}
            <Tab.Panel>
              <h3 className="text-lg font-semibold mb-3">Bank Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailRow
                  label="Bank Name"
                  value={vendor.bank_details?.bank_name}
                />
                <DetailRow
                  label="Account Number"
                  value={vendor.bank_details?.account_number}
                />
                <DetailRow
                  label="IBAN Number"
                  value={vendor.bank_details?.iban_number}
                />
                <DetailRow label="Branch" value={vendor.bank_details?.branch} />
              </div>
            </Tab.Panel>

            {/* Attachments */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vendor.attachments?.length > 0 ? (
                  vendor.attachments.map((file: any) => (
                    <FilePreview
                      key={file._id}
                      label={file.file_name}
                      fileUrl={file.file_url}
                    />
                  ))
                ) : (
                  <p className="text-gray-600">No attachments available.</p>
                )}
              </div>
            </Tab.Panel>

            {/* Additional Info */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailRow
                  label="Tax Registration Number"
                  value={vendor.tax_registration_number}
                />
                <DetailRow
                  label="Trade License Number"
                  value={vendor.trade_license_number}
                />
                <DetailRow
                  label="Created At"
                  value={formatDate(vendor.createdAt)}
                />
                <DetailRow
                  label="Updated At"
                  value={formatDate(vendor.updatedAt)}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">Notes</h3>
              <div className="p-4 border rounded-lg bg-gray-100">
                <p className="text-gray-700">
                  {vendor.notes || "No notes available."}
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
