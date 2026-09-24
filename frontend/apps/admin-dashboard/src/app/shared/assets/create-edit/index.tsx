"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetSchema, AssetSchema } from "@/validators/asset.schema";
import { useSearchParams, useRouter } from "next/navigation";
import assetService from "@/services/assetManagementService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";

interface ICreateEditAsset {
  slug?: string;
  asset?: any;
}

export default function CreateEditAsset({ slug, asset }: ICreateEditAsset) {
  const [isLoading, setLoading] = useState(false);
  const methods = useForm<AssetSchema>({
    resolver: zodResolver(assetSchema),
    defaultValues: defaultValues(asset),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const assetId = slug || searchParams.get("id");

  useEffect(() => {
    if (assetId) {
      fetchAssetDetails();
    }
  }, [assetId]);

  const fetchAssetDetails = async () => {
    setLoading(true);
    try {
      const response = await assetService.getById(assetId);
      if (response) {
        methods.reset(defaultValues(response.data));
      }
    } catch (error) {
      toast.error("Failed to fetch asset details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AssetSchema) => {
    setLoading(true);

    try {
      if (assetId) {
        await assetService.edit(assetId, data);
        toast.success("Asset updated successfully.");
      } else {
        await assetService.create(data);
        toast.success("Asset created successfully.");
      }
      router.push(routesTenant.company.assetList);
    } catch (error) {
      toast.error("Failed to save asset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <div className="bg-white min-h-max">
          <form onSubmit={methods.handleSubmit(onSubmit)} className="p-5">
            <Form />
            <FormFooter
              isLoading={isLoading}
              submitBtnText={assetId ? "Update" : "Create"}
            />
          </form>
        </div>
      </FormProvider>
    </div>
  );
}
