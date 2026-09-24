// "use client";

// import { useEffect, useState } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { Button, Tab, ActionIcon } from "rizzui";
// import Upload from "@core/ui/upload";
// import documentService from "@/services/documentService";
// import { toast } from "react-hot-toast";
// import Image from "next/image";
// import { PiTrashBold } from "react-icons/pi";
// import FormFooter from "@core/components/form-footer";

// export default function DocumentManagementPage() {
//   const methods = useForm();
//   const { handleSubmit, setValue, watch, reset } = methods;

//   const [filePreviews, setFilePreviews] = useState<Record<string, any>>({});
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     fetchDocument();
//   }, []);

//   const fetchDocument = async () => {
//     setLoading(true);
//     try {
//       const response = await documentService.getDocument();
//       if (response?.data) {
//         reset(response.data);
//         setFilePreviews({
//           ...response.data.section_1,
//           ...response.data.section_2,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching document:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const upsertDocument = async (data: any) => {
//     setLoading(true);
//     const formData = new FormData();
//     Object.keys(data).forEach((key) => {
//       if (Array.isArray(data[key])) {
//         data[key].forEach((file) => formData.append(key, file));
//       } else if (data[key]) {
//         formData.append(key, data[key]);
//       }
//     });

//     try {
//       await documentService.upsertDocument(formData);
//       toast.success("Document saved successfully");
//       fetchDocument();
//     } catch (error) {
//       console.error("Error saving document:", error);
//       toast.error("Failed to save document");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = (
//     fieldName: string,
//     event: any,
//     isMultiple = false
//   ) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       if (isMultiple) {
//         const updatedFiles = [
//           ...(watch(fieldName) || []),
//           ...Array.from(files),
//         ];
//         setValue(fieldName, updatedFiles);
//         setFilePreviews((prev) => ({
//           ...prev,
//           [fieldName]: updatedFiles,
//         }));
//       } else {
//         setValue(fieldName, files[0]);
//         setFilePreviews((prev) => ({
//           ...prev,
//           [fieldName]: files[0],
//         }));
//       }
//     }
//   };

//   const handleFileDelete = (fieldName: string, index?: number) => {
//     if (index !== undefined) {
//       const updatedFiles = [...(watch(fieldName) || [])];
//       updatedFiles.splice(index, 1);
//       setValue(fieldName, updatedFiles);
//       setFilePreviews((prev) => ({
//         ...prev,
//         [fieldName]: updatedFiles,
//       }));
//     } else {
//       setValue(fieldName, null);
//       setFilePreviews((prev) => ({
//         ...prev,
//         [fieldName]: null,
//       }));
//     }
//   };

//   const renderSingleFilePreview = (
//     file: File | string | null,
//     fieldName: string
//   ) => {
//     if (!file) return null;
//     const isUrl = typeof file === "string";
//     const fileUrl = isUrl ? file : URL.createObjectURL(file);

//     return (
//       <div className="flex items-center mt-2 border px-3 py-2 rounded-xl">
//         <div
//           className="relative flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden border bg-gray-50 cursor-pointer"
//           onClick={() => window.open(fileUrl, "_blank")}
//         >
//           {isUrl || file.type.startsWith("image/") ? (
//             <Image src={fileUrl} alt={fieldName} width={48} height={48} />
//           ) : (
//             <span className="text-gray-600">File</span>
//           )}
//         </div>
//         <div
//           className="ml-3 truncate cursor-pointer"
//           onClick={() => window.open(fileUrl, "_blank")}
//         >
//           {isUrl ? file.split("/").pop() : file.name}
//         </div>
//         <ActionIcon
//           onClick={() => handleFileDelete(fieldName)}
//           size="sm"
//           variant="flat"
//           color="danger"
//           className="ml-auto"
//         >
//           <PiTrashBold />
//         </ActionIcon>
//       </div>
//     );
//   };

