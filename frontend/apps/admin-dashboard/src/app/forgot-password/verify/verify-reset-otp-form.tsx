"use client";

import { Button, PinCode } from "rizzui";
import { Form } from "@core/ui/form";
import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClient from "@/services/axiosClient";

type FormValues = {
  otp: string;
};

export default function VerifyResetOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const flowId = searchParams.get("flowId");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!email || !flowId) {
      toast.error("Missing email or flow. Please start over.");
      router.replace("/forgot-password");
      return;
    }

    const toastId = toast.loading("Verifying OTP...");
    try {
      const res = await axiosClient.post("/auth/password/verify-otp", {
        email,
        otp: data.otp,
        flowId,
      });

      const resetToken = res?.data?.resetToken;
      if (!resetToken) {
        throw new Error("No reset token received.");
      }

      toast.success("OTP verified. Continue to reset password.", {
        id: toastId,
      });

      router.replace(
        `/forgot-password/reset?email=${encodeURIComponent(email)}&resetToken=${encodeURIComponent(
          resetToken
        )}`
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to verify OTP.";
      toast.error(msg, { id: toastId });
    }
  };

  const handleResend = async () => {
    if (!email || !flowId) {
      toast.error("Missing email or flow. Please start over.");
      router.replace("/forgot-password");
      return;
    }

    const toastId = toast.loading("Resending OTP...");
    try {
      await axiosClient.post("/auth/password/resend-otp", {
        email,
        flowId,
      });
      toast.success("If this email exists, an OTP has been re-sent.", {
        id: toastId,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Could not resend OTP. Please try again.";
      toast.error(msg, { id: toastId });
    }
  };

  return (
    <Form<FormValues> onSubmit={onSubmit}>
      {({ setValue }) => (
        <div className="space-y-10">
          <PinCode
            variant="outline"
            length={6}
            setValue={(value) => setValue("otp", String(value))}
            size="lg"
            className="lg:justify-start"
          />

          <Button
            className="w-full text-base font-medium"
            type="submit"
            size="lg"
          >
            Verify OTP
          </Button>

          <div>
            <Button
              className="-mt-4 w-full p-0 text-base font-medium text-primary underline lg:inline-flex lg:w-auto"
              type="button"
              variant="text"
              onClick={handleResend}
            >
              Resend OTP
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
}
