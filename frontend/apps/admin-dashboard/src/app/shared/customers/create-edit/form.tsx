"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input, Select, Textarea } from "rizzui";
import { DatePicker } from "@core/ui/datepicker";
import { useEffect, useState } from "react";
import employeeService from "@/services/employeeService";

export default function Form() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const customerType = watch("customer_type");

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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Top Fields */}
      <Input
        label="Full Name"
        placeholder="Enter full name"
        {...register("full_name")}
        error={errors.full_name?.message?.toString()}
      />

      <Input
        label="Email"
        placeholder="Enter email address"
        type="email"
        {...register("email")}
        error={errors.email?.message?.toString()}
      />

      <Input
        label="Phone Number"
        placeholder="Enter phone number"
        type="tel"
        {...register("phone_number")}
        error={errors.phone_number?.message?.toString()}
      />

      <Select
        label="Customer Type"
        placeholder="Select customer type"
        options={[
          { value: "Individual", label: "Individual" },
          { value: "Business", label: "Business" },
        ]}
        value={customerType}
        onChange={(option: any) =>
          setValue("customer_type", option?.value || "")
        }
        error={errors.customer_type?.message?.toString()}
      />

      {customerType === "Business" && (
        <Input
          label="Organization Name"
          placeholder="Enter organization name"
          {...register("organization_name")}
          error={errors.organization_name?.message?.toString()}
        />
      )}

      <Controller
        name="assigned_to"
        render={({ field }) => (
          <Select
            label="Assigned To (Optional)"
            placeholder="Enter employee assigned to this customer"
            options={employeeOptions}
            searchable
            value={
              employeeOptions.find((opt: any) => opt.value === field.value) ||
              null
            }
            onChange={(selected: any) =>
              field.onChange(selected?.value ?? null)
            } // ✅ null fallback
            // value={
            //   employeeOptions.find(
            //     (option: any) => option.value === field.value
            //   ) || null
            // }
            // onChange={(selected: any) => field.onChange(selected?.value)}
            error={errors.assigned_to?.message?.toString()}
          />
        )}
      />

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date of Birth (Optional)
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

      {/* Address Fields */}
      <div className="col-span-1 md:col-span-2 xl:col-span-3">
        <h3 className="text-base font-semibold text-gray-700 mb-2">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Input
            label="Street (Optional)"
            placeholder="Enter street address"
            {...register("address.street")}
            error={(errors.address as any)?.street?.message?.toString()}
          />
          <Input
            label="City (Optional)"
            placeholder="Enter city"
            {...register("address.city")}
            error={(errors.address as any)?.city?.message?.toString()}
          />
          <Input
            label="State (Optional)"
            placeholder="Enter state"
            {...register("address.state")}
            error={(errors.address as any)?.state?.message?.toString()}
          />
          <Input
            label="Postal Code (Optional)"
            placeholder="Enter postal code"
            {...register("address.postal_code")}
            error={(errors.address as any)?.postal_code?.message?.toString()}
          />
          <Input
            label="Country (Optional)"
            placeholder="Enter country"
            {...register("address.country")}
            error={(errors.address as any)?.country?.message?.toString()}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="col-span-1 md:col-span-2 xl:col-span-3">
        <Textarea
          label="Notes (Optional)"
          placeholder="Enter any notes about the customer"
          {...register("notes")}
          error={errors.notes?.message?.toString()}
        />
      </div>
    </div>
  );
}