//   const renderMultipleFilePreviews = (
//     files: (File | string)[] | null,
//     fieldName: string
//   ) => {
//     if (!files || files.length === 0) return null;

//     return files.map((file, index) => {
//       const isUrl = typeof file === "string";
//       const fileUrl = isUrl ? file : URL.createObjectURL(file);

//       return (
//         <div
//           key={`${fieldName}-${index}`}
//           className="flex items-center mt-2 border px-3 py-2 rounded-xl"
//         >
//           <div
//             className="relative flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden border bg-gray-50 cursor-pointer"
//             onClick={() => window.open(fileUrl, "_blank")}
//           >
//             {isUrl || file.type.startsWith("image/") ? (
//               <Image
//                 src={fileUrl}
//                 alt={`${fieldName}-${index}`}
//                 width={48}
//                 height={48}
//               />
//             ) : (
//               <span className="text-gray-600">File</span>
//             )}
//           </div>
//           <div
//             className="ml-3 truncate cursor-pointer"
//             onClick={() => window.open(fileUrl, "_blank")}
//           >
//             {isUrl ? file.split("/").pop() : file.name}
//           </div>
//           <ActionIcon
//             onClick={() => handleFileDelete(fieldName, index)}
//             size="sm"
//             variant="flat"
//             color="danger"
//             className="ml-auto"
//           >
//             <PiTrashBold />
//           </ActionIcon>
//         </div>
//       );
//     });
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-semibold mb-4">Document Management</h1>

//       {loading &&     <div className="flex justify-center items-center py-10">
//   <div className="h-6 w-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
// </div>}

//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(upsertDocument)} className="space-y-6">
//           <Tab>
//             <Tab.List>
//               <Tab.ListItem>Legal Documents</Tab.ListItem>
//               <Tab.ListItem>Business Documents</Tab.ListItem>
//             </Tab.List>
//             <Tab.Panels>
//               {/* Panel 1: Legal Documents */}
//               <Tab.Panel>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {[
//                     "trade_license",
//                     "moa",
//                     "aoa",
//                     "emigration_card",
//                     "certificate_of_incorporation",
//                     "shareholder_agreement",
//                     "tenancy_contract_or_ejari",
//                     "vat_registration_certificate",
//                     "corporate_tax_certificate",
//                   ].map((field) => (
//                     <div key={field}>
//                       <Upload
//                         label={field.replace(/_/g, " ").toUpperCase()}
//                         onChange={(e) => handleFileUpload(field, e)}
//                         accept="imgAndPdf"
//                       />
//                       {renderSingleFilePreview(filePreviews[field], field)}
//                     </div>
//                   ))}
//                   {["passport_copies", "visa_residence_permits"].map(
//                     (field) => (
//                       <div key={field}>
//                         <Upload
//                           label={field.replace(/_/g, " ").toUpperCase()}
//                           onChange={(e) => handleFileUpload(field, e, true)}
//                           accept="imgAndPdf"
//                           multiple
//                         />
//                         {renderMultipleFilePreviews(filePreviews[field], field)}
//                       </div>
//                     )
//                   )}
//                 </div>
//               </Tab.Panel>

//               {/* Panel 2: Business Documents */}
//               <Tab.Panel>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {[
//                     "business_plan_document",
//                     "bank_statement",
//                     "power_of_attorney",
//                     "insurance_policies",
//                     "employee_handbook_or_hr_policies",
//                     "intellectual_property_registrations",
//                     "trade_mark_certificate",
//                     "iso_certification",
//                   ].map((field) => (
//                     <div key={field}>
//                       <Upload
//                         label={field.replace(/_/g, " ").toUpperCase()}
//                         onChange={(e) => handleFileUpload(field, e)}
//                         accept="imgAndPdf"
//                       />
//                       {renderSingleFilePreview(filePreviews[field], field)}
//                     </div>
//                   ))}
//                   {["company_policies", "contract_templates"].map((field) => (
//                     <div key={field}>
//                       <Upload
//                         label={field.replace(/_/g, " ").toUpperCase()}
//                         onChange={(e) => handleFileUpload(field, e, true)}
//                         accept="imgAndPdf"
//                         multiple
//                       />
//                       {renderMultipleFilePreviews(filePreviews[field], field)}
//                     </div>
//                   ))}
//                 </div>
//               </Tab.Panel>
//             </Tab.Panels>
//           </Tab>

