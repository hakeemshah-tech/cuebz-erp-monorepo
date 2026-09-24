"use client";

import { useFormContext } from "react-hook-form";
import { ActionIcon, Input, Select, Textarea } from "rizzui";
import { DatePicker } from "@core/ui/datepicker";
import Upload from "@core/ui/upload";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { PiTrashBold, PiUploadSimple } from "react-icons/pi";
import countryList from "@/data/countryData";
import employeeService from "@/services/employeeService";
import uploadService from "@/services/uploadService";
import toast from "react-hot-toast";

type FilePreviews = Record<string, File | string | null>;

export default function Form({ filePreviews, setFilePreviews }: any) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [employeeOptions, setEmployeeOptions] = useState([]);
  // per-field uploading state
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getList();
        const options = response.data.map((employee: any) => ({
          value: employee._id,
          label: `${employee.full_name}${employee.job_title ? ` (${employee.job_title})` : ""}`,
        }));
        setEmployeeOptions(options);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Helper: determine allowed type by field
  const isImageField = (name: string) => name === "photo";
  const acceptForField = (name: string) =>
    isImageField(name) ? "image/*" : "application/pdf";

  // Helper: validate file type like the example (strict PDFs except for 'photo')
  const validateFileType = (name: string, file: File) => {
    if (isImageField(name)) {
      const ok = file.type.startsWith("image/");
      return ok ? null : "Please upload an image file.";
    }
    const ok = file.type === "application/pdf";
    return ok ? null : "Please upload a PDF file.";
  };

  // NEW: presigned upload flow
  const handleFileUpload = async (
    name: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    // validate mimetype similar to the example
    const errMsg = validateFileType(name, file);
    if (errMsg) {
      toast.error(errMsg);
      try {
        input.value = "";
      } catch {}
      return;
    }

    const folder = `employees/${name.replace(/\s+/g, "_").toLowerCase()}`;
    const toastId = toast.loading("File is uploading...");
    setUploading((s) => ({ ...s, [name]: true }));

    try {
      // direct to S3 via presigned URL (same as your example)
      const { url } = await uploadService.uploadViaPresignedUrl(file, folder);

      // Save in form & previews
      setValue(name, url);
      setFilePreviews((prev: FilePreviews) => ({ ...prev, [name]: url }));

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
        input.value = ""; // allow reselect same file
      } catch {}
      setUploading((s) => ({ ...s, [name]: false }));
    }
  };

  const handleFileDelete = (fieldName: string) => {
    setValue(fieldName, null);
    setFilePreviews((prev: FilePreviews) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const renderFileCard = (field: string, label: string) => {
    const file = filePreviews[field];
    const isUrl = typeof file === "string";
    const fileName = isUrl ? file?.split("/").pop() : (file as File)?.name;
    const fileUrl = isUrl
      ? (file as string)
      : file instanceof Blob
        ? URL.createObjectURL(file)
        : null;

    const isUploading = !!uploading[field];

    return (
      <div className="flex flex-col gap-3 bg-white rounded-[4px] p-4 hover:shadow-md transition shadow-md">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-800 truncate w-4/5">
            {label}
          </h4>
          <div className="flex gap-2">
            {fileUrl && (
              <button
                onClick={() => window.open(fileUrl, "_blank")}
                title="View"
              >
                <img
                  src="/download-doc.svg"
                  alt="Download"
                  className="w-5 h-5"
                />
              </button>
            )}
            {file && (
              <button
                onClick={() => handleFileDelete(field)}
                title="Delete"
                className="cursor-pointer"
                disabled={isUploading}
              >
                <img src="/delete.svg" alt="Delete" className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
          <img
            src={isImageField(field) ? "/image-icon.svg" : "/pdf-icon.svg"}
            alt="file"
            className="w-4 h-4"
          />
          {isUploading ? "Uploading..." : fileName || "No file uploaded"}
        </div>

        <input
          id={`upload-${field}`}
          type="file"
          accept={acceptForField(field)}
          onChange={(e) => handleFileUpload(field, e)}
          className="hidden"
          disabled={isUploading}
        />
        <label
          htmlFor={`upload-${field}`}
          className={`flex items-center gap-1 text-xs mt-2 cursor-pointer ${
            isUploading
              ? "text-gray-400 pointer-events-none"
              : "text-primary hover:underline"
          }`}
        >
          <PiUploadSimple className="w-4 h-4" />
          {isUploading ? "Uploading..." : "Upload / Replace File"}
        </label>
      </div>
    );
  };

  const handlePreviewClick = (file: File | null) => {
    if (!file) return;
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  const renderFilePreview = (file: File | string | null, fieldName: string) => {
    if (!file) return null;

    const isUrl = typeof file === "string";
    const isImage = isUrl
      ? (file as string).match(/\.(jpg|jpeg|png|webp|gif)$/i)
      : (file as File).type.startsWith("image/");
    const fileUrl = isUrl
      ? (file as string)
      : URL.createObjectURL(file as File);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (fileList && fileList.length > 0) {
        setValue(fieldName, fileList[0]);
        setFilePreviews((prev: any) => ({
          ...prev,
          [fieldName]: fileList[0],
        }));
      }
    };

    return (
      <div className="flex items-center min-h-[58px] rounded-xl border px-3 border-muted dark:border-gray-300 mt-2">
        <div
          className="relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-lg border bg-gray-50 dark:bg-transparent cursor-pointer"
          onClick={() => window.open(fileUrl, "_blank")}
        >
          {isImage ? (
            <Image
              src={fileUrl}
              alt={fieldName}
              className="object-contain"
              fill
            />
          ) : (
            <span className="text-gray-600 font-medium">
              {typeof file === "string" ? "File" : (file as File).name}
            </span>
          )}
        </div>
        <div
          className="truncate px-2.5 text-sm font-medium cursor-pointer"
          onClick={() => window.open(fileUrl, "_blank")}
        >
          {typeof file === "string"
            ? (file as string).split("/").pop()
            : (file as File).name}
        </div>
        <div className="flex items-center ms-auto gap-2">
          <label
            htmlFor={`change-file-${fieldName}`}
            className="cursor-pointer text-sm font-medium text-blue-600 hover:underline"
          >
            Change
          </label>
          <input
            id={`change-file-${fieldName}`}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptForField(fieldName)}
          />
          <ActionIcon
            onClick={() => handleFileDelete(fieldName)}
            size="sm"
            variant="flat"
            color="danger"
          >
            <PiTrashBold className="w-5 h-5" />
          </ActionIcon>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Section: Basic Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Full Name"
            placeholder="Enter full name"
            {...register("full_name")}
            error={errors.full_name?.message?.toString()}
          />

          <Select
            label="Nationality"
            placeholder="Select Nationality"
            options={countryList}
            value={watch("nationality")}
            onChange={(option: any) =>
              setValue("nationality", option?.value || "")
            }
            error={errors.nationality?.message?.toString()}
            searchable={true}
          />

          <Input
            label="Contact Number"
            placeholder="e.g. 05XXXXXXXX"
            {...register("uae_contact_number")}
            error={errors.uae_contact_number?.message?.toString()}
          />

          <Input
            label="Home Country Contact Number"
            placeholder="Enter home country contact number"
            {...register("home_country_contact_number")}
            error={errors.home_country_contact_number?.message?.toString()}
          />

          <Input
            label="Emergency Contact Number"
            placeholder="Enter emergency contact number"
            {...register("emergency_contact_number")}
            error={errors.emergency_contact_number?.message?.toString()}
          />

          <Input
            label="Personal Email"
            placeholder="Enter personal email"
            type="email"
            {...register("personal_email")}
            error={errors.personal_email?.message?.toString()}
          />

          <Input
            label="Company Email"
            placeholder="Enter company email (optional)"
            type="email"
            {...register("company_email")}
            error={errors.company_email?.message?.toString()}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <DatePicker
              selected={
                watch("date_of_birth") ? new Date(watch("date_of_birth")) : null
              }
              onChange={(date: Date | null) => {
                setValue("date_of_birth", date ? date.toISOString() : null);
              }}
              placeholderText="Select date of birth"
              dateFormat="dd-MMM-yyyy"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.date_of_birth && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date_of_birth.message?.toString()}
              </p>
            )}
          </div>

          <Select
            label="Blood Group"
            placeholder="Select blood group"
            options={[
              { value: "A+", label: "A+" },
              { value: "A-", label: "A-" },
              { value: "B+", label: "B+" },
              { value: "B-", label: "B-" },
              { value: "AB+", label: "AB+" },
              { value: "AB-", label: "AB-" },
              { value: "O+", label: "O+" },
              { value: "O-", label: "O-" },
            ]}
            value={watch("blood_group") || ""}
            onChange={(option: any) =>
              setValue("blood_group", option?.value || "")
            }
            error={errors.blood_group?.message?.toString()}
          />
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Section: Employee Documents */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Employee Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "emirates_id", label: "Emirates ID" },
            { name: "passport_id", label: "Passport ID" },
            { name: "visa_copy", label: "Visa Copy" },
            { name: "cv", label: "CV" },
            { name: "photo", label: "Photo (Optional)" }, // image/* allowed
          ].map(({ name, label }) => (
            <div key={name}>{renderFileCard(name, label)}</div>
          ))}
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Section: Job Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Job Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Employee Code"
            placeholder="Enter employee ID/code"
            {...register("employee_code")}
            error={errors.employee_code?.message?.toString()}
          />

          <Select
            label="Employee Type"
            placeholder="Select employee type"
            options={[
              { value: "Permanent", label: "Permanent" },
              { value: "Contract", label: "Contract" },
              { value: "Part-Time", label: "Part-Time" },
              { value: "Intern", label: "Intern" },
              { value: "Other", label: "Other" },
            ]}
            value={watch("employee_type")}
            onChange={(option: any) =>
              setValue("employee_type", option?.value || "")
            }
            error={errors.employee_type?.message?.toString()}
          />

          <Input
            label="Total Years in Company"
            placeholder="Enter total years (e.g., 3)"
            type="number"
            {...register("total_years_in_company", { valueAsNumber: true })}
            error={errors.total_years_in_company?.message?.toString()}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Joining
            </label>
            <DatePicker
              selected={
                watch("date_of_joining")
                  ? new Date(watch("date_of_joining"))
                  : null
              }
              onChange={(date: Date | null) => {
                setValue("date_of_joining", date ? date.toISOString() : null);
              }}
              placeholderText="Select date of joining"
              dateFormat="dd-MMM-yyyy"
              className="w-full mt-1"
            />
            {errors.date_of_joining && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date_of_joining.message?.toString()}
              </p>
            )}
          </div>

          <Input
            label="Department"
            placeholder="Enter department"
            {...register("department")}
            error={errors.department?.message?.toString()}
          />

          <Input
            label="Job Title/Position"
            placeholder="Enter job title or position"
            {...register("job_title")}
            error={errors.job_title?.message?.toString()}
          />

          <Select
            label="Reporting Manager"
            placeholder="Select reporting manager"
            options={employeeOptions}
            searchable
            value={
              employeeOptions.find(
                (option: any) => option.value === watch("reporting_manager")
              ) || null
            }
            onChange={(selected: any) =>
              setValue("reporting_manager", selected.value)
            }
            error={errors.reporting_manager?.message?.toString()}
          />
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Section: Address Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Address Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="UAE Address"
            placeholder="Enter UAE address"
            {...register("uae_address")}
            error={errors.uae_address?.message?.toString()}
          />

          <Input
            label="Home Country Address"
            placeholder="Enter home country address (optional)"
            {...register("home_country_address")}
            error={errors.home_country_address?.message?.toString()}
          />
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Section: Bank Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Bank Name"
            placeholder="Enter bank name"
            {...register("bank_details.bank_name")}
            error={(errors.bank_details as any)?.bank_name?.message?.toString()}
          />

          <Input
            label="Account Number"
            placeholder="Enter account number"
            {...register("bank_details.account_number")}
            error={(
              errors.bank_details as any
            )?.account_number?.message?.toString()}
          />

          <Input
            label="IBAN"
            placeholder="Enter IBAN"
            {...register("bank_details.iban")}
            error={(errors.bank_details as any)?.iban?.message?.toString()}
          />

          <Select
            label="Salary Transfer Mode"
            placeholder="Select salary transfer mode"
            options={[
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Cash", label: "Cash" },
              { value: "Cheque", label: "Cheque" },
            ]}
            value={watch("bank_details.salary_transfer_mode") || ""}
            onChange={(option: any) =>
              setValue("bank_details.salary_transfer_mode", option?.value || "")
            }
            error={(
              errors.bank_details as any
            )?.salary_transfer_mode?.message?.toString()}
          />
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Section: Emergency Contact Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Emergency Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Emergency Contact Name"
            placeholder="Enter emergency contact name"
            {...register("emergency_contact_info.name")}
            error={(
              errors.emergency_contact_info as any
            )?.name?.message?.toString()}
          />

          <Input
            label="Relationship"
            placeholder="Enter relationship"
            {...register("emergency_contact_info.relationship")}
            error={(
              errors.emergency_contact_info as any
            )?.relationship?.message?.toString()}
          />

          <Input
            label="Contact Number"
            placeholder="Enter emergency contact number"
            {...register("emergency_contact_info.contact_number")}
            error={(
              errors.emergency_contact_info as any
            )?.contact_number?.message?.toString()}
          />
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Section: Leave Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Leave Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Casual Leave */}
          <Input
            label="Casual Leave Allowed"
            placeholder="Enter allowed casual leave"
            type="number"
            {...register("leaves.casual.allowed", { valueAsNumber: true })}
            error={(
              errors?.leaves as any
            )?.casual?.allowed?.message?.toString()}
          />

          <Input
            label="Casual Leave Taken"
            placeholder="Enter taken casual leave"
            type="number"
            {...register("leaves.casual.taken", { valueAsNumber: true })}
            error={(errors?.leaves as any)?.casual?.taken?.message?.toString()}
          />

          {/* Sick Leave */}
          <Input
            label="Sick Leave Allowed"
            placeholder="Enter allowed sick leave"
            type="number"
            {...register("leaves.sick.allowed", { valueAsNumber: true })}
            error={(errors?.leaves as any)?.sick?.allowed?.message?.toString()}
          />

          <Input
            label="Sick Leave Taken"
            placeholder="Enter taken sick leave"
            type="number"
            {...register("leaves.sick.taken", { valueAsNumber: true })}
            error={(errors?.leaves as any)?.sick?.taken?.message?.toString()}
          />

          {/* Annual Leave */}
          <Input
            label="Annual Leave Allowed"
            placeholder="Enter allowed annual leave"
            type="number"
            {...register("leaves.annual.allowed", { valueAsNumber: true })}
            error={(
              errors?.leaves as any
            )?.annual?.allowed?.message?.toString()}
          />

          <Input
            label="Annual Leave Taken"
            placeholder="Enter taken annual leave"
            type="number"
            {...register("leaves.annual.taken", { valueAsNumber: true })}
            error={(errors?.leaves as any)?.annual?.taken?.message?.toString()}
          />

          {/* Total Leave */}
          <Input
            label="Total Leave Allowed"
            placeholder="Enter allowed total leave"
            type="number"
            {...register("leaves.total.allowed", { valueAsNumber: true })}
            error={(errors?.leaves as any)?.total?.allowed?.message?.toString()}
          />

          <Input
            label="Total Leave Taken"
            placeholder="Enter taken total leave"
            type="number"
            {...register("leaves.total.taken", { valueAsNumber: true })}
            error={(errors?.leaves as any)?.total?.taken?.message?.toString()}
          />
        </div>
      </div>

      {/* Section: Additional Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Textarea
            label="Medical Conditions"
            placeholder="Enter medical conditions (if any)"
            {...register("medical_conditions")}
            error={errors.medical_conditions?.message?.toString()}
          />

          <Textarea
            label="Comments"
            placeholder="Enter comments (optional)"
            {...register("comments")}
            error={errors.comments?.message?.toString()}
          />
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useFormContext } from "react-hook-form";
// import { ActionIcon, Input, Select, Textarea } from "rizzui";
// import { DatePicker } from "@core/ui/datepicker";
// import Upload from "@core/ui/upload";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { PiTrashBold, PiUploadSimple } from "react-icons/pi";
// import countryList from "@/data/countryData";
// import employeeService from "@/services/employeeService";
// import uploadService from "@/services/uploadService";
// import toast from "react-hot-toast";

// export default function Form({ filePreviews, setFilePreviews }: any) {
//   const {
//     register,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useFormContext();

//   const [employeeOptions, setEmployeeOptions] = useState([]);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await employeeService.getList();
//         const options = response.data.map((employee: any) => ({
//           value: employee._id,
//           label: `${employee.full_name}${employee.job_title ? ` (${employee.job_title})` : ""}`,
//         }));
//         setEmployeeOptions(options);
//       } catch (error) {
//         console.error("Error fetching employee data:", error);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const handleFileUpload = async (
//     name: string,
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const input = event.currentTarget;
//     const file = input.files?.[0];
//     if (!file) return;

//     // Show loading toast
//     const toastId = toast.loading("File is uploading...");

//     try {
//       const url = await uploadService.upload(file, "employees");
//       setValue(name, url);
//       setFilePreviews((prev: any) => ({ ...prev, [name]: url }));

//       // Update toast to success
//       toast.success("File uploaded!", { id: toastId });
//     } catch (err) {
//       // Update toast to error
//       toast.error("Upload failed", { id: toastId });
//       console.error("Upload failed", err);
//     } finally {
//       input.value = ""; // allow re-selecting same file
//     }
//   };

//   const handleFileDelete = (fieldName: string) => {
//     setValue(fieldName, null);
//     setFilePreviews((prev: any) => ({
//       ...prev,
//       [fieldName]: null,
//     }));
//   };

//   const renderFileCard = (field: string, label: string) => {
//     const file = filePreviews[field];
//     const isUrl = typeof file === "string";
//     const fileName = isUrl ? file?.split("/").pop() : file?.name;
//     const fileUrl = isUrl
//       ? file
//       : file instanceof Blob
//         ? URL.createObjectURL(file)
//         : null;

//     return (
//       <div className="flex flex-col gap-3 bg-white rounded-[4px] p-4 hover:shadow-md transition shadow-md">
//         <div className="flex justify-between items-start">
//           <h4 className="text-sm font-medium text-gray-800 truncate w-4/5">
//             {label}
//           </h4>
//           <div className="flex gap-2">
//             {fileUrl && (
//               <button
//                 onClick={() => window.open(fileUrl, "_blank")}
//                 title="View"
//               >
//                 <img
//                   src="/download-doc.svg"
//                   alt="Download"
//                   className="w-5 h-5"
//                 />
//               </button>
//             )}
//             {file && (
//               <button
//                 onClick={() => handleFileDelete(field)}
//                 title="Delete"
//                 className="cursor-pointer"
//               >
//                 <img src="/delete.svg" alt="Delete" className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
//           <img src="/pdf-icon.svg" alt="pdf" className="w-4 h-4" />
//           {fileName || "No file uploaded"}
//         </div>

//         <input
//           id={`upload-${field}`}
//           type="file"
//           accept="application/pdf,image/*"
//           onChange={(e) => handleFileUpload(field, e)}
//           className="hidden"
//         />
//         <label
//           htmlFor={`upload-${field}`}
//           className="flex items-center gap-1 text-xs text-primary mt-2 cursor-pointer hover:underline"
//         >
//           <PiUploadSimple className="w-4 h-4" /> Upload / Replace File
//         </label>
//       </div>
//     );
//   };

//   const handlePreviewClick = (file: File | null) => {
//     if (!file) return;
//     const fileURL = URL.createObjectURL(file);
//     window.open(fileURL, "_blank");
//   };

//   const renderFilePreview = (file: File | string | null, fieldName: string) => {
//     if (!file) return null;

//     const isUrl = typeof file === "string";
//     const isImage = isUrl
//       ? file.endsWith(".jpg") || file.endsWith(".png")
//       : file.type.startsWith("image/");
//     const fileUrl = isUrl ? file : URL.createObjectURL(file);

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//       const fileList = event.target.files;
//       if (fileList && fileList.length > 0) {
//         setValue(fieldName, fileList[0]); // Update the file in the form
//         setFilePreviews((prev: any) => ({
//           ...prev,
//           [fieldName]: fileList[0], // Update the preview
//         }));
//       }
//     };

//     return (
//       <div className="flex items-center min-h-[58px] rounded-xl border px-3 border-muted dark:border-gray-300 mt-2">
//         <div
//           className="relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-lg border bg-gray-50 dark:bg-transparent cursor-pointer"
//           onClick={() => window.open(fileUrl, "_blank")}
//         >
//           {isImage ? (
//             <Image
//               src={fileUrl}
//               alt={fieldName}
//               className="object-contain"
//               fill
//             />
//           ) : (
//             <span className="text-gray-600 font-medium">
//               {typeof file === "string" ? "File" : file.name}
//             </span>
//           )}
//         </div>
//         <div
//           className="truncate px-2.5 text-sm font-medium cursor-pointer"
//           onClick={() => window.open(fileUrl, "_blank")}
//         >
//           {typeof file === "string" ? file.split("/").pop() : file.name}
//         </div>
//         <div className="flex items-center ms-auto gap-2">
//           {/* Change File */}
//           <label
//             htmlFor={`change-file-${fieldName}`}
//             className="cursor-pointer text-sm font-medium text-blue-600 hover:underline"
//           >
//             Change
//           </label>
//           <input
//             id={`change-file-${fieldName}`}
//             type="file"
//             className="hidden"
//             onChange={handleFileChange}
//           />
//           {/* Delete File */}
//           <ActionIcon
//             onClick={() => handleFileDelete(fieldName)}
//             size="sm"
//             variant="flat"
//             color="danger"
//           >
//             <PiTrashBold className="w-5 h-5" />
//           </ActionIcon>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       {/* Section: Basic Details */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Input
//             label="Full Name"
//             placeholder="Enter full name"
//             {...register("full_name")}
//             error={errors.full_name?.message?.toString()}
//           />

