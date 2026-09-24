// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { SubmitHandler } from "react-hook-form";
// import { PiArrowRightBold } from "react-icons/pi";
// import { Password, Checkbox, Button, Input, Text } from "rizzui";
// import { Form } from "@core/ui/form";
// import { commonRoutes } from "@/config/routes";
// import { signUpSchema, SignUpSchema } from "@/validators/signup.schema";
// import { useRouter } from "next/navigation";

// import toast from "react-hot-toast";
// import authService from "@/services/authService";

// const initialValues = {
//   name: "",
//   email: "",
//   password: "",
//   company_name: "",
//   isAgreed: false,
// };

// export default function SignUpForm() {
//   const [reset, setReset] = useState({});
//   const router = useRouter();

//   const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
//     const toastId = toast.loading("Registering...");

//     if (data.isAgreed) {
//       try {
//         // Show loading toast

//         // Call the login API
//         await authService.registerTenant({
//           email: data.email,
//           password: data.password,
//           name: data.name,
//           company_name: data.company,
//         });

//         // Success toast
//         toast.success("OTP Sent to Email for verification!", { id: toastId });

//         // Redirect to dashboard
//         router.replace(`/otp?email=${data.email}`);

//         // window.location.reload();
//       } catch (error: any) {
//         console.log("Login Error:", error.message);
//         // Show error toast
//         toast.error(
//           error.message || "Login failed. Please check your credentials.",
//           { id: toastId }
//         );
//       }
//     } else {
//       toast.error("You must agree terms and condition", { id: toastId });
//     }

//     // console.log(data);
//     // setReset({ ...initialValues, isAgreed: false });
//   };

//   return (
//     <>
//       <Form<SignUpSchema>
//         validationSchema={signUpSchema}
//         resetValues={reset}
//         onSubmit={onSubmit}
//         useFormProps={{
//           defaultValues: initialValues,
//         }}
//       >
//         {({ register, formState: { errors } }) => (
//           <div className="flex flex-col gap-x-4 gap-y-5 md:grid md:grid-cols-2 lg:gap-5">
//             <Input
//               type="text"
//               size="lg"
//               label="Your Name"
//               placeholder="Enter your Name"
//               className="col-span-2 [&>label>span]:font-medium"
//               inputClassName="text-sm"
//               {...register("name")}
//               error={errors.name?.message}
//             />
//             <Input
//               type="text"
//               size="lg"
//               label="Company Name"
//               placeholder="Enter your Company Name"
//               className="col-span-2 [&>label>span]:font-medium"
//               inputClassName="text-sm"
//               {...register("company")}
//               error={errors.company?.message}
//             />
//             <Input
//               type="email"
//               size="lg"
//               label="Email"
//               className="col-span-2 [&>label>span]:font-medium"
//               inputClassName="text-sm"
//               placeholder="Enter your email"
//               {...register("email")}
//               error={errors.email?.message}
//             />
//             <Password
//               label="Password"
//               placeholder="Enter your password"
//               size="lg"
//               className="col-span-2 [&>label>span]:font-medium"
//               inputClassName="text-sm"
//               {...register("password")}
//               error={errors.password?.message}
//             />

//             <div className="col-span-2 flex items-start">
//               <Checkbox
//                 {...register("isAgreed")}
//                 className="[&>label>span]:font-medium [&>label]:items-start"
//                 label={
//                   <>
//                     By signing up you have agreed to our{" "}
//                     <Link
//                       href="/"
//                       className="font-medium text-blue transition-colors hover:underline"
//                     >
//                       Terms
//                     </Link>{" "}
//                     &{" "}
//                     <Link
//                       href="/"
//                       className="font-medium text-blue transition-colors hover:underline"
//                     >
//                       Privacy Policy
//                     </Link>
//                   </>
//                 }
//               />
//             </div>
//             <Button size="lg" type="submit" className="col-span-2 mt-2">
//               <span>Get Started</span>{" "}
//               <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
//             </Button>
//           </div>
//         )}
//       </Form>
//       <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
//         Don’t have an account?{" "}
//         <Link
//           href={commonRoutes.signin}
//           className="font-semibold text-gray-700 transition-colors hover:text-blue"
//         >
//           Sign In
//         </Link>
//       </Text>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { PiArrowRightBold } from "react-icons/pi";
import { Password, Checkbox, Button, Input, Text, Select } from "rizzui";
import { Form } from "@core/ui/form";
import { commonRoutes } from "@/config/routes";
import { signUpSchema, SignUpSchema } from "@/validators/signup.schema";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import authService from "@/services/authService";

