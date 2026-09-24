"use client";

import { useEffect, useState } from "react";
import { Drawer, Button } from "rizzui";
import { MdClose } from "react-icons/md";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeSchema, employeeSchema } from "@/validators/employee.schema";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import Form from "./form";
import FormFooter from "@core/components/form-footer";
import employeeService from "@/services/employeeService";

export default function EmployeeEditDrawer({
  employee,
  open,
  onClose,
  onUpdated,
}: {
  employee: any;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (employee) {
      methods.reset(defaultValues(employee));
    }
  }, [employee]);

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

  const handleSubmit = async (data: EmployeeSchema) => {
    setIsLoading(true);
    try {
      await employeeService.edit(employee._id, data);
      toast.success("Employee updated successfully.");
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update Employee.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={open}
      onClose={onClose}
      overlayClassName="backdrop-blur"
      containerClassName="!max-w-[calc(100%-480px)] !shadow-2xl z-[999]"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Edit Employee
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <MdClose className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <Form
              filePreviews={filePreviews}
              setFilePreviews={setFilePreviews}
            />
            <FormFooter submitBtnText="Update" isLoading={isLoading} />
          </form>
        </FormProvider>
      </div>
    </Drawer>
  );
}
