"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Password } from "rizzui";
import toast from "react-hot-toast";
import AuthWrapperOne from "@/app/shared/auth-layout/auth-wrapper-one";
import axiosClient from "@/services/axiosClient";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Must contain at least one number." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetForm = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const resetToken = searchParams.get("resetToken");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!email || !resetToken) {
      toast.error("Missing reset details. Please request a new reset.");
      router.replace("/forgot-password");
    }
  }, [email, resetToken, router]);

  const onSubmit = async (data: ResetForm) => {
    if (!email || !resetToken) return;

    const toastId = toast.loading("Updating password...");
    try {
      // API: POST /api/auth/password/reset  -> { email, resetToken, newPassword }
      await axiosClient.post("/auth/password/reset", {
        email,
        resetToken,
        newPassword: data.password,
      });

      toast.success("Password updated. Please sign in.", { id: toastId });
      router.replace("/signin");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to reset password.";
      toast.error(msg, { id: toastId });
    }
  };

  const goBackToOtp = () => {
    // If token expired or user wants to verify again
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    // You’ll typically have flowId from step 1 in your verify page link.
    router.push(`/forgot-password/verify?${params.toString()}`);
  };

  return (
    <AuthWrapperOne
      title={<></>}
      bannerTitle="The simplest way to manage your workspace."
      bannerDescription="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint velit officia consequat duis."
    >
      <h1 className="mb-4 text-center text-2xl font-semibold">
        Set Your New Password
      </h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        Create a strong password to secure your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Password
          label="New Password"
          placeholder="Enter your new password"
          size="lg"
          className="[&>label>span]:font-medium"
          inputClassName="text-sm"
          {...register("password")}
          error={errors.password?.message}
        />

        <Password
          label="Confirm New Password"
          placeholder="Re-enter your new password"
          size="lg"
          className="[&>label>span]:font-medium"
          inputClassName="text-sm"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Set Password
        </Button>
      </form>
      {/* 
      <p className="mt-4 text-center text-sm text-gray-500">
        Having trouble?{" "}
        <button onClick={goBackToOtp} className="text-blue-600 hover:underline">
          Verify OTP again
        </button>
      </p> */}
    </AuthWrapperOne>
  );
}
