"use client";

import Link from "next/link";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { PiArrowRightBold } from "react-icons/pi";
import { Checkbox, Password, Button, Input, Text } from "rizzui";
import { Form } from "@core/ui/form";
import { loginSchema, LoginSchema } from "@/validators/login.schema";
import authService from "@/services/authService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const initialValues: LoginSchema = {
  email: "",
  password: "",
  rememberMe: true,
};

export default function SignInForm() {
  const [reset, setReset] = useState({});

  const router = useRouter();

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const toastId = toast.loading("Signing in...");
    try {
      // Show loading toast

      // Call the login API
      const userData = await authService.login({
        email: data.email,
        password: data.password,
      });

      console.log(userData, "heuu");

      if (userData.verificationRequired) {
        toast.success("Verification Required! Otp sent to Email", {
          id: toastId,
        });
        router.replace(`/otp?email=${data.email}`);
      } else {
        // Success toast
        toast.success("Login successful!", { id: toastId });

        // Redirect to dashboard
        router.replace("/dashboard");

        window.location.href = "/tenant";
      }
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
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="email"
              size="lg"
              label="Email"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register("email")}
              error={errors.email?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register("password")}
              error={errors.password?.message}
            />
            {/* <div className="flex items-center justify-between pb-2">
              <Link
                href={routes.auth.forgotPassword1}
                className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
              >
                Forget Password?
              </Link>
            </div> */}
            <Button className="w-full" type="submit" size="lg">
              <span>Sign in</span>{" "}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center text-[15px] leading-loose text-gray-500 lg:mt-9 xl:text-base">
        Don’t have an account?{" "}
        <Link
          href={"/register"}
          className="font-bold text-gray-700 transition-colors hover:text-primary"
        >
          Register New Account
        </Link>
      </Text>
    </>
  );
}