//           <Select
//             label="Nationality"
//             placeholder="Select Nationality"
//             options={countryList}
//             value={watch("nationality")}
//             onChange={(option: any) =>
//               setValue("nationality", option?.value || "")
//             }
//             error={errors.nationality?.message?.toString()}
//             searchable={true}
//           />

//           <Input
//             label="Contact Number"
//             placeholder="e.g. 05XXXXXXXX"
//             {...register("uae_contact_number")}
//             error={errors.uae_contact_number?.message?.toString()}
//           />

//           <Input
//             label="Home Country Contact Number"
//             placeholder="Enter home country contact number"
//             {...register("home_country_contact_number")}
//             error={errors.home_country_contact_number?.message?.toString()}
//           />

//           <Input
//             label="Emergency Contact Number"
//             placeholder="Enter emergency contact number"
//             {...register("emergency_contact_number")}
//             error={errors.emergency_contact_number?.message?.toString()}
//           />

//           <Input
//             label="Personal Email"
//             placeholder="Enter personal email"
//             type="email"
//             {...register("personal_email")}
//             error={errors.personal_email?.message?.toString()}
//           />

//           <Input
//             label="Company Email"
//             placeholder="Enter company email (optional)"
//             type="email"
//             {...register("company_email")}
//             error={errors.company_email?.message?.toString()}
//           />

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Date of Birth
//             </label>
//             <DatePicker
//               selected={
//                 watch("date_of_birth") ? new Date(watch("date_of_birth")) : null
//               }
//               onChange={(date: Date | null) => {
//                 setValue("date_of_birth", date ? date.toISOString() : null);
//               }}
//               placeholderText="Select date of birth"
//               dateFormat="dd-MMM-yyyy"
//               className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//             {errors.date_of_birth && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.date_of_birth.message?.toString()}
//               </p>
//             )}
//           </div>

