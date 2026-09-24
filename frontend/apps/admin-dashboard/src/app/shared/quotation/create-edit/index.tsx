"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  quotationSchema,
  QuotationSchema,
} from "@/validators/quotation.schema";
import { useSearchParams, useRouter } from "next/navigation";
import quotationService from "@/services/quotationService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";
import dynamic from "next/dynamic";

// Load PDF preview dynamically
const PDFPreviewModal = dynamic(() => import("./preview"), { ssr: false });

interface ICreateEditQuotation {
  slug?: string;
  quotation?: any;
}

export default function CreateEditQuotation({
  slug,
  quotation,
}: ICreateEditQuotation) {
  const [isLoading, setLoading] = useState(false);
  const [filePreviews, setFilePreviews] = useState<Record<string, any>>({});
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [quotationData, setQuotationData] = useState<QuotationSchema | null>(
    null
  );

  const methods = useForm<QuotationSchema>({
    resolver: zodResolver(quotationSchema),
    defaultValues: defaultValues(quotation),
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const quotationId = slug || searchParams.get("id");

  useEffect(() => {
    if (quotationId) {
      fetchQuotationDetails();
    }
  }, [quotationId]);

  const fetchQuotationDetails = async () => {
    setLoading(true);
    try {
      const response = await quotationService.getById(quotationId);
      if (response) {
        methods.reset(defaultValues(response.data));
        setFilePreviews({ attachments: response.data.attachments || [] });
      }
    } catch (error) {
      toast.error("Failed to fetch quotation details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: QuotationSchema) => {
    setLoading(true);
    try {
      if (quotationId) {
        await quotationService.edit(quotationId, data);
        toast.success("Quotation updated successfully.");
      } else {
        await quotationService.create(data);
        toast.success("Quotation created successfully.");
      }
      router.push(routesTenant.salesManagement.quotationList);
    } catch (error) {
      toast.error("Failed to save quotation.");
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
              filePreviews={filePreviews}
              setFilePreviews={setFilePreviews}
            />
          </div>

          {/* Footer at bottom */}
          <div className="border-muted">
            <FormFooter
              isLoading={isLoading}
              submitBtnText={
                quotationId ? "Update Quotation" : "Create Quotation"
              }
            />
          </div>
        </form>
      </FormProvider>

      {/* PDF Preview Modal */}
      {showPDFPreview && quotationData && (
        <PDFPreviewModal
          data={quotationData}
          onClose={() => setShowPDFPreview(false)}
        />
      )}
    </div>
  );
}
