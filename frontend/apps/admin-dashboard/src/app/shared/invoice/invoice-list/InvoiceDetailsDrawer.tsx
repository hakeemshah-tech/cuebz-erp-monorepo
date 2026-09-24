"use client";

import { useEffect, useState } from "react";
import { Drawer, Button, Badge } from "rizzui";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";

import FormFooter from "@core/components/form-footer";
import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
import InvoiceForm from "../create-edit/form";
import invoiceService from "@/services/invoiceService";

export default function InvoiceDetailsDrawer({
  invoice,
  open,
  onClose,
  refreshData,
}: {
  invoice: any;
  open: boolean;
  onClose: () => void;
  refreshData?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const methods = useForm({
    defaultValues: invoice,
  });

  useEffect(() => {
    if (invoice) {
      methods.reset(invoice);
    }
  }, [invoice]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await invoiceService.edit(invoice._id, data);
      toast.success("Invoice updated successfully.");
      refreshData?.();
      onClose();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update invoice.");
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
        <h2 className="text-base font-semibold text-gray-900">
          Invoice Details
        </h2>
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
                <InvoiceForm />
              </div>

              {/* Footer at bottom */}
              <div className="border-muted">
                <FormFooter
                  submitBtnText="Update Invoice"
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
                  {invoice.invoice_number || "N/A"}
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
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <img src="/edit.svg" alt="Edit" className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm p-4">
                <InfoItem
                  label="Invoice Date"
                  value={dayjs(invoice.invoice_date).format("DD-MMM-YYYY")}
                />
                <InfoItem
                  label="Due Date"
                  value={dayjs(invoice.due_date).format("DD-MMM-YYYY")}
                />
                <InfoItem
                  label="Linked Quotation"
                  value={invoice?.quotation_id?.proposal_number || "N/A"}
                />
                <InfoItem
                  label="Status"
                  value={
                    <Badge
                      className={`capitalize px-2 py-1 rounded ${
                        invoice.status === "Unpaid"
                          ? "bg-red-100 text-red-800"
                          : invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "Cancelled"
                              ? "bg-gray-300 text-gray-700"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invoice.status || "N/A"}
                    </Badge>
                  }
                />
              </div>
            </div>

            <div className="bg-white border rounded-md p-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                Financial Summary
              </h4>
              <div className="space-y-2 text-sm">
                <FlexSummary
                  label="Subtotal"
                  value={invoice?.quotation_id?.subtotal}
                />
                <FlexSummary label="VAT" value={invoice?.quotation_id?.vat} />
                <hr />
                <FlexSummary
                  label="Total Amount"
                  value={invoice?.quotation_id?.total_amount}
                  bold
                />
              </div>
            </div>

            {invoice.payment_receipt?.file_url && (
              <div className="bg-white border rounded-md p-4">
                <InfoItem
                  label="Payment Receipt"
                  value={
                    <a
                      href={invoice.payment_receipt.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Payment Receipt
                    </a>
                  }
                />
              </div>
            )}

            {invoice.attachments?.length > 0 && (
              <div className="bg-white border rounded-md p-4">
                <InfoItem
                  label="Attachments"
                  value={
                    <div className="flex flex-wrap gap-2">
                      {invoice.attachments.map((file: any, index: number) => (
                        <a
                          key={index}
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {file.file_name}
                        </a>
                      ))}
                    </div>
                  }
                />
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
            toast.loading("Deleting invoice...");
            await invoiceService.delete(invoice._id);
            toast.dismiss();
            toast.success("Invoice deleted successfully.");
            setDeleteOpen(false);
            onClose();
            refreshData?.();
          } catch {
            toast.dismiss();
            toast.error("Failed to delete invoice.");
          } finally {
            setDeleting(false);
          }
        }}
        loading={deleting}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice?"
      />
    </Drawer>
  );
}

function InfoItem({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-gray-500 font-medium text-xs mb-1">{label}</p>
      <div className="text-gray-900 font-semibold break-words text-sm">
        {value || "N/A"}
      </div>
    </div>
  );
}

function FlexSummary({
  label,
  value,
  bold,
}: {
  label: string;
  value: any;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-700">{label}:</span>
      <span className={bold ? "font-semibold" : ""}>
        AED {value?.toFixed(2) || "0.00"}
      </span>
    </div>
  );
}

{
  /* View PDF Button */
}
{
  /* <div className="flex justify-end">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => setShowPDFPreview(true)}
        >
          <PiEyeBold className="mr-2" /> View Invoice PDF
        </Button>
      </div> */
}
