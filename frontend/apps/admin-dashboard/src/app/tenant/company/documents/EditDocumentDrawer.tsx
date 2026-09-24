// "use client";

// import { Drawer, Input } from "rizzui";
// import { HiOutlineTrash, HiOutlinePencil, HiDownload } from "react-icons/hi";
// import { useForm } from "react-hook-form";
// import { useEffect } from "react";
// import clsx from "clsx";

// type EditDocumentDrawerProps = {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: FormData) => void;
//   document: {
//     label: string;
//     file: string | null;
//     expiry_date: string | null;
//   };
// };

// export default function EditDocumentDrawer({
//   open,
//   onClose,
//   onSubmit,
//   document,
// }: EditDocumentDrawerProps) {
//   const { register, handleSubmit, setValue, watch, reset } = useForm();

//   useEffect(() => {
//     if (document) {
//       reset({
//         expiry_date: document.expiry_date?.slice(0, 10) || "",
//         file: null,
//       });
//     }
//   }, [document, reset]);

//   const fileUrl = typeof document.file === "string" ? document.file : "";
//   const fileName = fileUrl?.split("/")?.pop() || "No File";

//   const handleSubmitData = (data: any) => {
//     const formData = new FormData();
//     formData.append("expiry_date", data.expiry_date);
//     if (data.file && data.file[0]) {
//       formData.append("file", data.file[0]);
//     }
//     onSubmit(formData);
//   };

//   return (
//     <Drawer isOpen={open} onClose={onClose} size="sm">
//       <form onSubmit={handleSubmit(handleSubmitData)} className="space-y-6 p-5">
//         {/* Upload Section */}
//         <label
//           htmlFor="file-upload"
//           className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl py-10 flex flex-col items-center text-center text-gray-500"
//         >
//           <div className="text-xl">📤</div>
//           <p className="font-medium">Drop or Select file</p>
//           <p className="text-xs text-gray-400">
//             Drop Files here or click browse thorough your machine
//           </p>
//           <input
//             id="file-upload"
//             type="file"
//             accept="application/pdf"
//             {...register("file")}
//             className="hidden"
//           />
//         </label>

//         {/* File Card */}
//         <div className="bg-white border rounded-xl p-4">
//           <div className="font-semibold mb-2">{document.label}</div>
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <span className="text-red-600 font-semibold">📄 PDF</span>
//             <span className="truncate">{fileName}</span>
//             <div className="ml-auto flex items-center gap-3">
//               <label htmlFor="file-upload">
//                 <HiOutlinePencil className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-800" />
//               </label>
//               {fileUrl && (
//                 <HiDownload
//                   onClick={() => window.open(fileUrl, "_blank")}
//                   className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-800"
//                 />
//               )}
//               <HiOutlineTrash
//                 onClick={() => setValue("file", null)}
//                 className="w-4 h-4 cursor-pointer text-gray-500 hover:text-red-600"
//               />
//             </div>
//           </div>