//           <Select
//             label="Blood Group"
//             placeholder="Select blood group"
//             options={[
//               { value: "A+", label: "A+" },
//               { value: "A-", label: "A-" },
//               { value: "B+", label: "B+" },
//               { value: "B-", label: "B-" },
//               { value: "AB+", label: "AB+" },
//               { value: "AB-", label: "AB-" },
//               { value: "O+", label: "O+" },
//               { value: "O-", label: "O-" },
//             ]}
//             value={watch("blood_group") || ""}
//             onChange={(option: any) =>
//               setValue("blood_group", option?.value || "")
//             }
//             error={errors.blood_group?.message?.toString()}
//           />
//         </div>
//       </div>

//       <hr className="my-8 border-gray-300" />

//       {/* Section: Employee Documents */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Employee Documents</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {[
//             { name: "emirates_id", label: "Emirates ID" },
//             { name: "passport_id", label: "Passport ID" },
//             { name: "visa_copy", label: "Visa Copy" },
//             { name: "cv", label: "CV" },
//             { name: "photo", label: "Photo (Optional)" },
//           ].map(({ name, label }) => (
//             <div key={name}>{renderFileCard(name, label)}</div>
//           ))}
//         </div>
//       </div>

//       <hr className="my-8 border-gray-300" />

//       {/* Section: Job Details */}
//       {/* Section: Job Details */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Job Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Input
//             label="Employee Code"
//             placeholder="Enter employee ID/code"
//             {...register("employee_code")}
//             error={errors.employee_code?.message?.toString()}
//           />