const initialValues = {
  name: "",
  email: "",
  password: "",
  company_name: "",
  employees_count: "",
  business_category: "",
  isAgreed: false,
};

// Options for the dropdowns
const employeeCountOptions = [
  { value: "0-9", label: "0-9" },
  { value: "10-20", label: "10-20" },
  { value: "21-50", label: "21-50" },
  { value: "51-100", label: "51-100" },
  { value: "101+", label: "101+" },
];

const businessCategoryOptions = [
  "General Trading",
  "E-commerce",
  "Consultancy",
  "Accounting and Auditing",
  "Engineering Services",
  "Healthcare (clinics, medical centers)",
  "Education and Training",
  "Manufacturing",
  "Construction and Contracting",
  "Energy",
  "Hotels and Resorts",
  "Restaurants and Cafes",
  "Travel Agencies",
  "Entertainment",
  "Real Estate",
  "Commercial Brokerage",
  "Transportation",
  "Logistics & Freight forwarding",
  "Courier services",
  "Financial Services",
  "Technology",
  "Other",
].map((category) => ({ value: category, label: category }));

export default function SignUpForm() {
  const [reset, setReset] = useState({});
  const router = useRouter();

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    const toastId = toast.loading("Registering...");

    if (data.isAgreed) {
      try {
        // Call the register API
        await authService.registerTenant({
          email: data.email,
          password: data.password,
          name: data.name,
          company_name: data.company_name,
          employees_count: data.employees_count,
          business_category: data.business_category,
        });

        // Success toast
        toast.success("OTP Sent to Email for verification!", { id: toastId });

        // Redirect to OTP verification
        router.replace(`/otp?email=${data.email}`);
      } catch (error: any) {
        console.log("Registration Error:", error.message);
        // Show error toast
        toast.error(error.message || "Registration failed. Please try again.", {
          id: toastId,
        });
      }
    } else {
      toast.error("You must agree to terms and conditions", { id: toastId });
    }
  };

  return (
    <>
      <Form<SignUpSchema>
        validationSchema={signUpSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, setValue, watch, formState: { errors } }) => (
          <div className="flex flex-col gap-x-4 gap-y-5 md:grid md:grid-cols-2 lg:gap-5">
            <Input
              type="text"
              size="lg"
              label="Your Name"
              placeholder="Enter your Name"
              className="col-span-2 [&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register("name")}
              error={errors.name?.message}
            />
            <Input
              type="text"
              size="lg"
              label="Company Name"
              placeholder="Enter your Company Name"
              className="col-span-2 [&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register("company_name")}
              error={errors.company_name?.message}
            />
            <Input
              type="email"
              size="lg"
              label="Email"
              className="col-span-2 [&>label>span]:font-medium"
              inputClassName="text-sm"
              placeholder="Enter your email"
              {...register("email")}
              error={errors.email?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="col-span-2 [&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register("password")}
              error={errors.password?.message}
            />

            {/* Employees Count Dropdown */}
            <Select
              label="Employees Count"
              placeholder="Select Employees Count"
              className="col-span-2 [&>label>span]:font-medium"
              options={employeeCountOptions}
              value={employeeCountOptions.find(
                (option) => option.value === watch("employees_count")
              )}
              onChange={(option: any) =>
                setValue("employees_count", option?.value || "")
              }
              error={errors.employees_count?.message}
            />

            {/* Business Category Dropdown */}
            <Select
              label="Business Category"
              placeholder="Select Business Category"
              className="col-span-2 [&>label>span]:font-medium"
              options={businessCategoryOptions}
              value={businessCategoryOptions.find(
                (option) => option.value === watch("business_category")
              )}
              onChange={(option: any) =>
                setValue("business_category", option?.value || "")
              }
              error={errors.business_category?.message}
            />

            <div className="col-span-2 flex items-start">
              <Checkbox
                {...register("isAgreed")}
                className="[&>label>span]:font-medium [&>label]:items-start"
                label={
                  <>
                    By signing up you have agreed to our{" "}
                    <Link
                      href="/"
                      className="font-medium text-blue transition-colors hover:underline"
                    >
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link
                      href="/"
                      className="font-medium text-blue transition-colors hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </>
                }
              />
            </div>
            <Button size="lg" type="submit" className="col-span-2 mt-2">
              <span>Get Started</span>{" "}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Already have an account?{" "}
        <Link
          href={commonRoutes.signin}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
