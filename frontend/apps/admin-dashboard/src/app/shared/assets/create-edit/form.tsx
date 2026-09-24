"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Select, Textarea } from "rizzui";
import { DatePicker } from "@core/ui/datepicker";
import employeeService from "@/services/employeeService";

export default function Form() {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Input
        label="Asset Name"
        placeholder="Enter asset name"
        {...register("name")}
        error={errors.name?.message?.toString()}
      />

      <Select
        label="Asset Type"
        placeholder="Select asset type"
        options={[
          { value: "Laptop", label: "Laptop" },
          { value: "Printer", label: "Printer" },
          { value: "Smart TV", label: "Smart TV" },
          { value: "Other", label: "Other" },
        ]}
        value={watch("category")}
        onChange={(option: any) => setValue("category", option?.value || "")}
        error={errors.category?.message?.toString()}
      />

      <Input
        label="Serial Number"
        placeholder="Enter serial number"
        {...register("serial_number")}
        error={errors.serial_number?.message?.toString()}
      />

      {/* DatePicker for Purchase Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Purchase Date
        </label>
        <DatePicker
          selected={
            watch("purchase_date") ? new Date(watch("purchase_date")) : null
          }
          onChange={(date: Date | null) => {
            setValue("purchase_date", date ? date.toISOString() : null);
          }}
          placeholderText="Select purchase date"
          dateFormat="dd-MMM-yyyy"
          className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.purchase_date && (
          <p className="mt-1 text-sm text-red-600">
            {errors.purchase_date.message?.toString()}
          </p>
        )}
      </div>

      {/* DatePicker for Warranty Expiry */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Warranty Expiry Date
        </label>
        <DatePicker
          selected={
            watch("warranty_expiration")
              ? new Date(watch("warranty_expiration"))
              : null
          }
          onChange={(date: Date | null) => {
            setValue("warranty_expiration", date ? date.toISOString() : null);
          }}
          placeholderText="Select warranty expiry date"
          dateFormat="dd-MMM-yyyy"
          className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.warranty_expiration && (
          <p className="mt-1 text-sm text-red-600">
            {errors.warranty_expiration.message?.toString()}
          </p>
        )}
      </div>

      <Select
        label="Status"
        placeholder="Select status"
        options={[
          { value: "In Use", label: "In Use" },
          { value: "In Storage", label: "In Storage" },
          { value: "Under Maintenance", label: "Under Maintenance" },
          { value: "Retired", label: "Retired" },
        ]}
        value={watch("status")}
        onChange={(option: any) => setValue("status", option?.value || "")}
        error={errors.status?.message?.toString()}
      />

      {/* Assigned To (Fetching from Employee List) */}
      <Select
        label="Assigned To (Optional)"
        placeholder="Select employee"
        options={employeeOptions}
        searchable
        value={
          employeeOptions.find(
            (option: any) => option.value === watch("assigned_to")
          ) || null
        }
        onChange={(selected: any) => setValue("assigned_to", selected.value)}
        error={errors.assigned_to?.message?.toString()}
      />

      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <Textarea
          label="Notes (Optional)"
          placeholder="Enter additional details"
          {...register("notes")}
          error={errors.notes?.message?.toString()}
        />
      </div>
    </div>
  );
}
