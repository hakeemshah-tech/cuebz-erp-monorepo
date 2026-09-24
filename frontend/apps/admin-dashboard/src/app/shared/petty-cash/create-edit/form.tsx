"use client";

import { useFormContext } from "react-hook-form";
import { ActionIcon, Input, Select, Textarea } from "rizzui";
import { DatePicker } from "@core/ui/datepicker";
// import Upload from "@core/ui/upload";
// import { PiTrashBold } from "react-icons/pi";
// import Image from "next/image";

export default function PettyCashForm({ filePreviews, setFilePreviews }: any) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // const handleFileUpload = (
  //   name: string,
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const fileList = event.target.files;
  //   if (fileList && fileList.length > 0) {
  //     setValue(name, [...(watch(name) || []), ...Array.from(fileList)]);
  //     setFilePreviews((prev: any) => ({
  //       ...prev,
  //       [name]: [...(prev[name] || []), ...Array.from(fileList)],
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
  //   files: (File | string)[] | null,
  //   fieldName: string
  // ) => {
  //   if (!files || files.length === 0) return null;

  //   return files.map((file, index) => {
  //     const isUrl = typeof file === "string";
  //     const fileUrl = isUrl ? file : URL.createObjectURL(file);

  //     return (
  //       <div
  //         key={`${fieldName}-${index}`}
  //         className="flex items-center min-h-[58px] rounded-xl border px-3 border-muted dark:border-gray-300 mt-2"
  //       >
  //         <div
  //           className="relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-lg border bg-gray-50 dark:bg-transparent cursor-pointer"
  //           onClick={() => window.open(fileUrl, "_blank")}
  //         >
  //           {isUrl ? (
  //             <Image
  //               src={fileUrl}
  //               alt={`${fieldName}-${index}`}
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
  //           <ActionIcon
  //             onClick={() => handleFileDelete(fieldName, index)}
  //             size="sm"
  //             variant="flat"
  //             color="danger"
  //           >
  //             <PiTrashBold className="w-5 h-5" />
  //           </ActionIcon>
  //         </div>
  //       </div>
  //     );
  //   });
  // };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Petty Cash Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Transaction Type */}
          <Select
            label="Transaction Type"
            placeholder="Select transaction type"
            options={[
              { value: "Add", label: "Deposit" },
              { value: "Expense", label: "Expense" },
            ]}
            value={
              watch("transaction_type")
                ? {
                    value: watch("transaction_type"),
                    label: watch("transaction_type"),
                  }
                : null
            }
            onChange={(option: any) =>
              setValue("transaction_type", option?.value || "Add")
            }
            error={errors.transaction_type?.message?.toString()}
          />

          {/* Transaction Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction Date
            </label>
            <DatePicker
              selected={
                watch("transaction_date")
                  ? new Date(watch("transaction_date"))
                  : null
              }
              onChange={(date: Date | null) =>
                setValue("transaction_date", date ? date.toISOString() : null)
              }
              placeholderText="Select transaction date"
              dateFormat="dd-MMM-yyyy"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.transaction_date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.transaction_date.message?.toString()}
              </p>
            )}
          </div>

          {/* Amount */}
          <Input
            label="Amount (AED)"
            placeholder="Enter amount"
            type="number"
            {...register("amount", { valueAsNumber: true })}
            error={errors.amount?.message?.toString()}
          />

          {/* Purpose */}
          <Select
            label="Purpose"
            placeholder="Select purpose"
            options={[
              { value: "Office Supplies", label: "Office Supplies" },
              { value: "Staff Meals", label: "Staff Meals" },
              { value: "Courier", label: "Courier" },
              { value: "Transport", label: "Transport" },
              { value: "Misc", label: "Misc" },
            ]}
            value={
              watch("purpose")
                ? { value: watch("purpose"), label: watch("purpose") }
                : null
            }
            onChange={(option: any) => setValue("purpose", option?.value || "")}
            error={errors.purpose?.message?.toString()}
          />

          {/* Remarks */}
          <div className="md:col-span-3">
            <Textarea
              label="Remarks"
              placeholder="Enter remarks"
              {...register("remarks")}
              error={errors.remarks?.message?.toString()}
            />
          </div>
        </div>
      </div>

      {/* <hr className="my-8 border-gray-300" /> */}
    </div>
  );
}

{
  /* Attachment */
}
{
  /* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachment
        </label>
        <Upload
          accept="imgAndPdf"
          placeholderText="Upload attachment"
          onChange={(e) => handleFileUpload("attachment", e)}
          className="mb-6 min-h-[280px] justify-center border-dashed bg-gray-50 dark:bg-transparent"
        />
        {errors.attachment && (
          <p className="mt-1 text-sm text-red-600">
            {errors.attachment.message?.toString()}
          </p>
        )}
        {renderMultipleFilePreviews(filePreviews.attachment, "attachment")}
      </div> */
}
