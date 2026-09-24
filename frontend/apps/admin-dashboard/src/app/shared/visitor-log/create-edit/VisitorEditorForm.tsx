"use client";

import { useEffect, useState } from "react";
import { Drawer } from "rizzui";
import { MdClose } from "react-icons/md";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  visitorLogSchema,
  VisitorLogSchema,
} from "@/validators/visitorLog.schema";
import { defaultValues } from "./form-utils";
import visitorService from "@/services/visitorLogService";
import toast from "react-hot-toast";
import VisitorEditorForm from "./VisitorEditorForm";
import FormFooter from "@core/components/form-footer";

export default function VisitorEditDrawer({
  visitor,
  open,
  onClose,
  onUpdated,
}: {
  visitor: any;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<VisitorLogSchema>({
    resolver: zodResolver(visitorLogSchema),
    defaultValues: defaultValues(visitor),
  });

  useEffect(() => {
    if (visitor) {
      methods.reset(defaultValues(visitor));
    }
  }, [visitor]);

  const handleSubmit = async (data: VisitorLogSchema) => {
    setIsLoading(true);
    try {
      await visitorService.edit(visitor._id, data);
      toast.success("Visitor updated successfully.");
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update visitor.");
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
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Edit Visitor
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <MdClose className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <VisitorEditorForm
              onClose={onClose}
              visitor={visitor}
              open={open}
              onUpdated={onUpdated}
            />
            <FormFooter submitBtnText="Update Visitor" isLoading={isLoading} />
          </form>
        </FormProvider>
      </div>
    </Drawer>
  );
}