//           <div className="mt-4">
//             <Input
//               label="Set Expiry Date"
//               type="date"
//               {...register("expiry_date")}
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 pt-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 text-sm font-medium text-white bg-[#7E22CE] hover:bg-[#6b1bb5] rounded-md"
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </Drawer>
//   );
// }

// "use client";

// import { Drawer, Input } from "rizzui";
// import { HiOutlineTrash, HiOutlinePencil, HiDownload } from "react-icons/hi";
// import { useForm } from "react-hook-form";
// import { useEffect } from "react";
// import { DatePicker } from "@core/ui/datepicker";

// type EditDocumentDrawerProps = {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: FormData) => void;
//   document: {
//     label: string;
//     file: string | null;
//     expiry_date: string | null;
//   };
// };

// export default function EditDocumentDrawer({
//   open,
//   onClose,
//   onSubmit,
//   document,
// }: EditDocumentDrawerProps) {
//   const { register, handleSubmit, setValue, watch, reset } = useForm();

//   useEffect(() => {
//     if (document) {
//       reset({
//         expiry_date: document.expiry_date?.slice(0, 10) || "",
//         file: null,
//       });
//     }
//   }, [document, reset]);

//   const fileUrl = typeof document.file === "string" ? document.file : "";
//   const fileName = fileUrl?.split("/")?.pop() || "No File";

//   const handleSubmitData = (data: any) => {
//     const formData = new FormData();
//     formData.append("expiry_date", data.expiry_date);
//     if (data.file && data.file[0]) {
//       formData.append("file", data.file[0]);
//     }
//     onSubmit(formData);
//   };

//   return (
//     <Drawer isOpen={open} onClose={onClose} size="sm" className="relative">
//       {/* Custom Header */}
//       <div className="flex items-center justify-between px-5 py-4 bg-[#E5E7EB] border-b border-gray-300">
//         <h2 className="text-base font-semibold text-gray-900">Edit Files</h2>
//         <button onClick={onClose} type="button" aria-label="Close Drawer">
//           <span className="text-2xl leading-none text-gray-900">&times;</span>
//         </button>
//       </div>
//       <form onSubmit={handleSubmit(handleSubmitData)} className="space-y-6 p-5">
//         {/* Upload Box */}
//         <label
//           htmlFor="file-upload"
//           className="cursor-pointer border-2 border-dashed border-[#D1D5DB] rounded-lg py-10 px-4 flex flex-col items-center text-center bg-[#F9FAFB]"
//         >
//           <img src="/upload-image.png" alt="upload" className="w-32 mb-4" />
//           <p className="text-sm font-semibold text-gray-800">
//             Drop or Select file
//           </p>
//           <p className="text-xs text-gray-500 mt-1">
//             Drop Files here or click browse thorough your machine
//           </p>
//           <input
//             id="file-upload"
//             type="file"
//             accept="application/pdf"
//             {...register("file")}
//             className="hidden"
//           />
//         </label>

//         {/* File Preview Card */}
//         <div className="mt-8">
//           {/* Document Label */}
//           <div className="text-sm font-semibold mb-2">{document.label}</div>

//           {/* File row with PDF icon and file name */}
//           <div className="flex items-center text-sm text-gray-700 mb-5">
//             <span className="mr-2 flex items-center">
//               <img src="/pdf-icon.svg" alt="pdf" className="w-5 h-5 mr-1" />
//               <span className="truncate">{fileName}</span>
//             </span>

//             {/* Show delete icon only if file exists */}
//             {fileName && fileUrl && (
//               <button
//                 type="button"
//                 onClick={() => setValue("file", null)}
//                 className="ml-auto"
//               >
//                 <HiOutlineTrash className="w-4 h-4 text-gray-500 hover:text-red-600" />
//               </button>
//             )}
//           </div>

//           {/* Custom Date Picker */}
//           <div className="mt-8">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Set Expiry Date
//             </label>
//             <DatePicker
//               selected={
//                 watch("expiry_date") ? new Date(watch("expiry_date")) : null
//               }
//               onChange={(date: Date | null) =>
//                 setValue("expiry_date", date ? date.toISOString() : null)
//               }
//               placeholderText="Select expiry date"
//               dateFormat="dd-MMM-yyyy"
//               className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>
//         </div>

//         {/* Footer Buttons */}
//         <div className="flex justify-start gap-3 pt-2 absolute bottom-5">
//           <button
//             type="submit"
//             className="px-4 py-2 text-sm font-medium text-white bg-[#7E22CE] hover:bg-[#6b1bb5] rounded-md"
//           >
//             Save
//           </button>
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </Drawer>
//   );
// }

// "use client";

// import { Drawer } from "rizzui";
// import { HiOutlineTrash } from "react-icons/hi";
// import { useForm } from "react-hook-form";
// import { useEffect, useState } from "react";
// import { DatePicker } from "@core/ui/datepicker";

// type EditDocumentDrawerProps = {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: FormData) => Promise<void>;
//   document: {
//     label: string;
//     file: string | null;
//     expiry_date: string | null;
//   };
// };

// export default function EditDocumentDrawer({
//   open,
//   onClose,
//   onSubmit,
//   document,
// }: EditDocumentDrawerProps) {
//   const { register, handleSubmit, setValue, watch, reset } = useForm();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [markedForDeletion, setMarkedForDeletion] = useState(false);

//   useEffect(() => {
//     if (document) {
//       reset({
//         expiry_date: document.expiry_date || null,
//         file: null,
//       });
//       setMarkedForDeletion(false); // reset deletion state when drawer opens
//     }
//   }, [document, reset]);

//   const watchedFile = watch("file")?.[0] || null;
//   const watchedExpiry = watch("expiry_date");

//   const fileUrl = watchedFile
//     ? URL.createObjectURL(watchedFile)
//     : markedForDeletion
//       ? "" // hide preview if marked for deletion
//       : typeof document.file === "string"
//         ? document.file
//         : "";

//   const fileName = watchedFile
//     ? watchedFile.name
//     : fileUrl?.split("/")?.pop() || "";

//   const handleSubmitData = async (data: any) => {
//     setIsSubmitting(true);
//     try {
//       const fieldName = document.label.toLowerCase().replace(/\s/g, "_");
//       const formData = new FormData();

//       formData.append(
//         "expiry_dates",
//         JSON.stringify({
//           [fieldName]: data.expiry_date || null,
//         })
//       );

//       if (markedForDeletion) {
//         formData.append(fieldName, "null");
//       } else if (data.file && data.file[0]) {
//         formData.append(fieldName, data.file[0]);
//       }

//       await onSubmit(formData);
//     } catch (err) {
//       console.error("Submission failed:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Drawer isOpen={open} onClose={onClose} size="sm" className="relative">
//       {/* Header */}
//       <div className="flex items-center justify-between px-5 py-4 bg-[#E5E7EB] border-b border-gray-300">
//         <h2 className="text-base font-semibold text-gray-900">Edit Files</h2>
//         <button onClick={onClose} type="button" aria-label="Close Drawer">
//           <span className="text-2xl leading-none text-gray-900">&times;</span>
//         </button>
//       </div>

//       <form
//         onSubmit={handleSubmit(handleSubmitData)}
//         className="p-5 pb-24 space-y-6"
//       >
//         {/* Upload UI */}
//         <label
//           htmlFor="file-upload"
//           className="cursor-pointer border-2 border-dashed border-[#D1D5DB] rounded-lg py-10 px-4 flex flex-col items-center text-center bg-[#F9FAFB]"
//         >
//           <img src="/upload-image.png" alt="upload" className="w-16 mb-4" />
//           <p className="text-sm font-semibold text-gray-800">
//             Drop or Select file
//           </p>
//           <p className="text-xs text-gray-500 mt-1">
//             Drop Files here or click browse through your machine
//           </p>
//           <input
//             id="file-upload"
//             type="file"
//             accept="application/pdf"
//             {...register("file")}
//             className="hidden"
//           />
//         </label>

//         {/* File Preview */}
//         {fileUrl && (
//           <div className="mt-8">
//             <div className="text-sm font-semibold mb-2">{document.label}</div>
//             <div className="flex items-center text-sm text-gray-700 mb-5">
//               <span className="mr-2 flex items-center">
//                 <img src="/pdf-icon.svg" alt="pdf" className="w-5 h-5 mr-1" />
//                 <span className="truncate">{fileName}</span>
//               </span>
//               <button
//                 type="button"
//                 onClick={() => setMarkedForDeletion(true)}
//                 className="ml-auto"
//               >
//                 <HiOutlineTrash className="w-4 h-4 text-gray-500 hover:text-red-600" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Expiry Date Picker */}
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Set Expiry Date
//           </label>
//           <DatePicker
//             selected={watchedExpiry ? new Date(watchedExpiry) : null}
//             onChange={(date: Date | null) =>
//               setValue("expiry_date", date ? date.toISOString() : null)
//             }
//             placeholderText="Select expiry date"
//             dateFormat="dd-MMM-yyyy"
//             className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//         </div>

//         {/* Footer */}
//         <div className="absolute bottom-0 left-0 w-full px-5 py-4 bg-white flex justify-start gap-3">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
//               isSubmitting
//                 ? "bg-primary cursor-not-allowed"
//                 : "bg-primary hover:bg-[#6b1bb5]"
//             }`}
//           >
//             {isSubmitting ? "Saving..." : "Save"}
//           </button>
//           <button
//             type="button"
//             disabled={isSubmitting}
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-[#101820] bg-[#9AC6C5] rounded-md"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </Drawer>
//   );
// }
"use client";

import { Drawer } from "rizzui";
import { HiOutlineTrash } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DatePicker } from "@core/ui/datepicker";
import uploadService from "@/services/uploadService";
import toast from "react-hot-toast";

type EditDocumentDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  document: {
    label: string;
    file: any; // can be string or { url, ... }
    expiry_date: string | null;
  };
};

