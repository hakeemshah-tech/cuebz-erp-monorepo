"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  pettyCashSchema,
  PettyCashSchema,
} from "@/validators/pettyCash.schema";
import { useSearchParams, useRouter } from "next/navigation";
import pettyCashService from "@/services/pettycashService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";

interface ICreateEditPettyCash {
  slug?: string;
  pettyCash?: any;
}

export default function CreateEditPettyCash({
  slug,
  pettyCash,
}: ICreateEditPettyCash) {
  const [isLoading, setLoading] = useState(false);
  // const [filePreviews, setFilePreviews] = useState<Record<string, File | null>>(
  //   {}
  // );

  const methods = useForm<PettyCashSchema>({
    resolver: zodResolver(pettyCashSchema),
    defaultValues: defaultValues(pettyCash),
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const pettyCashId = slug || searchParams.get("id");

  useEffect(() => {
    if (pettyCashId) {
      fetchPettyCashDetails();
    }
  }, [pettyCashId]);

  const fetchPettyCashDetails = async () => {
    setLoading(true);
    try {
      const response = await pettyCashService.getById(pettyCashId);
      if (response) {
        methods.reset(defaultValues(response.data));
        // setFilePreviews({
        //   attachment: response.data.attachment || null,
        // });
      }
    } catch (error) {
      toast.error("Failed to fetch petty cash details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PettyCashSchema) => {
    setLoading(true);
    try {
      if (pettyCashId) {
        await pettyCashService.edit(pettyCashId, data);
        toast.success("Petty cash entry updated successfully.");
      } else {
        await pettyCashService.create(data);
        toast.success("Petty cash entry created successfully.");
      }
      router.push(routesTenant.financials.pettyCashList);
    } catch (error) {
      toast.error("Failed to save petty cash entry.");
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
            // filePreviews={filePreviews}
            // setFilePreviews={setFilePreviews}
            />
          </div>

          {/* Footer at bottom */}
          <div className="border-muted">
            <FormFooter
              isLoading={isLoading}
              submitBtnText={pettyCashId ? "Update Entry" : "Create Entry"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