//           {/* <Button type="submit" disabled={loading}>
//             {loading ? "Saving..." : "Save Document"}
//           </Button> */}

//           <FormFooter
//             isLoading={loading}
//             submitBtnText={loading ? "Saving..." : "Save Document"}
//           />
//         </form>
//       </FormProvider>
//     </div>
//   );
// }

// const upsertDocument = async (data: any) => {
//   setLoading(true);
//   const formData = new FormData();

//   const expiryDates: Record<string, any> = {};

//   Object.keys(data).forEach((key) => {
//     if (key.startsWith("expiry_dates.")) {
//       const field = key.split(".")[1];
//       expiryDates[field] = data[key];
//     } else if (Array.isArray(data[key])) {
//       data[key].forEach((file) => formData.append(key, file));
//     } else if (data[key]) {
//       formData.append(key, data[key]);
//     }
//   });

//   formData.append("expiry_dates", JSON.stringify(expiryDates));

//   try {
//     await documentService.upsertDocument(formData);
//     toast.success("Document saved successfully");
//     fetchDocument();
//   } catch (error) {
//     console.error("Error saving document:", error);
//     toast.error("Failed to save document");
//   } finally {
//     setLoading(false);
//   }
// };

// ----------------------------------------------------------------------------

// "use client";

// import { useEffect, useState } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { Button, Tab, ActionIcon, Input } from "rizzui";
// import Upload from "@core/ui/upload";
// import documentService from "@/services/documentService";
// import { toast } from "react-hot-toast";
// import Image from "next/image";
// import { PiTrashBold } from "react-icons/pi";
// import FormFooter from "@core/components/form-footer";

// export default function DocumentManagementPage() {
//   const methods = useForm();
//   const { handleSubmit, setValue, watch, reset, register } = methods;

//   const [filePreviews, setFilePreviews] = useState<Record<string, any>>({});
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     fetchDocument();
//   }, []);

//   const fetchDocument = async () => {
//     setLoading(true);
//     try {
//       const response = await documentService.getDocument();
//       if (response?.data) {
//         const document = response.data;

//         const expiry_dates: Record<string, any> = {};

//         const collectExpiry = (section: any) => {
//           for (const key in section) {
//             if (Array.isArray(section[key])) {
//               expiry_dates[key] = section[key].map((item: any) =>
//                 item?.expiry_date ? item.expiry_date.slice(0, 10) : ""
//               );
//             } else if (section[key]?.expiry_date) {
//               expiry_dates[key] = section[key].expiry_date.slice(0, 10);
//             }
//           }
//         };

//         collectExpiry(document.section_1);
//         collectExpiry(document.section_2);

//         reset({
//           ...document,
//           expiry_dates,
//         });

//         setFilePreviews({
//           ...document.section_1,
//           ...document.section_2,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching document:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const upsertDocument = async (data: any) => {
//     setLoading(true);
//     const formData = new FormData();

//     const expiryDates = data.expiry_dates || {};

//     Object.keys(data).forEach((key) => {
//       if (key === "expiry_dates") return; // already handled

//       if (Array.isArray(data[key])) {
//         data[key].forEach((file) => formData.append(key, file));
//       } else if (data[key]) {
//         formData.append(key, data[key]);
//       }
//     });

//     formData.append("expiry_dates", JSON.stringify(expiryDates));

