"use client";

import { useEffect, useState } from "react";
import { Drawer, Button } from "rizzui";
import { MdClose } from "react-icons/md";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { callLogSchema, CallLogSchema } from "@/validators/callLog.schema";
import { defaultValues } from "./form-utils";
import callLogService from "@/services/callLogService";
import toast from "react-hot-toast";
import Form from "./form";
import FormFooter from "@core/components/form-footer";

export default function EditCallLogDrawer({
  callLog,
  open,
  onClose,
  onUpdated,
}: {
  callLog: any;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<CallLogSchema>({
    resolver: zodResolver(callLogSchema),
    defaultValues: defaultValues(callLog),
  });

  useEffect(() => {
    if (callLog) {
      methods.reset(defaultValues(callLog));
    }
  }, [callLog]);

  const handleSubmit = async (data: CallLogSchema) => {
    setIsLoading(true);
    try {
      await callLogService.edit(callLog._id, data);
      toast.success("Call log updated successfully.");
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update call log.");
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
          Edit Call Log
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <MdClose className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <Form />
            <FormFooter submitBtnText="Update" isLoading={isLoading} />
          </form>
        </FormProvider>
      </div>
    </Drawer>
  );
}
