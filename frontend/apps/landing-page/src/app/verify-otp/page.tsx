// "use client";

// import React, { useRef } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { Button } from "rizzui";
// import toast from "react-hot-toast";
// import { Briefcase } from "lucide-react";
// import authService from "@/services/authService";

// interface FormValues {
//   otp: string;
// }

// export default function OtpVerificationPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const email = searchParams.get("email");

//   const {
//     handleSubmit,
//     register,
//     setValue,
//     formState: { isSubmitting, errors },
//   } = useForm<FormValues>({ defaultValues: { otp: "" } });

//   const inputsRef = useRef<HTMLInputElement[]>([]);

//   const onSubmit = async (data: FormValues) => {
//     const toastId = toast.loading("Verifying OTP...");
//     try {
//       // Call the login API
//       await authService.verifyOtp({ email, otp: data.otp });

//       // Success toast
//       toast.success(
//         "Successfully Created Account. Our Dedicated Team Will Approve Your Account Soon. You'll be notified by email once it's done.",
//         { id: toastId }
//       );

//       // Redirect to signin
//       router.replace("/");
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "OTP verification failed";
//       toast.error(errorMessage, { id: toastId });
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     idx: number
//   ) => {
//     const val = e.target.value.replace(/\D/, "").charAt(0);
//     const digits = Array.from({ length: 6 }, (_, i) =>
//       i === idx ? val : inputsRef.current[i]?.value || ""
//     ).join("");
//     setValue("otp", digits);
//     if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
//     if (!val && idx > 0) inputsRef.current[idx - 1]?.focus();
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
//       <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6">
//         <div className="text-center space-y-2">
//           <Briefcase className="mx-auto text-purple-600" size={30} />
//           <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
//             Verify Your Email
//           </h1>
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Enter the 6-digit code sent to <strong>{email}</strong>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="flex justify-between gap-2">
//             {Array.from({ length: 6 }, (_, i) => (
//               <input
//                 key={i}
//                 {...register("otp")}
//                 maxLength={1}
//                 ref={(el) => {
//                   if (el) inputsRef.current[i] = el;
//                 }}
//                 onChange={(e) => handleChange(e, i)}
//                 className="w-10 h-12 text-center text-lg font-medium bg-gray-100 dark:bg-gray-700 rounded-lg dark:focus:bg-gray-600 focus:outline-none"
//                 type="text"
//               />
//             ))}
//           </div>
//           {errors.otp && (
//             <p className="text-xs text-red-600 dark:text-red-400 text-center">
//               {errors.otp.message}
//             </p>
//           )}

//           <Button
//             type="submit"
//             size="lg"
//             className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Verifying..." : "Verify OTP"}
//           </Button>

//           <div className="text-center">
//             <button
//               type="button"
//               onClick={() => toast.success("OTP resent!")}
//               className="text-sm text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300"
//             >
//               Didn&apos;t receive code? Resend
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// }

// app/verify-otp/page.tsx
import React, { Suspense } from "react";
import VerifyOtpForm from "@/app/components/VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtpForm />
      </Suspense>
    </main>
  );
}
