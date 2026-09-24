"use client";

import { useEffect, useState } from "react";
import { Button, Drawer, Text, Badge } from "rizzui";
import { MdClose } from "react-icons/md";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import dayjs from "dayjs";

import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
import vendorService from "@/services/vendorService";
import VendorForm from "../create-edit/form";
import FormFooter from "@core/components/form-footer";
import { VendorSchema, vendorSchema } from "@/validators/vendor.schema";

export default function VendorDetailsDrawer({
  vendor,
  open,
  onClose,
  onDeleted,
  onUpdated,
}: {
  vendor: any;
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void;
  onUpdated?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const methods = useForm<VendorSchema>({
    resolver: zodResolver(vendorSchema),
    defaultValues: vendor,
  });

  useEffect(() => {
    if (vendor) {
      methods.reset(vendor);
    }
  }, [vendor]);

  const handleSubmit = async (data: VendorSchema) => {
    setIsLoading(true);
    try {
      await vendorService.edit(vendor._id, data);
      toast.success("Vendor updated successfully.");
      setIsEditing(false);
      onUpdated?.();
      onClose();
    } catch {
      toast.error("Failed to update vendor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      toast.loading("Deleting vendor...");
      await vendorService.delete(vendor._id);
      toast.dismiss();
      toast.success(`Vendor ${vendor.vendor_name} deleted successfully.`);
      setDeleteOpen(false);
      onDeleted?.();
      onClose();
    } catch {
      toast.dismiss();
      toast.error("Failed to delete vendor.");
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
          Vendor Details
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
              <div className="flex-1">
                <VendorForm />
              </div>
              <div className="border-muted">
                <FormFooter
                  submitBtnText="Update Vendor"
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
                <h3 className="text-base font-semibold text-gray-900">
                  {vendor.vendor_name}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 pt-4 text-sm p-4">
                {infoRow("Contact Person", vendor.contact_person)}
                {infoRow("Phone Number", vendor.phone_number)}
                {infoRow("Email", vendor.email)}
                {infoRow("Vendor Type", vendor.vendor_type)}
                {infoRow("Assigned To", vendor.assigned_to?.full_name)}
                {infoRow("Created At", formatDate(vendor.createdAt))}
                {infoRow("Updated At", formatDate(vendor.updatedAt))}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-md border border-gray-200 p-4">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Address
              </h4>
              <div className="grid sm:grid-cols-3 gap-6 text-sm">
                {infoRow("Street", vendor.address?.street)}
                {infoRow("City", vendor.address?.city)}
                {infoRow("State", vendor.address?.state)}
                {infoRow("Postal Code", vendor.address?.postal_code)}
                {infoRow("Country", vendor.address?.country)}
              </div>
            </div>

            {/* Services Offered */}
            {vendor.services_offered?.length > 0 && (
              <div className="bg-white rounded-md border border-gray-200 p-4">
                <h4 className="text-base font-semibold text-gray-900 mb-4">
                  Services Offered
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {vendor.services_offered.map((service: string, i: number) => (
                    <li key={i}>{service}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-md border border-gray-200 p-4">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Notes
              </h4>
              <Text className="text-sm text-gray-700 whitespace-pre-line">
                {vendor.notes || "No notes available."}
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
        title="Delete Vendor"
        description={`Are you sure you want to delete ${vendor.vendor_name}?`}
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

{
  /* {vendor.attachments?.length > 0 && (
              <WidgetCard title="Attachments">
                <br />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vendor.attachments.map((attachment: any, index: number) => {
                    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(
                      attachment.file_url
                    );
                    return (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 border rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-center h-32 w-full border rounded">
                          {isImage ? (
                            <img
                              src={attachment.file_url}
                              alt=""
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-gray-500">File</span>
                          )}
                        </div>
                        <p className="mt-2 text-sm truncate">
                          {attachment.file_name}
                        </p>
                        <div className="mt-1 flex gap-2 text-sm">
                          <a
                            href={attachment.file_url}
                            target="_blank"
                            className="text-blue-600"
                          >
                            View
                          </a>
                          <a
                            href={attachment.file_url}
                            download
                            className="text-gray-600"
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
