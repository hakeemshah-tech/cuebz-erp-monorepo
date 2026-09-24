"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  User,
  Mail,
  Lock,
  Building,
  CheckCircle,
  XCircle,
  Users,
  Tag,
} from "lucide-react";
import authService from "@/services/authService";
import toast from "react-hot-toast";

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

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  company_name: Yup.string().required("Company name is required"),
  employees_count: Yup.string().required("Employee count is required"),
  business_category: Yup.string().required("Business category is required"),
  isAgreed: Yup.boolean().oneOf([true], "You must agree to terms"),
});

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  icon?: React.ElementType;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  error?: string;
  touched?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  icon: Icon,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => (
  <div className="space-y-1">
    <label
      htmlFor={name}
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`pl-10 pr-4 py-2 w-full rounded-md border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
          error && touched ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
    {error && touched && (
      <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
    )}
  </div>
);

interface SelectFieldProps {
  label: string;
  name: string;
  icon?: React.ElementType;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur: React.FocusEventHandler<HTMLSelectElement>;
  error?: string;
  touched?: boolean;
  options: { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  icon: Icon,
  value,
  onChange,
  onBlur,
  error,
  touched,
  options,
}) => (
  <div className="space-y-1">
    <label
      htmlFor={name}
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`pl-10 pr-4 py-2 w-full rounded-md border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
          error && touched ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    {error && touched && (
      <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
    )}
  </div>
);

const Register = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      company_name: "",
      employees_count: "",
      business_category: "",
      isAgreed: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        // Call the register API
        await authService.registerTenant(values);

        // Success toast
        toast.success("OTP Sent to Email for verification!");

        // Redirect to OTP verification
        router.replace(`/verify-otp?email=${values.email}`);
      } catch {
        setStatus({ type: "error", message: "Network error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-900 dark:text-white">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Briefcase className="mx-auto text-purple-700" size={40} />
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start streamlining your operations today.
            </p>
          </div>

          {formik.status && (
            <div
              className={`text-sm px-4 py-3 rounded-md flex items-center gap-2 ${
                formik.status.type === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {formik.status.type === "success" ? <CheckCircle /> : <XCircle />}{" "}
              {formik.status.message}
            </div>
          )}

          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            <InputField
              {...formik.getFieldProps("name")}
              label="Name"
              name="name"
              icon={User}
              error={formik.errors.name}
              touched={formik.touched.name}
            />
            <InputField
              {...formik.getFieldProps("company_name")}
              label="Company Name"
              name="company_name"
              icon={Building}
              error={formik.errors.company_name}
              touched={formik.touched.company_name}
            />
            <InputField
              {...formik.getFieldProps("email")}
              label="Email"
              name="email"
              icon={Mail}
              type="email"
              error={formik.errors.email}
              touched={formik.touched.email}
            />
            <InputField
              {...formik.getFieldProps("password")}
              label="Password"
              name="password"
              icon={Lock}
              type="password"
              error={formik.errors.password}
              touched={formik.touched.password}
            />
            <SelectField
              {...formik.getFieldProps("employees_count")}
              label="Employees Count"
              name="employees_count"
              icon={Users}
              options={employeeCountOptions}
              error={formik.errors.employees_count}
              touched={formik.touched.employees_count}
            />
            <SelectField
              {...formik.getFieldProps("business_category")}
              label="Business Category"
              name="business_category"
              icon={Tag}
              options={businessCategoryOptions}
              error={formik.errors.business_category}
              touched={formik.touched.business_category}
            />

            <div className="flex items-start gap-2">
              <input
                id="isAgreed"
                name="isAgreed"
                type="checkbox"
                checked={formik.values.isAgreed}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label
                htmlFor="isAgreed"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="underline text-purple-700 dark:text-purple-400"
                >
                  Terms
                </a>{" "}
                &{" "}
                <a
                  href="#"
                  className="underline text-purple-700 dark:text-purple-400"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            {formik.errors.isAgreed && formik.touched.isAgreed && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {formik.errors.isAgreed}
              </p>
            )}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-purple-700 text-white py-2 rounded-md font-semibold shadow hover:bg-purple-800 transition"
            >
              {formik.isSubmitting ? "Submitting..." : "Get Started"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="#"
              className="font-semibold text-purple-700 hover:underline dark:text-purple-400"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 p-8">
        <div className="rounded-xl overflow-hidden shadow-lg w-full">
          <img
            src="/bg-img.png"
            alt="Mockup Background"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
