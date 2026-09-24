import { Controller, useFormContext } from "react-hook-form";
import { Input, Select } from "rizzui";

export default function Form() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid gap-6">
      <Input
        label="Plan Name"
        placeholder="Enter subscription name"
        {...register("name")}
        error={errors.name?.message?.toString()}
      />

      <Input
        label="Description"
        placeholder="Enter subscription description"
        {...register("description")}
        error={errors.description?.message?.toString()}
      />

      <Input
        label="Price"
        type="number"
        placeholder="Enter subscription price"
        {...register("price")}
        error={errors.price?.message?.toString()}
      />

      <Controller
        control={control}
        name="interval"
        render={({ field }) => (
          <Select
            label="Interval"
            placeholder="Select interval"
            options={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
              { value: "year", label: "Year" },
            ]}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="interval_count"
        render={({ field }) => (
          <Select
            label="Interval Count"
            placeholder="Select interval count"
            options={[
              { value: "1", label: "1" },
              { value: "3", label: "3" },
              { value: "6", label: "6" },
            ]}
            {...field}
            error={errors.interval_count?.message?.toString()}
          />
        )}
      />

      <Input
        label="Trial Duration (Days)"
        type="number"
        value="20" // Default to 20
        disabled // Disable input
        className="bg-gray-100 cursor-not-allowed" // Optional styling for disabled input
        {...register("trial_duration")}
      />
    </div>
  );
}