//           <Select
//             label="Employee Type"
//             placeholder="Select employee type"
//             options={[
//               { value: "Permanent", label: "Permanent" },
//               { value: "Contract", label: "Contract" },
//               { value: "Part-Time", label: "Part-Time" },
//               { value: "Intern", label: "Intern" },
//               { value: "Other", label: "Other" },
//             ]}
//             value={watch("employee_type")}
//             onChange={(option: any) =>
//               setValue("employee_type", option?.value || "")
//             }
//             error={errors.employee_type?.message?.toString()}
//           />

//           <Input
//             label="Total Years in Company"
//             placeholder="Enter total years (e.g., 3)"
//             type="number"
//             {...register("total_years_in_company", { valueAsNumber: true })}
//             error={errors.total_years_in_company?.message?.toString()}
//           />

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Date of Joining
//             </label>
//             <DatePicker
//               selected={
//                 watch("date_of_joining")
//                   ? new Date(watch("date_of_joining"))
//                   : null
//               }
//               onChange={(date: Date | null) => {
//                 setValue("date_of_joining", date ? date.toISOString() : null);
//               }}
//               placeholderText="Select date of joining"
//               dateFormat="dd-MMM-yyyy"
//               className="w-full mt-1"
//             />
//             {errors.date_of_joining && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.date_of_joining.message?.toString()}
//               </p>
//             )}
//           </div>

