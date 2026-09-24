"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskManagementSchema,
  TaskManagementSchema,
} from "@/validators/taskmanagement.schema";
import { useSearchParams, useRouter } from "next/navigation";
import taskService from "@/services/taskManagementService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";

interface ICreateEditTask {
  slug?: string;
  task?: any;
}

export default function CreateEditTask({ slug, task }: ICreateEditTask) {
  const [isLoading, setLoading] = useState(false);
  // const [filePreviews, setFilePreviews] = useState<Record<string, File | null>>(
  //   {}
  // );

  const methods = useForm<TaskManagementSchema>({
    resolver: zodResolver(taskManagementSchema),
    defaultValues: defaultValues(task),
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = slug || searchParams.get("id");

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const response = await taskService.getById(taskId);
      if (response) {
        methods.reset(defaultValues(response.data));
        // setFilePreviews({
        //   attachments: response.data.attachments || [],
        // });
      }
    } catch (error) {
      toast.error("Failed to fetch task details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TaskManagementSchema) => {
    setLoading(true);
    try {
      if (taskId) {
        await taskService.edit(taskId, data);
        toast.success("Task updated successfully.");
      } else {
        await taskService.create(data);
        toast.success("Task created successfully.");
      }
      router.push(routesTenant.employees.taskManagementList);
    } catch (error) {
      toast.error("Failed to save task details.");
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
            <Form />
          </div>

          {/* Footer at bottom */}
          <div className="border-muted">
            <FormFooter
              isLoading={isLoading}
              submitBtnText={taskId ? "Update Task" : "Create Task"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
