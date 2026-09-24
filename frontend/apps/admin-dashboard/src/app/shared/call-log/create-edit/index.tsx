"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { callLogSchema, CallLogSchema } from "@/validators/callLog.schema";
import { useSearchParams, useRouter } from "next/navigation";
import callLogService from "@/services/callLogService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";

interface ICreateEditCallLog {
  slug?: string;
  callLog?: any;
}

export default function CreateEditCallLog({
  slug,
  callLog,
}: ICreateEditCallLog) {
  const [isLoading, setLoading] = useState(false);
  const methods = useForm<CallLogSchema>({
    resolver: zodResolver(callLogSchema),
    defaultValues: defaultValues(callLog),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const callLogId = slug || searchParams.get("id");

  useEffect(() => {
    if (callLogId) {
      fetchCallLogDetails();
    }
  }, [callLogId]);

  const fetchCallLogDetails = async () => {
    setLoading(true);
    try {
      const response = await callLogService.getById(callLogId);
      if (response) {
        methods.reset(defaultValues(response.data));
      }
    } catch (error) {
      toast.error("Failed to fetch call log details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CallLogSchema) => {
    setLoading(true);

    try {
      if (callLogId) {
        await callLogService.edit(callLogId, data);
        toast.success("Call log updated successfully.");
      } else {
        await callLogService.create(data);
        toast.success("Call log created successfully.");
      }
      router.push(routesTenant.reception.callLogList);
    } catch (error) {
      toast.error("Failed to save call log.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
            submitBtnText={callLogId ? "Update" : "Create"}
          />
        </div>
      </form>
    </FormProvider>
  );
}
