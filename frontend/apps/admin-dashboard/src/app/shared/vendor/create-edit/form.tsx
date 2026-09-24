"use client";

import { useFormContext } from "react-hook-form";
import { ActionIcon, Input, Select, Textarea } from "rizzui";
import Upload from "@core/ui/upload";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PiTrashBold } from "react-icons/pi";
import employeeService from "@/services/employeeService";

export default function VendorForm({ filePreviews, setFilePreviews }: any) {
  // interface FileData {
  //   file_name: string;
  //   file_url: string;
  //   _id?: string;
  // }

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

  // const handleFileUpload = (
  //   name: string,
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const fileList = event.target.files;
  //   if (fileList && fileList.length > 0) {
  //     const newFiles = Array.from(fileList).map((file) => ({
  //       file_name: file.name,
  //       file_url: URL.createObjectURL(file),
  //     }));
  //     setValue(name, [...(watch(name) || []), ...newFiles]);
  //     setFilePreviews((prev: any) => ({
  //       ...prev,
  //       [name]: [...(prev[name] || []), ...newFiles],
  //     }));
  //   }
  // };

  // const handleFileDelete = (fieldName: string, index: number) => {
  //   const updatedFiles = [...(watch(fieldName) || [])];
  //   updatedFiles.splice(index, 1);
  //   setValue(fieldName, updatedFiles);
  //   setFilePreviews((prev: any) => ({
  //     ...prev,
  //     [fieldName]: updatedFiles,
  //   }));
  // };

  // const renderMultipleFilePreviews = (
  //   files: FileData[] | null,
  //   fieldName: string
  // ) => {
  //   if (!files || files.length === 0) return null;

  //   return files.map((file, index) => (
  //     <div
  //       key={`${fieldName}-${index}`}
  //       className="flex items-center min-h-[58px] rounded-xl border px-3 border-muted dark:border-gray-300 mt-2"
  //     >
  //       <div
  //         className="relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-lg border bg-gray-50 dark:bg-transparent cursor-pointer"
  //         onClick={() => window.open(file.file_url, "_blank")}
  //       >
  //         {/\.(jpg|jpeg|png|gif)$/i.test(file.file_name) ? (
  //           <Image
  //             src={file.file_url}
  //             alt={file.file_name}
  //             className="object-contain"
  //             fill
  //           />
  //         ) : (
  //           <span className="text-gray-600 font-medium">File</span>
  //         )}
  //       </div>
  //       <div
  //         className="truncate px-2.5 text-sm font-medium cursor-pointer"
  //         onClick={() => window.open(file.file_url, "_blank")}
  //       >
  //         {file.file_name}
  //       </div>
  //       <div className="flex items-center ms-auto gap-2">
  //         <ActionIcon
  //           onClick={() => handleFileDelete(fieldName, index)}
  //           size="sm"
  //           variant="flat"
  //           color="danger"
  //         >
  //           <PiTrashBold className="w-5 h-5" />
  //         </ActionIcon>
  //       </div>
  //     </div>
  //   ));
  // };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Vendor Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Vendor Name"
            placeholder="Enter vendor name"
            {...register("vendor_name")}
            error={errors.vendor_name?.message?.toString()}
          />

          <Input
            label="Contact Person"
            placeholder="Enter contact person"
            {...register("contact_person")}
            error={errors.contact_person?.message?.toString()}
          />

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            type="tel"
            {...register("phone_number")}
            error={errors.phone_number?.message?.toString()}
          />

          <Input
            label="Email"
            placeholder="Enter email address"
            type="email"
            {...register("email")}
            error={errors.email?.message?.toString()}
          />

          <Select
            label="Vendor Type"
            placeholder="Select vendor type"
            options={[
              { value: "Supplier", label: "Supplier" },
              { value: "Manufacturer", label: "Manufacturer" },
              { value: "Distributor", label: "Distributor" },
              { value: "Service Provider", label: "Service Provider" },
              { value: "Other", label: "Other" },
            ]}
            value={
              watch("vendor_type")
                ? { value: watch("vendor_type"), label: watch("vendor_type") }
                : null
            }
            onChange={(option: any) =>
              setValue("vendor_type", option?.value || "")
            }
            error={errors.vendor_type?.message?.toString()}
          />

          <Input
            label="Trade License Number"
            placeholder="Enter trade license number"
            {...register("trade_license_number")}
            error={errors.trade_license_number?.message?.toString()}
          />

          <Input
            label="Tax Registration Number"
            placeholder="Enter tax registration number"
            {...register("tax_registration_number")}
            error={errors.tax_registration_number?.message?.toString()}
          />

          <Select
            label="Assigned To"
            placeholder="Select employee"
            options={employeeOptions}
            searchable
            value={
              watch("assigned_to")
                ? employeeOptions.find(
                    (option: any) => option.value === watch("assigned_to")
                  )
                : null
            }
            onChange={(option: any) =>
              setValue("assigned_to", option?.value || "")
            }
            error={errors.assigned_to?.message?.toString()}
          />
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      <h3 className="text-lg font-semibold mb-4">Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Street"
          placeholder="Enter street address"
          {...register("address.street")}
          error={(errors.address as any)?.street?.message?.toString()}
        />

        <Input
          label="City"
          placeholder="Enter city"
          {...register("address.city")}
          error={(errors.address as any)?.city?.message?.toString()}
        />

        <Input
          label="State"
          placeholder="Enter state"
          {...register("address.state")}
          error={(errors.address as any)?.state?.message?.toString()}
        />

        <Input
          label="Postal Code"
          placeholder="Enter postal code"
          {...register("address.postal_code")}
          error={(errors.address as any)?.postal_code?.message?.toString()}
        />

        <Input
          label="Country"
          placeholder="Enter country"
          {...register("address.country")}
          error={(errors.address as any)?.country?.message?.toString()}
        />
      </div>

      <hr className="my-8 border-gray-300" />

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
          label="IBAN Number"
          placeholder="Enter IBAN number"
          {...register("bank_details.iban_number")}
          error={(errors.bank_details as any)?.iban_number?.message?.toString()}
        />

        <Input
          label="Branch"
          placeholder="Enter branch name"
          {...register("bank_details.branch")}
          error={(errors.bank_details as any)?.branch?.message?.toString()}
        />
      </div>

      <Textarea
        label="Notes"
        placeholder="Enter any notes"
        {...register("notes")}
        error={errors.notes?.message?.toString()}
      />

      {/* <hr className="my-8 border-gray-300" />

      <h3 className="text-lg font-semibold mb-4">Attachments</h3>
      <div>
        <Upload
          accept="imgAndPdf"
          placeholderText="Upload attachments"
          onChange={(e: any) => handleFileUpload("attachments", e)}
          className="mb-6 min-h-[280px] justify-center border-dashed bg-gray-50 dark:bg-transparent"
          multiple
        />
        {errors.attachments && (
          <p className="mt-1 text-sm text-red-600">
            {errors.attachments.message?.toString()}
          </p>
        )}
        {filePreviews?.attachments &&
          renderMultipleFilePreviews(filePreviews.attachments, "attachments")}
      </div> */}
    </div>
  );
}