export default function EditDocumentDrawer({
  open,
  onClose,
  onSubmit,
  document,
}: EditDocumentDrawerProps) {
  const { handleSubmit, setValue, watch, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [markedForDeletion, setMarkedForDeletion] = useState(false);

  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    typeof document?.file === "string"
      ? document.file
      : document?.file?.url || "";

  const fileUrl = markedForDeletion ? "" : uploadedUrl || originalUrl;
  const fileName = fileUrl ? fileUrl.split("/").pop() || "" : "";

  // ⬇️ UPDATED: use presigned upload flow
  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl?.files?.[0];
    if (!file) return;

    // optional: enforce PDF if needed (you already set accept="application/pdf")
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      inputEl.value = "";
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
      // 👉 direct to S3 via presigned URL
      const { url } = await uploadService.uploadViaPresignedUrl(file, folder);

      // `url` is the S3 public URL (or your CDN URL if you set ASSET_CDN_URL)
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
      const fieldName = (document.label || "")
        .toLowerCase()
        .replace(/\s/g, "_");

      const payload: any = {
        expiry_dates: { [fieldName]: watchedExpiry || null },
      };

      if (markedForDeletion) {
        payload[fieldName] = "null";
      } else if (uploadedUrl) {
        payload[fieldName] = uploadedUrl;
      }
      await onSubmit(payload);
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Failed to save changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer isOpen={open} onClose={onClose} size="sm" className="relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#E5E7EB] border-b border-gray-300">
        <h2 className="text-base font-semibold text-gray-900">Edit Files</h2>
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
          />
        </label>

        {/* File Preview */}
        {fileUrl && (
          <div className="mt-8">
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
        <div className="absolute bottom-0 left-0 w-full px-5 py-4 bg-white flex justify-start gap-3">
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

// const handleSubmitData = async () => {
//   setIsSubmitting(true);
//   try {
//     const fieldName = (document.label || "")
//       .toLowerCase()
//       .replace(/\s/g, "_");
//     const formData = new FormData();

//     // expiry_dates payload (server expects object)
//     formData.append(
//       "expiry_dates",
//       JSON.stringify({
//         [fieldName]: watchedExpiry || null,
//       })
//     );

//     // Deletion takes precedence
//     if (markedForDeletion) {
//       formData.append(fieldName, "null");
//     } else if (uploadedUrl) {
//       // send the freshly uploaded URL
//       formData.append(fieldName, uploadedUrl);
//     }
//     // else: no field appended → backend keeps existing URL

//     await onSubmit(formData);
//   } catch (err) {
//     console.error("Submission failed:", err);
//   } finally {
//     setIsSubmitting(false);
//   }
// };

// ⬇️ Upload to your /upload API when a file is chosen
// const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   // folder based on label -> snake_case
//   const fieldName = (document?.label || "")
//     .toLowerCase()
//     .replace(/\s+/g, "_");
//   const folder = `documents/${fieldName}`;

//   const toastId = toast.loading("File is uploading...");
//   setIsUploading(true);
//   setMarkedForDeletion(false); // ensure not flagged for deletion if uploading a new one

//   try {
//     // Expectation: uploadService.upload(file, folder) returns a string URL
//     const url = await uploadService.upload(file, folder);
//     setUploadedUrl(url);
//     toast.success("File uploaded!", { id: toastId });
//   } catch (err) {
//     console.error("Upload failed:", err);
//     toast.error("Upload failed", { id: toastId });
//   } finally {
//     // allow re-choose same file by clearing the input
//     e.currentTarget.value = "";
//     setIsUploading(false);
//   }
// };