//     try {
//       await documentService.upsertDocument(formData);
//       toast.success("Document saved successfully");
//       fetchDocument();
//     } catch (error) {
//       console.error("Error saving document:", error);
//       toast.error("Failed to save document");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = (
//     fieldName: string,
//     event: any,
//     isMultiple = false
//   ) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       if (isMultiple) {
//         const updatedFiles = [
//           ...(watch(fieldName) || []),
//           ...Array.from(files),
//         ];
//         setValue(fieldName, updatedFiles);
//         setFilePreviews((prev) => ({
//           ...prev,
//           [fieldName]: updatedFiles,
//         }));
//       } else {
//         setValue(fieldName, files[0]);
//         setFilePreviews((prev) => ({
//           ...prev,
//           [fieldName]: files[0],
//         }));
//       }
//     }
//   };

//   const handleFileDelete = (fieldName: string, index?: number) => {
//     if (index !== undefined) {
//       const updatedFiles = [...(watch(fieldName) || [])];
//       updatedFiles.splice(index, 1);
//       setValue(fieldName, updatedFiles);
//       setFilePreviews((prev) => ({
//         ...prev,
//         [fieldName]: updatedFiles,
//       }));
//     } else {
//       setValue(fieldName, null);
//       setFilePreviews((prev) => ({
//         ...prev,
//         [fieldName]: null,
//       }));
//     }
//   };

//   const renderExpiryInput = (fieldName: string, index?: number) => {
//     const name =
//       index !== undefined
//         ? `expiry_dates.${fieldName}.${index}`
//         : `expiry_dates.${fieldName}`;

//     return (
//       <Input
//         type="date"
//         {...register(name)}
//         className="ml-3 max-w-[160px]"
//         size="sm"
//       />
//     );
//   };

//   const renderSingleFilePreview = (
//     file: File | { file: string } | null,
//     fieldName: string
//   ) => {
//     if (!file) return null;

//     const isFileObject = file instanceof File;
//     const fileUrl = isFileObject
//       ? URL.createObjectURL(file)
//       : file.file || file;

//     return (
//       <div className="flex items-center mt-2 border px-3 py-2 rounded-xl">
//         <div
//           className="relative flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden border bg-gray-50 cursor-pointer"
//           onClick={() => window.open(fileUrl, "_blank")}
//         >
//           {fileUrl && fileUrl.match(/\.(jpg|jpeg|png|gif|pdf)$/i) ? (
//             <Image src={fileUrl} alt={fieldName} width={48} height={48} />
//           ) : (
//             <span className="text-gray-600">File</span>
//           )}
//         </div>
//         <div
//           className="ml-3 truncate cursor-pointer"
//           onClick={() => window.open(fileUrl, "_blank")}
//         >
//           {isFileObject ? file.name : fileUrl.split("/").pop()}
//         </div>
//         {renderExpiryInput(fieldName)}
//         <ActionIcon
//           onClick={() => handleFileDelete(fieldName)}
//           size="sm"
//           variant="flat"
//           color="danger"
//           className="ml-auto"
//         >
//           <PiTrashBold />
//         </ActionIcon>
//       </div>
//     );
//   };

//   const renderMultipleFilePreviews = (
//     files: (File | string | { file: string })[] | null,
//     fieldName: string
//   ) => {
//     if (!files || files.length === 0) return null;

//     return files.map((file, index) => {
//       let fileUrl = "";

//       if (file instanceof File) {
//         fileUrl = URL.createObjectURL(file);
//       } else if (typeof file === "string") {
//         fileUrl = file;
//       } else if (typeof file === "object" && file?.file) {
//         fileUrl = file.file;
//       }

