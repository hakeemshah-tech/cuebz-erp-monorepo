"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation"; // Use the compatible hooks
import subscriptionService from "@/services/subscriptionservice";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";

interface ICreateEditSubscription {
  slug?: string;
  product?: any;
}

export default function CreateEditSubscription({
  slug,
  product,
}: ICreateEditSubscription) {
  const [isLoading, setLoading] = useState(false);
  const methods = useForm({
    defaultValues: defaultValues(product),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionId = slug || searchParams.get("id");

  useEffect(() => {
    if (subscriptionId) {
      fetchSubscriptionDetails();
    }
  }, [subscriptionId]);

  const fetchSubscriptionDetails = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.getList(); // Replace with single subscription API if available
      const subscription = response.data.find(
        (item: any) => item._id === subscriptionId
      );
      if (subscription) {
        methods.reset(defaultValues(subscription));
      }
    } catch (error) {
      toast.error("Failed to fetch subscription details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    // Transform the form data before sending
    const formattedData = {
      ...data,
      interval_count: data.interval_count.value || data.interval_count, // Ensure it's a plain value
      interval: data.interval.value || data.interval, // Ensure it's a plain value
      price: Number(data.price), // Convert price to a number
    };

    try {
      if (subscriptionId) {
        await subscriptionService.edit(subscriptionId, formattedData);
        toast.success("Subscription updated successfully.");
      } else {
        await subscriptionService.create(formattedData);
        toast.success("Subscription created successfully.");
      }
      router.push("/dashboard/subscriptions"); // Navigate to subscriptions list
    } catch (error) {
      toast.error("Failed to save subscription."); //TODO: Error handler
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
            submitBtnText={subscriptionId ? "Update" : "Create"}
          />
        </form>
      </FormProvider>
    </div>
  );
}
