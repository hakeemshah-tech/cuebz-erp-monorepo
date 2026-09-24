"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, CustomerSchema } from "@/validators/customer.schema";
import { useSearchParams, useRouter } from "next/navigation";
import customerService from "@/services/customerService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";

interface ICreateEditCustomer {
  slug?: string;
  customer?: any;
}

export default function CreateEditCustomer({
  slug,
  customer,
}: ICreateEditCustomer) {
  const [isLoading, setLoading] = useState(false);
  const methods = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultValues(customer),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = slug || searchParams.get("id");

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    try {
      const response = await customerService.getById(customerId);
      if (response) {
        methods.reset(defaultValues(response.data));
      }
    } catch (error) {
      toast.error("Failed to fetch customer details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CustomerSchema) => {
    setLoading(true);
    console.log(data, "showww");

    try {
      if (customerId) {
        await customerService.edit(customerId, data);
        toast.success("Customer updated successfully.");
      } else {
        await customerService.create(data);
        toast.success("Customer created successfully.");
      }
      router.push(routesTenant.sales.customerList);
    } catch (error) {
      toast.error("Failed to save customer details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="bg-white min-h-screen">
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
              submitBtnText={customerId ? "Update" : "Create"}
            />
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