//           <Input
//             label="Department"
//             placeholder="Enter department"
//             {...register("department")}
//             error={errors.department?.message?.toString()}
//           />

//           <Input
//             label="Job Title/Position"
//             placeholder="Enter job title or position"
//             {...register("job_title")}
//             error={errors.job_title?.message?.toString()}
//           />

//           <Select
//             label="Reporting Manager"
//             placeholder="Select reporting manager"
//             options={employeeOptions}
//             searchable
//             value={
//               employeeOptions.find(
//                 (option: any) => option.value === watch("reporting_manager")
//               ) || null
//             }
//             onChange={(selected: any) =>
//               setValue("reporting_manager", selected.value)
//             }
//             error={errors.reporting_manager?.message?.toString()}
//           />
//         </div>
//       </div>

//       <hr className="my-8 border-gray-300" />

//       {/* Section: Address Details */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Address Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Input
//             label="UAE Address"
//             placeholder="Enter UAE address"
//             {...register("uae_address")}
//             error={errors.uae_address?.message?.toString()}
//           />

//           <Input
//             label="Home Country Address"
//             placeholder="Enter home country address (optional)"
//             {...register("home_country_address")}
//             error={errors.home_country_address?.message?.toString()}
//           />
//         </div>
//       </div>

//       <hr className="my-8 border-gray-300" />

