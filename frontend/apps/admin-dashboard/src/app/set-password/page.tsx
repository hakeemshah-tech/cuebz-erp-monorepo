// "use client";

// import React, { useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Input, Button, Box, Flex, Password } from "rizzui";
// import toast from "react-hot-toast";
// import rolesUserService from "@/services/rolesUserService";
// import AuthWrapperOne from "../shared/auth-layout/auth-wrapper-one";
// import Image from "next/image";
// import UnderlineShape from "@core/components/shape/underline";

// const setPasswordSchema = z
//   .object({
//     password: z
//       .string()
//       .min(8, { message: "Password must be at least 8 characters long." })
//       .regex(/[A-Z]/, {
//         message: "Password must contain at least one uppercase letter.",
//       })
//       .regex(/[a-z]/, {
//         message: "Password must contain at least one lowercase letter.",
//       })
//       .regex(/[0-9]/, {
//         message: "Password must contain at least one number.",
//       }),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match.",
//     path: ["confirmPassword"],
//   });

// type SetPasswordForm = z.infer<typeof setPasswordSchema>;

// export default function SetPasswordPage() {
//   const [isSubmitting, setSubmitting] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const email = searchParams.get("email");
//   const otp = searchParams.get("otp");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SetPasswordForm>({
//     resolver: zodResolver(setPasswordSchema),
//     mode: "onSubmit",
//   });

//   const onSubmit = async (data: SetPasswordForm) => {
//     setSubmitting(true);
//     try {
//       await rolesUserService.verifyOtpAndSetPassword({
//         email,
//         otp,
//         password: data.password,
//       });
//       toast.success("Password set successfully! Redirecting to login...");
//       router.push("/signin"); // Redirect to login page
//     } catch (error) {
//       toast.error("Failed to set password. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <AuthWrapperOne
//       title={<></>}
//       bannerTitle="The simplest way to manage your workspace."
//       bannerDescription="Amet minim mollit non deserunt ullamco est sit aliqua dolor do
//         amet sint velit officia consequat duis."
//       //   pageImage={
//       //     <div className="relative mx-auto aspect-[4/3.37] w-[500px] xl:w-[620px] 2xl:w-[820px]">
//       //       <Image
//       //         src={
//       //           "/auth-illustration.svg"
//       //         }
//       //         alt="Sign Up Thumbnail"
//       //         fill
//       //         priority
//       //         sizes="(max-width: 768px) 100vw"
//       //         className="object-cover"
//       //       />
//       //     </div>
//       //   }
//     >
//       <h1 className="text-2xl font-semibold text-center mb-4">
//         Set Your Password
//       </h1>
//       <p className="text-sm text-gray-500 text-center mb-6">
//         Secure your account by setting a password.
//       </p>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Password Field */}
//         <Password
//           label="Password"
//           placeholder="Enter your password"
//           size="lg"
//           className="[&>label>span]:font-medium"
//           inputClassName="text-sm"
//           {...register("password")}
//           error={errors.password?.message}
//         />
//         {/* Confirm Password Field */}

//         <Password
//           label="Confirm Password"
//           placeholder="Re-enter your new password"
//           size="lg"
//           className="[&>label>span]:font-medium"
//           inputClassName="text-sm"
//           {...register("confirmPassword")}
//           error={errors.confirmPassword?.message}
//         />
//         {/* Submit Button */}
//         <Button
//           type="submit"
//           size="lg"
//           className="w-full"
//           isLoading={isSubmitting}
//           disabled={isSubmitting}
//         >
//           Set Password
//         </Button>
//       </form>
//       <p className="text-sm text-gray-500 text-center mt-4">
//         Having trouble?{" "}
//         <a href="/support" className="text-blue-600 hover:underline">
//           Contact Support
//         </a>
//       </p>
//     </AuthWrapperOne>
//   );
// }

"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Box, Flex, Password } from "rizzui";
import toast from "react-hot-toast";
import rolesUserService from "@/services/rolesUserService";
import AuthWrapperOne from "../shared/auth-layout/auth-wrapper-one";

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SetPasswordForm = z.infer<typeof setPasswordSchema>;

export default function SetPasswordPage() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isResending, setResending] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordForm>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: SetPasswordForm) => {
    setSubmitting(true);
    try {
      await rolesUserService.verifyOtpAndSetPassword({
        email,
        otp,
        password: data.password,
      });
      toast.success("Password set successfully! Redirecting to login...");
      router.push("/signin"); // Redirect to login page
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to set password.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await rolesUserService.resendVerification({ email });
      toast.success(
        "Verification link sent successfully. Please check your email."
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to resend verification link."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthWrapperOne
      title={<></>}
      bannerTitle="The simplest way to manage your workspace."
      bannerDescription="Amet minim mollit non deserunt ullamco est sit aliqua dolor do
        amet sint velit officia consequat duis."
    >
      <h1 className="text-2xl font-semibold text-center mb-4">
        Set Your Password
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Secure your account by setting a password.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Password Field */}
        <Password
          label="Password"
          placeholder="Enter your password"
          size="lg"
          className="[&>label>span]:font-medium"
          inputClassName="text-sm"
          {...register("password")}
          error={errors.password?.message}
        />
        {/* Confirm Password Field */}
        <Password
          label="Confirm Password"
          placeholder="Re-enter your new password"
          size="lg"
          className="[&>label>span]:font-medium"
          inputClassName="text-sm"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        {/* Submit Button */}
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
      <p className="text-sm text-gray-500 text-center mt-4">
        Did not receive the link?{" "}
        <button
          onClick={handleResendOtp}
          disabled={isResending}
          className="text-blue-600 hover:underline"
        >
          {isResending ? "Resending..." : "Re-send Verification Link"}
        </button>
      </p>
    </AuthWrapperOne>
  );
}
