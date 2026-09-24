"use client";

import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input, Select, Button, Textarea, FileInput } from "rizzui";
import { DatePicker } from "@core/ui/datepicker";
import { PiEyeBold } from "react-icons/pi";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import quotationService from "@/services/quotationService.ts";

// Load PDF preview component dynamically
// const PDFPreviewModal = dynamic(() => import("./preview.tsx"), { ssr: false });

export default function InvoiceForm({ filePreviews, setFilePreviews }: any) {
  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();

  const [quotationOptions, setQuotationOptions] = useState([]);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await quotationService.getList();
        const options = response.data.map((quotation: any) => ({
          value: quotation._id,
          label: quotation.proposal_number,
        }));
        setQuotationOptions(options);
      } catch (error) {
        console.error("Error fetching quotations:", error);
      }
    };
    fetchQuotations();

    // Generate a unique invoice number
    generateInvoiceNumber();
  }, []);

  // Generate a unique invoice number
  const generateInvoiceNumber = () => {
    const timestamp = new Date().getTime().toString().slice(-6); // Get last 6 digits of timestamp
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generate 4 random digits
    const invoiceNumber = `INV-${timestamp}-${randomDigits}`;
    setValue("invoice_number", invoiceNumber);
  };

  // Handle file upload
  const handleFileUpload = (file: File | null) => {
    if (file) {
      setFilePreviews((prev: any) => ({
        ...prev,
        payment_receipt: file,
      }));
      setValue("payment_receipt", file);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Invoice Number"
          {...register("invoice_number")}
          error={errors.invoice_number?.message?.toString()}
          disabled
        />

        <Select
          label="Linked Quotation"
          placeholder="Select Quotation"
          options={quotationOptions}
          value={
            quotationOptions.find(
              (option: any) => option.value === watch("quotation_id")
            ) || null
          }
          onChange={(option: any) =>
            setValue("quotation_id", option?.value || "")
          }
          error={errors.quotation_id?.message?.toString()}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Invoice Date
          </label>
          <DatePicker
            selected={
              watch("invoice_date")
                ? new Date(watch("invoice_date"))
                : new Date()
            }
            onChange={(date: Date | null) =>
              setValue("invoice_date", date?.toISOString() || "")
            }
            error={errors.invoice_date?.message?.toString()}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Due Date
          </label>
          <DatePicker
            selected={watch("due_date") ? new Date(watch("due_date")) : null}
            onChange={(date: Date | null) =>
              setValue("due_date", date?.toISOString() || "")
            }
            error={errors.due_date?.message?.toString()}
          />
        </div>

        <Select
          label="Invoice Status"
          options={[
            { value: "Unpaid", label: "Unpaid" },
            { value: "Paid", label: "Paid" },
            { value: "Cancelled", label: "Cancelled" },
            { value: "Refunded", label: "Refunded" },
          ]}
          value={watch("status") || "Unpaid"}
          onChange={(option: any) => setValue("status", option?.value)}
          error={errors.status?.message?.toString()}
        />
      </div>
    </div>
  );
}

{
  /* <hr className="my-8 border-gray-300" /> */
}

{
  /* File Input for Payment Receipt */
}
{
  /* <FileInput
        label="Upload Payment Receipt"
        accept="image/*,application/pdf"
        onChange={(file) => handleFileUpload(file as any)}
        error={errors.payment_receipt?.message?.toString()}
      /> */
}

{
  /* {filePreviews.payment_receipt && (
        <p className="text-sm text-gray-600 mt-2">
          Selected file: {filePreviews.payment_receipt.name}
        </p>
      )} */
}

{
  /* <hr className="my-8 border-gray-300" /> */
}

{
  /* <Button
        variant="outline"
        className="mt-4"
        onClick={() => setShowPDFPreview(true)}
      >
        <PiEyeBold className="mr-2" /> Preview Invoice PDF
      </Button> */
}

{
  /* {showPDFPreview && (
        <PDFPreviewModal
          data={getValues()}
          onClose={() => setShowPDFPreview(false)}
        />
      )} */
}
