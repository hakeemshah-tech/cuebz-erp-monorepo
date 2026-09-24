"use client";

import { useFormContext } from "react-hook-form";
import { Button, Input, Select, Textarea, Tooltip } from "rizzui";
import { DatePicker } from "@core/ui/datepicker";
import { useEffect, useState } from "react";
import { MdCheckCircle, MdOutlineCheckCircle } from "react-icons/md";

export default function Form() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const reminderDate = watch("reminder_action_date");
  const [showFollowUp, setShowFollowUp] = useState(false);

  // Show follow-up section by default if reminder date exists
  useEffect(() => {
    if (reminderDate) {
      setShowFollowUp(true);
    }
  }, [reminderDate]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Input
          label="Name"
          placeholder="Enter name"
          {...register("caller_name")}
          error={errors.caller_name?.message?.toString()}
        />

        <Input
          label="Company"
          placeholder="Enter company"
          {...register("caller_company")}
          error={errors.caller_company?.message?.toString()}
        />

        <Select
          label="Visitor Type"
          placeholder="Select visitor type"
          options={[
            { value: "Customer", label: "Customer" },
            { value: "Vendor", label: "Vendor" },
            { value: "Interview", label: "Interview" },
            { value: "Other", label: "Other" },
          ]}
          value={watch("visitor_type")}
          onChange={(option: any) =>
            setValue("visitor_type", option?.value || "")
          }
          error={errors.visitor_type?.message?.toString()}
        />

        <Input
          label="Contact Number"
          placeholder="Enter contact number"
          type="tel"
          {...register("caller_contact_number")}
          error={errors.caller_contact_number?.message?.toString()}
        />

        <Input
          label="Call Handled By (Employee Name)"
          placeholder="Enter employee name"
          {...register("call_handled_by")}
          error={errors.call_handled_by?.message?.toString()}
        />

        <Input
          label="Purpose of Call"
          placeholder="Enter purpose of call"
          {...register("purpose_of_call")}
          error={errors.purpose_of_call?.message?.toString()}
        />

        {/* Date and Time of Call */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date and Time of Call
          </label>
          <DatePicker
            selected={watch("date_time") ? new Date(watch("date_time")) : null}
            onChange={(date: Date | null) =>
              setValue("date_time", date ? date.toISOString() : null)
            }
            placeholderText="Select date and time"
            showTimeSelect
            dateFormat="dd-MMM-yyyy hh:mm aa"
            className="w-full mt-1"
          />
          {errors.date_time && (
            <p className="mt-1 text-sm text-red-600">
              {errors.date_time.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Next Action / Follow-Up Toggle */}
      <div className="flex items-center gap-2 mt-8">
        <Tooltip content="Add Next Action / Follow-up Date">
          <Button
            type="button"
            variant="text"
            size="sm"
            onClick={() => {
              setShowFollowUp(!showFollowUp);
              if (showFollowUp) {
                setValue("follow_up_comment", "");
                setValue("reminder_action_date", "");
              }
            }}
            className="text-primary"
          >
            {showFollowUp ? (
              <MdCheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <MdOutlineCheckCircle className="w-6 h-6 text-gray-400" />
            )}
          </Button>
        </Tooltip>
        <span className="text-sm font-medium text-gray-700">
          Next Action / Follow-Up
        </span>
      </div>

      {/* Follow-Up Fields */}
      {showFollowUp && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reminder Date
            </label>
            <DatePicker
              selected={
                watch("reminder_action_date")
                  ? new Date(watch("reminder_action_date"))
                  : null
              }
              onChange={(date: Date | null) =>
                setValue(
                  "reminder_action_date",
                  date ? date.toISOString() : null
                )
              }
              placeholderText="Select a reminder date"
              dateFormat="dd-MMM-yyyy"
              className="w-full mt-1"
            />
            {errors.reminder_action_date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.reminder_action_date.message?.toString()}
              </p>
            )}
          </div>

          <div className="xl:col-span-3">
            <Textarea
              label="Follow-Up Comment"
              placeholder="Enter comment or next action note..."
              {...register("follow_up_comment")}
              error={errors.follow_up_comment?.message?.toString()}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      )}
    </>
  );
}

{
  /* DatePicker for Reminder for Action */
}
{
  /* <div>
        <label className="block text-sm font-medium text-gray-700">
          Reminder for Action (Optional)
        </label>
        <DatePicker
          selected={
            watch("reminder_action_date")
              ? new Date(watch("reminder_action_date"))
              : null
          }
          onChange={(date: Date | null) => {
            setValue("reminder_action_date", date ? date.toISOString() : null);
          }}
          placeholderText="Select a reminder date"
          dateFormat="dd-MMM-yyyy"
          className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.reminder_action_date && (
          <p className="mt-1 text-sm text-red-600">
            {errors.reminder_action_date.message?.toString()}
          </p>
        )}
      </div> */
}
{
  /* 
      <Select
        label="Status"
        placeholder="Select status"
        options={[
          { value: "Positive Intention", label: "Positive Intention" },
          { value: "Neutral Intention", label: "Neutral Intention" },
          { value: "Negative Intention", label: "Negative Intention" },
        ]}
        value={watch("status")}
        onChange={(option: any) => setValue("status", option?.value || "")}
        error={errors.status?.message?.toString()}
      /> */
}
{
  /* 
      <div className="col-span-1 md:col-span-2">
        <Textarea
          label="Call Outcome/Action Taken (Optional)"
          placeholder="Enter call outcome or actions taken"
          {...register("call_outcome")}
          error={errors.call_outcome?.message?.toString()}
        />
      </div> */
}