//       {/* Section: Bank Details */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Input
//             label="Bank Name"
//             placeholder="Enter bank name"
//             {...register("bank_details.bank_name")}
//             error={(errors.bank_details as any)?.bank_name?.message?.toString()}
//           />

//           <Input
//             label="Account Number"
//             placeholder="Enter account number"
//             {...register("bank_details.account_number")}
//             error={(
//               errors.bank_details as any
//             )?.account_number?.message?.toString()}
//           />

//           <Input
//             label="IBAN"
//             placeholder="Enter IBAN"
//             {...register("bank_details.iban")}
//             error={(errors.bank_details as any)?.iban?.message?.toString()}
//           />

//           <Select
//             label="Salary Transfer Mode"
//             placeholder="Select salary transfer mode"
//             options={[
//               { value: "Bank Transfer", label: "Bank Transfer" },
//               { value: "Cash", label: "Cash" },
//               { value: "Cheque", label: "Cheque" },
//             ]}
//             value={watch("bank_details.salary_transfer_mode") || ""}
//             onChange={(option: any) =>
//               setValue("bank_details.salary_transfer_mode", option?.value || "")
//             }
//             error={(
//               errors.bank_details as any
//             )?.salary_transfer_mode?.message?.toString()}
//           />
//         </div>
//       </div>

