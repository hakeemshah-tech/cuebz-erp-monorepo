"use client";

import { useEffect, useState } from "react";
import { Drawer, Button } from "rizzui";
import { MdClose } from "react-icons/md";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, CustomerSchema } from "@/validators/customer.schema";
import { defaultValues } from "./form-utils";
import customerService from "@/services/customerService";
import toast from "react-hot-toast";
import Form from "./form";
import FormFooter from "@core/components/form-footer";

export default function CustomerEditDrawer({
  customer,
  open,
  onClose,
  onUpdated,
}: {
  customer: any;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultValues(customer),
  });

  useEffect(() => {
    if (customer) {
      methods.reset(defaultValues(customer));
    }
  }, [customer]);

  const handleSubmit = async (data: CustomerSchema) => {
    setIsLoading(true);
    try {
      await customerService.edit(customer._id, data);
      toast.success("Customer updated successfully.");
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update customer.");
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
          Edit Customer
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
