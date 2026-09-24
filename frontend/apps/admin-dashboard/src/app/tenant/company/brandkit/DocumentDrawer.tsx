// ✅ DocumentDrawer.tsx
"use client";

import { Drawer } from "rizzui";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DatePicker } from "@core/ui/datepicker";
import { HiOutlineTrash } from "react-icons/hi";
import uploadService from "@/services/uploadService";
import toast from "react-hot-toast";

interface DocumentDrawerProps {
  open: boolean;
  onClose: () => void;
  // align with the example: submit an object payload (not raw FormData)
  onSubmit: (data: any) => Promise<void>;
  document: {
    label: string;
    file: string | null; // existing file URL (or null)
    expiry_date: string | null;
  };
}

export default function DocumentDrawer({
  open,
  onClose,
  onSubmit,
  document,
}: DocumentDrawerProps) {
  const { handleSubmit, setValue, watch, reset } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [markedForDeletion, setMarkedForDeletion] = useState(false);

  // new: presigned upload states (same as example)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // init / reset when doc changes
  useEffect(() => {
    if (document) {
      reset({
        expiry_date: document.expiry_date || null,
      });
      setMarkedForDeletion(false);
      setUploadedUrl(null);
    }
  }, [document, reset]);

  const watchedExpiry = watch("expiry_date");

  const originalUrl =
    typeof document?.file === "string" ? document.file || "" : "";
  const fileUrl = markedForDeletion ? "" : uploadedUrl || originalUrl;
  const fileName = fileUrl ? fileUrl.split("/").pop() || "" : "";

  // ⬇️ UPDATED: use presigned upload flow (PDF-only like your example)
  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl?.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      try {
        inputEl.value = "";
      } catch {}
      return;
    }

    const fieldName = (document?.label || "")
      .toLowerCase()
      .replace(/\s+/g, "_");
    const folder = `documents/${fieldName}`;

    const toastId = toast.loading("File is uploading...");
    setIsUploading(true);
    setMarkedForDeletion(false);

    try {
      // direct S3 upload via presigned URL
      const { url } = await uploadService.uploadViaPresignedUrl(file, folder);
      setUploadedUrl(url);
      toast.success("File uploaded!", { id: toastId });
    } catch (err: any) {
      console.error("Upload failed:", err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Upload failed. Please try again.";
      toast.error(msg, { id: toastId });
    } finally {
      try {
        inputEl.value = ""; // allow reselect same file
      } catch {}
      setIsUploading(false);
    }
  };

  const handleSubmitData = async () => {
    setIsSubmitting(true);
    try {
      const fieldKey = (document.label || "")
        .toLowerCase()
        .replace(/\s+/g, "_");

      const payload: any = {
        expiry_dates: { [fieldKey]: watchedExpiry || null },
      };

      if (markedForDeletion) {
        // match your drawer example semantics
        payload[fieldKey] = "null";
      } else if (uploadedUrl) {
        payload[fieldKey] = uploadedUrl;
      }

      await onSubmit(payload);
    } catch (err) {
      console.error("Failed to submit", err);
      toast.error("Failed to save changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer isOpen={open} onClose={onClose} size="sm" className="relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#E5E7EB] border-b border-gray-300">
        <h2 className="text-base font-semibold text-gray-900">Edit Document</h2>
        <button onClick={onClose} type="button" aria-label="Close Drawer">
          <span className="text-2xl leading-none text-gray-900">&times;</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit(handleSubmitData)}
        className="p-5 pb-24 space-y-6"
      >
        {/* Upload UI */}
        <label
          htmlFor="file-upload"
          className="cursor-pointer border-2 border-dashed border-[#D1D5DB] rounded-lg py-10 px-4 flex flex-col items-center text-center bg-[#F9FAFB]"
        >
          <img src="/upload-image.png" alt="upload" className="w-16 mb-4" />
          <p className="text-sm font-semibold text-gray-800">
            {isUploading ? "Uploading..." : "Drop or Select file"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Drop files here or click to browse
          </p>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handlePickFile}
            className="hidden"
            disabled={isUploading || isSubmitting}
          />
        </label>

        {/* File Preview */}
        {fileUrl && (
          <div className="mt-2">
            <div className="text-sm font-semibold mb-2">{document.label}</div>
            <div className="flex items-center text-sm text-gray-700 mb-5">
              <span className="mr-2 flex items-center">
                <img src="/pdf-icon.svg" alt="pdf" className="w-5 h-5 mr-1" />
                <span className="truncate">{fileName}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setMarkedForDeletion(true);
                  setUploadedUrl(null);
                }}
                className="ml-auto"
                title="Delete file"
                disabled={isUploading || isSubmitting}
              >
                <HiOutlineTrash className="w-4 h-4 text-gray-500 hover:text-red-600" />
              </button>
            </div>
          </div>
        )}

        {/* Expiry Date Picker */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Set Expiry Date
          </label>
          <DatePicker
            selected={watchedExpiry ? new Date(watchedExpiry) : null}
            onChange={(date: Date | null) =>
              setValue("expiry_date", date ? date.toISOString() : null)
            }
            placeholderText="Select expiry date"
            dateFormat="dd-MMM-yyyy"
            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full px-5 py-4 bg-white flex justify-start gap-3 border-t">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              isSubmitting || isUploading
                ? "bg-primary/70 cursor-not-allowed"
                : "bg-primary hover:bg-[#6b1bb5]"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            disabled={isSubmitting || isUploading}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#101820] bg-[#9AC6C5] rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </Drawer>
  );
}