//       <hr className="my-8 border-gray-300" />

//       {/* Section: Emergency Contact Information */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">
//           Emergency Contact Information
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Input
//             label="Emergency Contact Name"
//             placeholder="Enter emergency contact name"
//             {...register("emergency_contact_info.name")}
//             error={(
//               errors.emergency_contact_info as any
//             )?.name?.message?.toString()}
//           />

//           <Input
//             label="Relationship"
//             placeholder="Enter relationship"
//             {...register("emergency_contact_info.relationship")}
//             error={(
//               errors.emergency_contact_info as any
//             )?.relationship?.message?.toString()}
//           />

//           <Input
//             label="Contact Number"
//             placeholder="Enter emergency contact number"
//             {...register("emergency_contact_info.contact_number")}
//             error={(
//               errors.emergency_contact_info as any
//             )?.contact_number?.message?.toString()}
//           />
//         </div>
//       </div>

//       <hr className="my-8 border-gray-300" />

//       {/* Section: Leave Details */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Leave Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Casual Leave */}
//           <Input
//             label="Casual Leave Allowed"
//             placeholder="Enter allowed casual leave"
//             type="number"
//             {...register("leaves.casual.allowed", { valueAsNumber: true })}
//             error={(
//               errors?.leaves as any
//             )?.casual?.allowed?.message?.toString()}
//           />

