"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import tenantService from "@/services/tenantService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";

interface ICreateEditSubscription {
  slug?: string;
  tenant?: any;
}

export default function CreateEditTenant({
  slug,
  tenant,
}: ICreateEditSubscription) {
  const [isLoading, setLoading] = useState(false);
  const methods = useForm({
    defaultValues: defaultValues(tenant),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenantId = slug || searchParams.get("id");

  useEffect(() => {
    if (tenantId) {
      fetchTenantDetails();
    }
  }, [tenantId]);

  const fetchTenantDetails = async () => {
    setLoading(true);
    try {
      const response = await tenantService.getById(tenantId);
      if (response) {
        methods.reset(defaultValues(response.data));
      }
    } catch (error) {
      toast.error("Failed to fetch tenant details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      if (tenantId) {
        await tenantService.edit(tenantId, data);
        toast.success("Tenant updated successfully.");
      } else {
        await tenantService.create(data);
        toast.success("Tenant created successfully.");
      }
      router.push("/dashboard/tenants");
    } catch (error) {
      toast.error("Failed to save tenant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Form />
          <FormFooter
            isLoading={isLoading}
            submitBtnText={tenantId ? "Update" : "Create"}
          />
        </form>
      </FormProvider>
    </div>
  );
}
