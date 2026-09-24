"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoiceSchema } from "@/validators/invoice.schema";
import { useSearchParams, useRouter } from "next/navigation";
import invoiceService from "@/services/invoiceService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";
import dynamic from "next/dynamic";

// Load PDF preview dynamically
const PDFPreviewModal = dynamic(() => import("./preview"), { ssr: false });

interface ICreateEditInvoice {
  slug?: string;
  invoice?: any;
}

export default function CreateEditInvoice({
  slug,
  invoice,
}: ICreateEditInvoice) {
  const [isLoading, setLoading] = useState(false);
  const [filePreviews, setFilePreviews] = useState<Record<string, any>>({});
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceSchema | null>(null);

  const methods = useForm<InvoiceSchema>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: defaultValues(invoice),
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = slug || searchParams.get("id");

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    setLoading(true);
    try {
      const response = await invoiceService.getById(invoiceId);
      if (response) {
        methods.reset(defaultValues(response.data));
        setFilePreviews({ attachments: response.data.attachments || [] });
      }
    } catch (error) {
      toast.error("Failed to fetch invoice details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: InvoiceSchema) => {
    setLoading(true);
    try {
      if (invoiceId) {
        await invoiceService.edit(invoiceId, data);
        toast.success("Invoice updated successfully.");
      } else {
        await invoiceService.create(data);
        toast.success("Invoice created successfully.");
      }
      router.push(routesTenant.salesManagement.invoiceList);
    } catch (error) {
      toast.error("Failed to save invoice.");
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
              submitBtnText={invoiceId ? "Update Invoice" : "Create Invoice"}
            />
          </div>
        </form>
      </FormProvider>

      {/* PDF Preview Modal */}
      {showPDFPreview && invoiceData && (
        <PDFPreviewModal
          data={invoiceData}
          onClose={() => setShowPDFPreview(false)}
        />
      )}
    </div>
  );
}
