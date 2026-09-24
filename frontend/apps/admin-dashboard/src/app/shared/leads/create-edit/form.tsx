"use client";

import { useFormContext } from "react-hook-form";
import { Input, Select, Textarea } from "rizzui";
import { useEffect, useState } from "react";
import employeeService from "@/services/employeeService";
import customerService from "@/services/customerService";

export default function Form() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

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

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getList();
      const options = response.data.map((customer: any) => ({
        value: customer._id,
        label: customer.full_name,
      }));
      setCustomerOptions(options);
    } catch (error) {
      console.error("Error fetching Customer data:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchCustomers();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Input
        label="Lead Identifier Name"
        placeholder="Lead Identifier Name"
        {...register("lead_identifier_name")}
        error={errors.lead_identifier_name?.message?.toString()}
      />

      <Select
        label="Lead Source"
        placeholder="Select lead source"
        options={
          [
            /* options omitted for brevity */
          ]
        }
        value={
          watch("lead_source")
            ? { value: watch("lead_source"), label: watch("lead_source") }
            : null
        }
        onChange={(option: any) => setValue("lead_source", option?.value || "")}
        error={errors.lead_source?.message?.toString()}
      />

      <Input
        label="Company Name"
        placeholder="Enter company name"
        {...register("company_name")}
        error={errors.company_name?.message?.toString()}
      />

      <Input
        label="Contact Person"
        placeholder="Enter contact person's name"
        {...register("contact_person")}
        error={errors.contact_person?.message?.toString()}
      />

      <Input
        label="Contact Number"
        placeholder="Enter contact number"
        type="tel"
        {...register("contact_number")}
        error={errors.contact_number?.message?.toString()}
      />

      <Input
        label="Email Address"
        placeholder="Enter email address"
        type="email"
        {...register("email")}
        error={errors.email?.message?.toString()}
      />

      <Select
        label="Lead Status"
        placeholder="Select lead status"
        options={
          [
            /* options omitted */
          ]
        }
        value={watch("lead_status")}
        onChange={(option: any) => setValue("lead_status", option?.value || "")}
        error={errors.lead_status?.message?.toString()}
      />

      <Input
        label="Lead Score (Optional)"
        placeholder="Enter lead score (0-100)"
        type="number"
        {...register("lead_score", {
          setValueAs: (value) => (value === "" ? undefined : Number(value)),
        })}
        error={errors.lead_score?.message?.toString()}
      />

      <Input
        label="Next Steps"
        placeholder="Enter next steps or action items"
        {...register("next_steps")}
        error={errors.next_steps?.message?.toString()}
      />

      <Select
        label="Customer Reference (Optional)"
        placeholder="Enter customer reference"
        options={customerOptions}
        searchable
        value={
          customerOptions.find(
            (option: any) => option.value === watch("customer_reference")
          ) || null
        }
        onChange={(selected: any) =>
          setValue("customer_reference", selected.value)
        }
        error={errors.customer_reference?.message?.toString()}
      />

      <Select
        label="Assigned To (Optional)"
        placeholder="Enter employee assigned to this customer"
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
          label="Comments/Notes (Optional)"
          placeholder="Enter any comments or notes"
          {...register("comments")}
          error={errors.comments?.message?.toString()}
        />
      </div>

      {/* Address Section */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <h3 className="text-lg font-semibold mb-4">
          Address Details (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
