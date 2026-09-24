"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input, MultiSelect, Select } from "rizzui";

interface FormProps {
  isEditing?: boolean;
  employeeOptions: any;
}

export default function Form({
  isEditing = false,
  employeeOptions,
}: FormProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // 🔹 Explicitly register `employee_id` in the form
  useEffect(() => {
    register("employee_id", { required: "Employee selection is required." });
  }, [register]);

  useEffect(() => {
    const selectedEmployee = employeeOptions.find(
      (option: any) => option.value === watch("employee_id")
    );

    if (selectedEmployee) {
      setValue("email", selectedEmployee.email);
      setValue("name", selectedEmployee.name);
    }
  }, [watch("employee_id"), employeeOptions, setValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Employee Selection */}
      <Select
        label="Employee"
        placeholder="Select Employee"
        options={employeeOptions}
        searchable
        value={
          employeeOptions.find(
            (option: any) => option.value === watch("employee_id")
          ) || null
        }
        onChange={(selected: any) => {
          setValue("employee_id", selected.value);
          setValue("email", selected.email);
          setValue("name", selected.name);
        }}
        error={errors.employee_id?.message?.toString()}
        disabled={isEditing}
      />

      {/* Auto-filled Email */}
      <Input
        label="Email"
        placeholder="Enter user email"
        type="email"
        {...register("email")}
        error={errors.email?.message?.toString()}
        disabled={isEditing}
      />

      {/* Auto-filled Name */}
      <Input
        label="Name"
        placeholder="Enter user name"
        {...register("name")}
        error={errors.name?.message?.toString()}
      />

      {/* Accessible Modules Selection */}
      <MultiSelect
        label="Accessible Modules"
        placeholder="Select accessible modules"
        options={[
          { value: "dashboard", label: "Dashboard" },
          { value: "visitor-log", label: "Visitor Log" },
          { value: "call-log", label: "Call Log" },
          { value: "documents", label: "Documents" },
          { value: "employees", label: "Employees" },
          { value: "task-management", label: "Task Management" },
        ]}
        value={watch("accessible_modules")}
        onChange={(selectedOptions: any) =>
          setValue("accessible_modules", selectedOptions)
        }
        error={errors.accessible_modules?.message?.toString()}
      />
    </div>
  );
}
