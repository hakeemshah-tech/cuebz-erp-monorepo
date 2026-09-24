"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, LeadSchema } from "@/validators/lead.schema";
import { useSearchParams, useRouter } from "next/navigation";
import leadService from "@/services/leadService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";

interface ICreateEditLead {
  slug?: string;
  lead?: any;
}

export default function CreateEditLead({ slug, lead }: ICreateEditLead) {
  const [isLoading, setLoading] = useState(false);
  const methods = useForm<LeadSchema>({
    resolver: zodResolver(leadSchema),
    defaultValues: defaultValues(lead),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = slug || searchParams.get("id");

  useEffect(() => {
    if (leadId) {
      fetchLeadDetails();
    }
  }, [leadId]);

  const fetchLeadDetails = async () => {
    setLoading(true);
    try {
      const response = await leadService.getById(leadId);
      if (response) {
        methods.reset(defaultValues(response.data));
      }
    } catch (error) {
      toast.error("Failed to fetch lead details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LeadSchema) => {
    setLoading(true);

    try {
      if (leadId) {
        await leadService.edit(leadId, data);
        toast.success("Lead updated successfully.");
      } else {
        await leadService.create(data);
        toast.success("Lead created successfully.");
      }
      router.push(routesTenant.salesManagement.leadList);
    } catch (error) {
      toast.error("Failed to save lead.");
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
              submitBtnText={leadId ? "Update Lead" : "Create Lead"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