//       return (
//         <div
//           key={`${fieldName}-${index}`}
//           className="flex items-center mt-2 border px-3 py-2 rounded-xl"
//         >
//           <div
//             className="relative flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden border bg-gray-50 cursor-pointer"
//             onClick={() => window.open(fileUrl, "_blank")}
//           >
//             {fileUrl && fileUrl.match(/\.(jpg|jpeg|png|gif|pdf)$/i) ? (
//               <Image
//                 src={fileUrl}
//                 alt={`${fieldName}-${index}`}
//                 width={48}
//                 height={48}
//               />
//             ) : (
//               <span className="text-gray-600">File</span>
//             )}
//           </div>
//           <div
//             className="ml-3 truncate cursor-pointer"
//             onClick={() => window.open(fileUrl, "_blank")}
//           >
//             {file instanceof File
//               ? file.name
//               : typeof file === "object"
//                 ? file.file?.split("/").pop()
//                 : file.split("/").pop()}
//           </div>
//           {renderExpiryInput(fieldName, index)}
//           <ActionIcon
//             onClick={() => handleFileDelete(fieldName, index)}
//             size="sm"
//             variant="flat"
//             color="danger"
//             className="ml-auto"
//           >
//             <PiTrashBold />
//           </ActionIcon>
//         </div>
//       );
//     });
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-semibold mb-4">Document Management</h1>

//       {loading &&     <div className="flex justify-center items-center py-10">
//   <div className="h-6 w-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
// </div>}

//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(upsertDocument)} className="space-y-6">
//           <Tab>
//             <Tab.List>
//               <Tab.ListItem>Legal Documents</Tab.ListItem>
//               <Tab.ListItem>Business Documents</Tab.ListItem>
//             </Tab.List>
//             <Tab.Panels>
//               <Tab.Panel>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {[
//                     "trade_license",
//                     "moa",
//                     "aoa",
//                     "emigration_card",
//                     "certificate_of_incorporation",
//                     "shareholder_agreement",
//                     "tenancy_contract_or_ejari",
//                     "vat_registration_certificate",
//                     "corporate_tax_certificate",
//                   ].map((field) => (
//                     <div key={field}>
//                       <Upload
//                         label={field.replace(/_/g, " ").toUpperCase()}
//                         onChange={(e) => handleFileUpload(field, e)}
//                         accept="imgAndPdf"
//                       />
//                       {renderSingleFilePreview(filePreviews[field], field)}
//                     </div>
//                   ))}
//                   {["passport_copies", "visa_residence_permits"].map(
//                     (field) => (
//                       <div key={field}>
//                         <Upload
//                           label={field.replace(/_/g, " ").toUpperCase()}
//                           onChange={(e) => handleFileUpload(field, e, true)}
//                           accept="imgAndPdf"
//                           multiple
//                         />
//                         {renderMultipleFilePreviews(filePreviews[field], field)}
//                       </div>
//                     )
//                   )}
//                 </div>
//               </Tab.Panel>
//               <Tab.Panel>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {[
//                     "business_plan_document",
//                     "bank_statement",
//                     "power_of_attorney",
//                     "insurance_policies",
//                     "employee_handbook_or_hr_policies",
//                     "intellectual_property_registrations",
//                     "trade_mark_certificate",
//                     "iso_certification",
//                   ].map((field) => (
//                     <div key={field}>
//                       <Upload
//                         label={field.replace(/_/g, " ").toUpperCase()}
//                         onChange={(e) => handleFileUpload(field, e)}
//                         accept="imgAndPdf"
//                       />
//                       {renderSingleFilePreview(filePreviews[field], field)}
//                     </div>
//                   ))}
//                   {["company_policies", "contract_templates"].map((field) => (
//                     <div key={field}>
//                       <Upload
//                         label={field.replace(/_/g, " ").toUpperCase()}
//                         onChange={(e) => handleFileUpload(field, e, true)}
//                         accept="imgAndPdf"
//                         multiple
//                       />
//                       {renderMultipleFilePreviews(filePreviews[field], field)}
//                     </div>
//                   ))}
//                 </div>
//               </Tab.Panel>
//             </Tab.Panels>
//           </Tab>

