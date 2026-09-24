import { useFormContext } from "react-hook-form";
import { Input, Select } from "rizzui";

export default function Form() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

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

  return (
    <div className="grid gap-6">
      <Input
        label="Company Name"
        placeholder="Enter company name"
        {...register("company_name")}
        error={errors.company_name?.message?.toString()}
      />

      <Input
        label="Owner Name"
        placeholder="Enter tenant owner name"
        {...register("name")}
        error={errors.name?.message?.toString()}
      />

      <Input
        label="Owner Email"
        type="email"
        placeholder="Enter owner email"
        {...register("email")}
        error={errors.email?.message?.toString()}
      />

      <Input
        label="Password"
        placeholder="Enter password"
        {...register("password")}
        error={errors.password?.message?.toString()}
      />

      <Select
        label="Number of Employees"
        placeholder="Select employees count"
        options={employeeCountOptions}
        value={watch("employees_count")}
        onChange={(option: any) =>
          setValue("employees_count", option?.value || "")
        }
        error={errors.employees_count?.message?.toString()}
      />

      <Select
        label="Business Category"
        placeholder="Select business category"
        options={businessCategoryOptions}
        value={watch("business_category")}
        onChange={(option: any) =>
          setValue("business_category", option?.value || "")
        }
        error={errors.business_category?.message?.toString()}
      />
    </div>
  );
}
