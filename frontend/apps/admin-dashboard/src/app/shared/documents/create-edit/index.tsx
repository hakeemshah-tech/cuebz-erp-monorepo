"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, EmployeeSchema } from "@/validators/employee.schema";
import { useSearchParams, useRouter } from "next/navigation";
import employeeService from "@/services/employeeService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";
import { EmployeeType } from "@/types/employeeTypes";

interface ICreateEditEmployee {
  slug?: string;
  employee?: EmployeeType;
}

export default function CreateEditEmployee({
  slug,
  employee,
}: ICreateEditEmployee) {
  const [isLoading, setLoading] = useState(false);
  const [filePreviews, setFilePreviews] = useState<Record<string, File | null>>(
    {
      emirates_id: null,
      passport_id: null,
      visa_copy: null,
      cv: null,
      photo: null,
    }
  );
  const methods = useForm<EmployeeSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultValues(employee),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = slug || searchParams.get("id");

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getById(employeeId);
      if (response) {
        methods.reset(defaultValues(response.data));
        setFilePreviews({
          emirates_id: response.data.emirates_id || null,
          passport_id: response.data.passport_id || null,
          visa_copy: response.data.visa_copy || null,
          cv: response.data.cv || null,
          photo: response.data.photo || null,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch employee details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EmployeeSchema) => {
    setLoading(true);
    if (!data.reporting_manager) {
      delete data.reporting_manager;
    }
    try {
      if (employeeId) {
        await employeeService.edit(employeeId, data);
        toast.success("Employee details updated successfully.");
      } else {
        await employeeService.create(data);
        toast.success("Employee created successfully.");
      }
      router.push(routesTenant.employees.employeesRecordsList);
    } catch (error) {
      toast.error("Failed to save employee details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="min-h-[79vh] flex flex-col p-6"
        >
          {/* Form Content */}
          <div className="flex-1">
            <Form
              filePreviews={filePreviews}
              setFilePreviews={setFilePreviews}
            />
          </div>

          {/* Footer at bottom */}
          <div className="border-muted">
            <FormFooter
              isLoading={isLoading}
              submitBtnText={employeeId ? "Update" : "Create"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
