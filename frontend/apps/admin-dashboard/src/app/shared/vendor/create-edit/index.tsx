"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorSchema, VendorSchema } from "@/validators/vendor.schema";
import { useSearchParams, useRouter } from "next/navigation";
import vendorService from "@/services/vendorService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";

interface ICreateEditVendor {
  slug?: string;
  vendor?: any;
}

export default function CreateEditVendor({ slug, vendor }: ICreateEditVendor) {
  const [isLoading, setLoading] = useState(false);
  // const [filePreviews, setFilePreviews] = useState<Record<string, File | null>>(
  //   {}
  // );

  const methods = useForm<VendorSchema>({
    // resolver: zodResolver(vendorSchema),
    defaultValues: defaultValues(vendor),
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = slug || searchParams.get("id");

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetails();
    }
  }, [vendorId]);

  const fetchVendorDetails = async () => {
    setLoading(true);
    try {
      const response = await vendorService.getById(vendorId);
      if (response) {
        methods.reset(defaultValues(response.data));
        // setFilePreviews({
        //   attachments: response.data.attachments || [],
        // });
      }
    } catch (error) {
      toast.error("Failed to fetch vendor details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: VendorSchema) => {
    setLoading(true);
    try {
      if (vendorId) {
        await vendorService.edit(vendorId, data);
        toast.success("Vendor updated successfully.");
      } else {
        await vendorService.create(data);
        toast.success("Vendor created successfully.");
      }
      router.push(routesTenant.sales.vendorList);
    } catch (error) {
      toast.error("Failed to save vendor details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* <Form filePreviews={filePreviews} setFilePreviews={setFilePreviews} /> */}
          <Form />
          <FormFooter
            isLoading={isLoading}
            submitBtnText={vendorId ? "Update Vendor" : "Create Vendor"}
          />
        </form>
      </FormProvider>
    </div>
  );
}