//           <Input
//             label="Casual Leave Taken"
//             placeholder="Enter taken casual leave"
//             type="number"
//             {...register("leaves.casual.taken", { valueAsNumber: true })}
//             error={(errors?.leaves as any)?.casual?.taken?.message?.toString()}
//           />

//           {/* Sick Leave */}
//           <Input
//             label="Sick Leave Allowed"
//             placeholder="Enter allowed sick leave"
//             type="number"
//             {...register("leaves.sick.allowed", { valueAsNumber: true })}
//             error={(errors?.leaves as any)?.sick?.allowed?.message?.toString()}
//           />

//           <Input
//             label="Sick Leave Taken"
//             placeholder="Enter taken sick leave"
//             type="number"
//             {...register("leaves.sick.taken", { valueAsNumber: true })}
//             error={(errors?.leaves as any)?.sick?.taken?.message?.toString()}
//           />

//           {/* Annual Leave */}
//           <Input
//             label="Annual Leave Allowed"
//             placeholder="Enter allowed annual leave"
//             type="number"
//             {...register("leaves.annual.allowed", { valueAsNumber: true })}
//             error={(
//               errors?.leaves as any
//             )?.annual?.allowed?.message?.toString()}
//           />

//           <Input
//             label="Annual Leave Taken"
//             placeholder="Enter taken annual leave"
//             type="number"
//             {...register("leaves.annual.taken", { valueAsNumber: true })}
//             error={(errors?.leaves as any)?.annual?.taken?.message?.toString()}
//           />

//           {/* Total Leave */}
//           <Input
//             label="Total Leave Allowed"
//             placeholder="Enter allowed total leave"
//             type="number"
//             {...register("leaves.total.allowed", { valueAsNumber: true })}
//             error={(errors?.leaves as any)?.total?.allowed?.message?.toString()}
//           />

//           <Input
//             label="Total Leave Taken"
//             placeholder="Enter taken total leave"
//             type="number"
//             {...register("leaves.total.taken", { valueAsNumber: true })}
//             error={(errors?.leaves as any)?.total?.taken?.message?.toString()}
//           />
//         </div>
//       </div>

//       {/* Section: Additional Information */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Textarea
//             label="Medical Conditions"
//             placeholder="Enter medical conditions (if any)"
//             {...register("medical_conditions")}
//             error={errors.medical_conditions?.message?.toString()}
//           />

//           <Textarea
//             label="Comments"
//             placeholder="Enter comments (optional)"
//             {...register("comments")}
//             error={errors.comments?.message?.toString()}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// const handleFileUpload = async (
//   name: string,
//   event: React.ChangeEvent<HTMLInputElement>
// ) => {
//   const fileList = event.target.files;
//   if (fileList && fileList.length > 0) {
//     const file = fileList[0];

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await uploadService.upload(formData);
//       const url = response.data.url;

//       setValue(name, url);
//       setFilePreviews((prev: any) => ({
//         ...prev,
//         [name]: url,
//       }));
//     } catch (err) {
//       console.error("Upload failed", err);
//     }
//   }
// };