//           <FormFooter
//             isLoading={loading}
//             submitBtnText={loading ? "Saving..." : "Save Document"}
//           />
//         </form>
//       </FormProvider>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Tab } from "rizzui";
import documentService from "@/services/documentService";
import { HiDownload, HiOutlinePencil } from "react-icons/hi";
import dayjs from "dayjs";
import EditDocumentDrawer from "./EditDocumentDrawer";
import PageHeader from "@/app/shared/page-header";

function getExpiryText(dateString?: string | null) {
  if (!dateString) return null;

  const today = dayjs();
  const expiry = dayjs(dateString);
  const daysLeft = expiry.diff(today, "day");
  const dateStr = expiry.format("DD-MMM-YYYY");

  if (daysLeft < 0) {
    // (optional) also show the date for expired
    return { text: "Expired", date: dateStr, color: "text-[#EB1400]" };
  }

  if (daysLeft <= 15) {
    // << show date next to "Expiring soon"
    return { text: "Expiring soon", date: dateStr, color: "text-[#5C08B1]" };
  }

  // keep "Valid till" as before
  return { text: `Valid till: ${dateStr}`, color: "text-[#657079]" };
}

function DocumentCard({ label, file, expiry_date, onEdit }: any) {
  const fileUrl =
    typeof file === "string" ? file : file?.url || file?.file?.url || null;
  const displayName = fileUrl?.split("/").pop() || "No File";
  const expiry = getExpiryText(expiry_date);

  return (
    <div className="rounded-md px-4 py-3 bg-white shadow-md">
      {/* Label */}
      <div className="font-semibold text-sm mb-3">{label}</div>

      {/* File row */}
      <div className="flex items-center text-sm text-gray-600 mb-4 gap-2">
        <img src="/pdf-icon.svg" alt="pdf" className="w-5 h-5 mr-1" />
        <span className="truncate text-[#657079]">{displayName}</span>
      </div>

      {/* Footer row */}
      <div className="flex items-center border-t border-[#D1D8DD] pt-3 justify-between">
        {expiry ? (
          expiry.text.startsWith("Valid till:") ? (
            <span className={`text-sm ${expiry.color}`}>
              Valid Till: <b>{expiry.text.split(":")[1].trim()}</b>
            </span>
          ) : (
            <span className={`text-sm font-bold ${expiry.color}`}>
              {expiry.text}
              {expiry.date ? `: ${expiry.date}` : ""}
            </span>
          )
        ) : (
          <span className="text-sm text-[#657079]">—</span>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <img
            src="/edit-doc.svg"
            alt="Edit"
            className="w-5 h-5 cursor-pointer"
            onClick={onEdit}
          />
          {fileUrl && (
            <img
              src="/download-doc.svg"
              alt="Download"
              className="w-5 h-5 cursor-pointer"
              onClick={() => window.open(fileUrl, "_blank")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// function DocumentCard({ label, file, expiry_date, onEdit }: any) {
//   const fileUrl = typeof file === "object" && file?.file ? file.file : file;
//   const displayName = fileUrl?.split("/").pop() || "No File";
//   const expiry = getExpiryText(expiry_date);

//   return (
//     <div className="rounded-md px-4 py-3 bg-white shadow-md">
//       <div className="font-semibold text-sm mb-3">{label}</div>
//       <div className="flex items-center text-sm text-gray-600 mb-4 gap-2">
//         <img src="/pdf-icon.svg" alt="pdf" className="w-5 h-5 mr-1" />
//         <span className="truncate text-[#657079]">{displayName}</span>
//       </div>
//       <div className="flex items-center border-t border-[#D1D8DD] pt-3 justify-between">
//         {expiry && expiry.text.includes("Valid till:") ? (
//           <span className={`text-sm ${expiry.color}`}>
//             <span>
//               Valid Till: <b>{`${expiry.text.split(":")[1]}`}</b>
//             </span>
//           </span>
//         ) : (
//           <span className={`text-sm font-bold ${expiry?.color}`}>
//             {expiry?.text}
//           </span>
//         )}

//         <div className="flex gap-2">
//           <img
//             src="/edit-doc.svg"
//             alt="Edit"
//             className="w-5 h-5"
//             onClick={onEdit}
//           />
//           {fileUrl && (
//             <img
//               src="/download-doc.svg"
//               alt="Edit"
//               className="w-5 h-5"
//               onClick={() => window.open(fileUrl, "_blank")}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

type DocumentSection = {
  [key: string]: {
    file: string | null;
    expiry_date: string | null;
  };
};

type DocumentData = {
  section_1: DocumentSection;
  section_2: DocumentSection;
};

export default function DocumentManagementViewOnly() {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchDocument();
  }, []);

  const fetchDocument = async () => {
    try {
      const response = await documentService.getDocument();
      setDocument(response?.data);
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field: string, section: any, sectionName: string) => {
    setSelectedDoc({
      key: field,
      section: sectionName,
      label: field
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase()),
      ...section[field],
    });
    setDrawerOpen(true);
  };

  // Updated: handleUpdate function in DocumentManagementViewOnly
  const handleUpdate = async (payload: any) => {
    if (!selectedDoc) return;

    try {
      // Ensure expiry_dates is an object (backend expects this)
      if (typeof payload.expiry_dates !== "object") {
        payload.expiry_dates = {};
      }

      await documentService.upsertDocument(payload); // JSON request
      await fetchDocument();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setDrawerOpen(false);
    }
  };

  const renderCards = (fields: string[], section: any, sectionName: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fields.map((field) => (
        <DocumentCard
          key={field}
          label={field
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
          {...section?.[field]}
          onEdit={() => handleEdit(field, section, sectionName)}
        />
      ))}
    </div>
  );

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="mx-auto bg-[#f8f8f8]">
      <PageHeader title="Document Management" breadcrumb={[]} />
      <div className="p-6">
        <Tab
          selectedIndex={selectedTab}
          onChange={setSelectedTab}
          className="gap-0"
        >
          <Tab.List
            className="flex overflow-hidden w-fit gap-0"
            style={{ borderBottom: "5px solid #D1D8DD", width: "100%" }}
          >
            <Tab.ListItem
              className={`px-5 py-2 text-sm font-semibold border-t border-l rounded-tl border-[#D1D8DD] ${
                selectedTab === 0
                  ? "bg-[#D1D8DD] text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Legal Documents
            </Tab.ListItem>
            <Tab.ListItem
              className={`px-5 py-2 text-sm font-semibold border-t border-r border-[#D1D8DD] rounded-tr ${
                selectedTab === 1
                  ? "bg-[#D1D8DD] text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Business Documents
            </Tab.ListItem>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              {renderCards(
                [
                  "trade_license",
                  "moa",
                  "aoa",
                  "emigration_card",
                  "certificate_of_incorporation",
                  "shareholder_agreement",
                  "tenancy_contract_or_ejari",
                  "vat_registration_certificate",
                  "corporate_tax_certificate",
                  "passport_copies",
                  "visa_residence_permits",
                ],
                document?.section_1,
                "section_1"
              )}
            </Tab.Panel>
            <Tab.Panel>
              {renderCards(
                [
                  "business_plan_document",
                  "bank_statement",
                  "power_of_attorney",
                  "insurance_policies",
                  "employee_handbook_or_hr_policies",
                  "intellectual_property_registrations",
                  "trade_mark_certificate",
                  "iso_certification",
                  "company_policies",
                  "contract_templates",
                ],
                document?.section_2,
                "section_2"
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab>
      </div>

      <EditDocumentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleUpdate}
        document={selectedDoc || { label: "", file: null, expiry_date: null }}
      />
    </div>
  );
}
