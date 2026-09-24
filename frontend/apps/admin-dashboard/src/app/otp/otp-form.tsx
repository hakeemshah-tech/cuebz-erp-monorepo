"use client";

import { Button, PinCode } from "rizzui";
import { Form } from "@core/ui/form";
import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import authService from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";

type FormValues = {
  email: string | null;
  otp: string;
};

export default function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const toastId = toast.loading("OTP verifing...");
    try {
      // Call the login API
      await authService.verifyOtp({ email, otp: data.otp });

      // Success toast
      toast.success(
        "Successfully Created Account. Our Dedicate Team Will Approve Your Account Sooner. Once Done You Will Notified By Email",
        { id: toastId }
      );

      // Redirect to signin
      router.replace("/signin");

      // window.location.reload();
    } catch (error: any) {
      console.log("Login Error:", error.message);
      // Show error toast
      toast.error(
        error.message || "Login failed. Please check your credentials.",
        { id: toastId }
      );
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
          <div className="">
            <Button
              className="-mt-4 w-full p-0 text-base font-medium text-primary underline lg:inline-flex lg:w-auto"
              type="submit"
              variant="text"
            >
              Resend OTP
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
}
