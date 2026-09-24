"use client";

import { useFormContext } from "react-hook-form";
import { ActionIcon, Input, Select, Textarea } from "rizzui";
import { DatePicker } from "@core/ui/datepicker";
import Upload from "@core/ui/upload";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PiTrashBold } from "react-icons/pi";
import countryList from "@/data/countryData";
import employeeService from "@/services/employeeService";

export default function Form({ filePreviews, setFilePreviews }: any) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [employeeOptions, setEmployeeOptions] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getList();
        const options = response.data.map((employee: any) => ({
          value: employee._id,
          label: employee.full_name,
        }));
        setEmployeeOptions(options);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleFileUpload = (
    name: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      setValue(name, fileList[0]); // Set the file in the form
      setFilePreviews((prev: any) => ({
        ...prev,
        [name]: fileList[0], // Update preview
      }));
    }
  };

  const handleFileDelete = (fieldName: string) => {
    setValue(fieldName, null); // Clear the form value
    setFilePreviews((prev: any) => ({
      ...prev,
      [fieldName]: null, // Clear the preview for the specific field
    }));
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
      ? file.endsWith(".jpg") || file.endsWith(".png")
      : file.type.startsWith("image/");
    const fileUrl = isUrl ? file : URL.createObjectURL(file);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (fileList && fileList.length > 0) {
        setValue(fieldName, fileList[0]); // Update the file in the form
        setFilePreviews((prev: any) => ({
          ...prev,
          [fieldName]: fileList[0], // Update the preview
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
              {typeof file === "string" ? "File" : file.name}
            </span>
          )}
        </div>
        <div
          className="truncate px-2.5 text-sm font-medium cursor-pointer"
          onClick={() => window.open(fileUrl, "_blank")}
        >
          {typeof file === "string" ? file.split("/").pop() : file.name}
        </div>
        <div className="flex items-center ms-auto gap-2">
          {/* Change File */}
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
          />
          {/* Delete File */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            placeholder="Enter Contact Number"
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

          <Input
            label="Blood Group"
            placeholder="Enter blood group"
            {...register("blood_group")}
            error={errors.blood_group?.message?.toString()}
          />
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Section: Employee Documents */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Employee Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emirates ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emirates ID
            </label>
            {!filePreviews.emirates_id && (
              <Upload
                accept="imgAndPdf"
                placeholderText="Upload Emirates ID"
                onChange={(e) => handleFileUpload("emirates_id", e)}
                className="mb-6 min-h-[280px] justify-center border-dashed bg-gray-50 dark:bg-transparent"
              />
            )}
            {errors.emirates_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.emirates_id.message?.toString()}
              </p>
            )}
            {renderFilePreview(filePreviews.emirates_id, "emirates_id")}
          </div>

          {/* Passport ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passport ID
            </label>
            {!filePreviews.passport_id && (
              <Upload
                accept="imgAndPdf"
                placeholderText="Upload Passport ID"
                onChange={(e) => handleFileUpload("passport_id", e)}
                className="mb-6 min-h-[280px] justify-center border-dashed bg-gray-50 dark:bg-transparent"
              />
            )}
            {errors.passport_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.passport_id.message?.toString()}
              </p>
            )}
            {renderFilePreview(filePreviews.passport_id, "passport_id")}
          </div>

          {/* Visa Copy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visa Copy
            </label>
            {!filePreviews.visa_copy && (
              <Upload
                accept="imgAndPdf"
                placeholderText="Upload Visa Copy"
                onChange={(e) => handleFileUpload("visa_copy", e)}
                className="mb-6 min-h-[280px] justify-center border-dashed bg-gray-50 dark:bg-transparent"
              />
            )}
            {errors.visa_copy && (
              <p className="mt-1 text-sm text-red-600">
                {errors.visa_copy.message?.toString()}
              </p>
            )}
            {renderFilePreview(filePreviews.visa_copy, "visa_copy")}
          </div>

          {/* CV */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CV
            </label>
            {!filePreviews.cv && (
              <Upload
                accept="pdf"
                placeholderText="Upload CV"
                onChange={(e) => handleFileUpload("cv", e)}
                className="mb-6 min-h-[280px] justify-center border-dashed bg-gray-50 dark:bg-transparent"
              />
            )}
            {errors.cv && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cv.message?.toString()}
              </p>
            )}
            {renderFilePreview(filePreviews.cv, "cv")}
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo (Optional)
            </label>
            {!filePreviews.photo && (
              <Upload
                accept="img"
                placeholderText="Upload Photo (Optional)"
                onChange={(e) => handleFileUpload("photo", e)}
                className="mb-6 min-h-[280px] justify-center border-dashed bg-gray-50 dark:bg-transparent"
              />
            )}
            {errors.photo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.photo.message?.toString()}
              </p>
            )}
            {renderFilePreview(filePreviews.photo, "photo")}
          </div>
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Section: Job Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Job Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Section: Emergency Contact Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Emergency Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Section: Additional Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 gap-6">
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
