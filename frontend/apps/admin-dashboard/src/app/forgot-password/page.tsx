"use client";

import AuthWrapperOne from "@/app/shared/auth-layout/auth-wrapper-one";
import Image from "next/image";
import UnderlineShape from "@core/components/shape/underline";
import Link from "next/link";
import { metaObject } from "@/config/site.config";
import { Input, Button } from "rizzui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axiosClient from "@/services/axiosClient";
import { useRouter } from "next/navigation";

// export const metadata = {
//   ...metaObject("Forgot Password"),
// };

type FormValues = {
  email: string;
};

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ defaultValues: { email: "" } });

  const [serverMsg, setServerMsg] = useState<string>("");
  const [flowId, setFlowId] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    setServerMsg("");
    setFlowId(null);

    try {
      const res = await axiosClient.post("/auth/password/forgot", {
        email: values.email,
      });
      // API responds generically; if it includes flowId, capture it
      if (res?.data?.flowId) setFlowId(res.data.flowId);
      setServerMsg(
        "If this email exists, we've sent an OTP with instructions."
      );
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong. Please try again.";
      setError("email", { message: apiMsg });
    }
  };

  const goToVerify = () => {
    // Pass email & flowId to the next step via query (or use state/store)
    const search = new URLSearchParams();
    if (flowId) search.set("flowId", flowId);
    // We still don’t reveal if email exists; pass it because your backend expects it
    // (If you want to avoid it in the URL, use localStorage or a state store)
    // @ts-ignore - we read the email directly from the form input
    const emailInput = (document.getElementById("email") as HTMLInputElement)
      ?.value;
    if (emailInput) search.set("email", emailInput.trim());

    router.push(`/forgot-password/verify?${search.toString()}`);
  };

  return (
    <AuthWrapperOne
      title={
        <>
          Forgot your{" "}
          <span className="relative inline-block">
            password?
            <UnderlineShape className="absolute -bottom-2 start-0 h-2.5 w-24 text-blue md:w-28 xl:-bottom-1.5 xl:w-36" />
          </span>
        </>
      }
      description="Enter the email associated with your account. We'll send a one-time code (OTP) to verify and help you reset your password."
      bannerTitle="Secure account recovery."
      bannerDescription="We use short‑lived codes and single‑use tokens to keep your account safe."
      isSocialLoginActive={false}
      pageImage={
        <div className="relative mx-auto aspect-[4/3.37] w-[500px] xl:w-[620px] 2xl:w-[820px]">
          <Image
            src="/auth-illustration.svg"
            alt="Forgot Password Illustration"
            fill
            priority
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="you@company.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
          error={errors.email?.message}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Send OTP
        </Button>

        {serverMsg && <p className="text-sm text-green-600">{serverMsg}</p>}

        {/* Continue button only after a successful request */}
        {serverMsg && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={goToVerify}
          >
            I have the OTP — Continue
          </Button>
        )}

        <div className="text-center text-sm text-gray-600">
          Remembered it?{" "}
          <Link
            href="/signin"
            className="font-medium text-blue-600 hover:underline"
          >
            Back to Sign in
          </Link>
        </div>
      </form>
    </AuthWrapperOne>
  );
}
