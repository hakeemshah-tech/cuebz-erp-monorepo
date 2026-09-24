"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  chequeTrackerSchema,
  ChequeTrackerSchema,
} from "@/validators/chequeTracker.schema";
import { useSearchParams, useRouter } from "next/navigation";
import chequeTrackerService from "@/services/chequeTrackerService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";

interface ICreateEditCheque {
  slug?: string;
  cheque?: any;
}

export default function CreateEditChequeTracker({
  slug,
  cheque,
}: ICreateEditCheque) {
  const [isLoading, setLoading] = useState(false);
  const [filePreviews, setFilePreviews] = useState<Record<string, File | null>>(
    {}
  );

  const methods = useForm<ChequeTrackerSchema>({
    resolver: zodResolver(chequeTrackerSchema),
    defaultValues: defaultValues(cheque),
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const chequeId = slug || searchParams.get("id");

  useEffect(() => {
    if (chequeId) {
      fetchChequeDetails();
    }
  }, [chequeId]);

  const fetchChequeDetails = async () => {
    setLoading(true);
    try {
      const response = await chequeTrackerService.getById(chequeId);
      if (response) {
        methods.reset(defaultValues(response.data));
        setFilePreviews({
          attachments: response.data.attachments || [],
        });
      }
    } catch (error) {
      toast.error("Failed to fetch cheque details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ChequeTrackerSchema) => {
    setLoading(true);
    try {
      if (chequeId) {
        await chequeTrackerService.edit(chequeId, data);
        toast.success("Cheque updated successfully.");
      } else {
        await chequeTrackerService.create(data);
        toast.success("Cheque created successfully.");
      }
      router.push(routesTenant.financials.chequeTrackerList);
    } catch (error) {
      toast.error("Failed to save cheque details.");
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
          {/* Main form content */}
          <div className="flex-1">
            <Form
              filePreviews={filePreviews}
              setFilePreviews={setFilePreviews}
            />
          </div>

          {/* Footer always at the bottom */}
          <div className="border-muted">
            <FormFooter
              isLoading={isLoading}
              submitBtnText={chequeId ? "Update Cheque" : "Create Cheque"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
