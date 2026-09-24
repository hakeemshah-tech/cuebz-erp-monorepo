// "use client";

// import { useFormContext } from "react-hook-form";
// import { Input, Select, Textarea, Tooltip, Button } from "rizzui";
// import { DatePicker } from "@core/ui/datepicker";
// import { useState, useEffect } from "react";
// import { MdCheckCircle, MdOutlineCheckCircle } from "react-icons/md";

// export default function Form() {
//   const {
//     register,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useFormContext();

//   const reminderDate = watch("reminder_action_date");
//   const [showFollowUp, setShowFollowUp] = useState(false);

//   // Show follow-up section by default if reminder date exists
//   useEffect(() => {
//     if (reminderDate) {
//       setShowFollowUp(true);
//     }
//   }, [reminderDate]);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* Date Picker */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Date</label>
//         <DatePicker
//           selected={watch("date") ? new Date(watch("date")) : null}
//           onChange={(date: Date | null) => {
//             setValue("date", date ? date.toISOString() : null);
//           }}
//           placeholderText="Select a Date"
//           dateFormat="dd-MMM-yyyy"
//           className="w-full mt-1"
//         />
//         {errors.date && (
//           <p className="mt-1 text-sm text-red-600">
//             {errors.date.message?.toString()}
//           </p>
//         )}
//       </div>

//       <Input
//         label="Visitor Name"
//         placeholder="Enter visitor name"
//         {...register("visitor_name")}
//         error={errors.visitor_name?.message?.toString()}
//       />

//       <Input
//         label="Visitor Company"
//         placeholder="Enter visitor company"
//         {...register("visitor_company")}
//         error={errors.visitor_company?.message?.toString()}
//       />

//       <Select
//         label="Visitor Type"
//         placeholder="Select visitor type"
//         options={[
//           { value: "Customer", label: "Customer" },
//           { value: "Lead", label: "Lead" },
//           { value: "Vendor", label: "Vendor" },
//           { value: "Job Seeker", label: "Job Seeker" },
//           { value: "Interview", label: "Interview" },
//           { value: "Payment Followup", label: "Payment Followup" },
//           { value: "Other", label: "Other" },
//         ]}
//         value={watch("visitor_type")}
//         onChange={(option: any) =>
//           setValue("visitor_type", option?.value || "")
//         }
//         error={errors.visitor_type?.message?.toString()}
//       />
//       <Input
//         label="Visitor Contact Number"
//         placeholder="Enter contact number"
//         type="tel"
//         {...register("visitor_contact_number")}
//         error={errors.visitor_contact_number?.message?.toString()}
//       />

//       {/* <Input
//         label="Person Visiting (Employee Name)"
//         placeholder="Enter employee name"
//         {...register("person_visiting")}
//         error={errors.person_visiting?.message?.toString()}
//       /> */}

//       <Input
//         label="Purpose of Visit"
//         placeholder="Enter purpose of visit"
//         {...register("purpose_of_visit")}
//         error={errors.purpose_of_visit?.message?.toString()}
//       />

//       {/* Toggle Follow-up section */}
//       <div className="col-span-2 flex items-center gap-2">
//         <Tooltip content="Add Next Action / Follow-up Date">
//           <Button
//             type="button"
//             variant="text"
//             size="sm"
//             onClick={() => {
//               setShowFollowUp(!showFollowUp);
//               if (showFollowUp) {
//                 setValue("follow_up_comment", "");
//                 setValue("reminder_action_date", "");
//               }
//             }}
//             className="text-primary"
//           >
//             {showFollowUp ? (
//               <MdCheckCircle className="w-6 h-6 text-green-600" />
//             ) : (
//               <MdOutlineCheckCircle className="w-6 h-6 text-gray-400" />
//             )}
//           </Button>
//         </Tooltip>
//         <span className="text-sm font-medium text-gray-700">
//           Next Action / Follow-Up
//         </span>
//       </div>

//       {/* Follow-Up Fields */}
//       {showFollowUp && (
//         <>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Reminder Date
//             </label>
//             <DatePicker
//               selected={
//                 watch("reminder_action_date")
//                   ? new Date(watch("reminder_action_date"))
//                   : null
//               }
//               onChange={(date: Date | null) => {
//                 setValue(
//                   "reminder_action_date",
//                   date ? date.toISOString() : null
//                 );
//               }}
//               placeholderText="Select a reminder date"
//               dateFormat="dd-MMM-yyyy"
//               className="w-full mt-1"
//             />
//             {errors.reminder_action_date && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.reminder_action_date.message?.toString()}
//               </p>
//             )}
//           </div>

//           <div className="col-span-2">
//             <Textarea
//               label="Follow-Up Comment"
//               placeholder="Enter comment or next action note..."
//               {...register("follow_up_comment")}
//               error={errors.follow_up_comment?.message?.toString()}
//               className="mt-1"
//               rows={3}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input, Select, Textarea, Tooltip, Button } from "rizzui";
import { DatePicker } from "@core/ui/datepicker";
import { useState, useEffect } from "react";
import { MdCheckCircle, MdOutlineCheckCircle } from "react-icons/md";
import customerService from "@/services/customerService";
import vendorService from "@/services/vendorService";

export default function Form() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const reminderDate = watch("reminder_action_date");
  const visitorType = watch("visitor_type");
  const personVisiting = watch("person_visiting");

  const [showFollowUp, setShowFollowUp] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    if (reminderDate) {
      setShowFollowUp(true);
    }
  }, [reminderDate]);

  useEffect(() => {
    if (visitorType === "Customer") {
      customerService.getList().then((data) => setCustomers(data.data));
    }
    if (visitorType === "Vendor") {
      vendorService.getList().then((data) => setVendors(data.data));
    }
  }, [visitorType]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Controller
        name="date"
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <DatePicker
              selected={field.value ?? null}
              onChange={(date: Date | null) => field.onChange(date)}
              placeholderText="Select a Date"
              dateFormat="dd-MMM-yyyy"
              className="w-full mt-1"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date.message?.toString()}
              </p>
            )}
          </div>
        )}
      />

      <Input
        label="Visitor Name"
        placeholder="Enter visitor name"
        {...register("visitor_name")}
        error={errors.visitor_name?.message?.toString()}
      />

      <Input
        label="Visitor Company"
        placeholder="Enter visitor company"
        {...register("visitor_company")}
        error={errors.visitor_company?.message?.toString()}
      />

      <Select
        label="Visitor Type"
        placeholder="Select visitor type"
        options={[
          { value: "Customer", label: "Customer" },
          { value: "Lead", label: "Lead" },
          { value: "Vendor", label: "Vendor" },
          { value: "Job Seeker", label: "Job Seeker" },
          { value: "Interview", label: "Interview" },
          { value: "Payment Followup", label: "Payment Followup" },
          { value: "Other", label: "Other" },
        ]}
        value={visitorType}
        onChange={(option: any) => {
          setValue("visitor_type", option?.value || "");
          setValue("person_visiting", "");
          setValue("person_visiting_model", "");
        }}
        error={errors.visitor_type?.message?.toString()}
      />

      <Input
        label="Visitor Contact Number"
        placeholder="Enter contact number"
        type="tel"
        {...register("visitor_contact_number")}
        error={errors.visitor_contact_number?.message?.toString()}
      />

      {/* Person Visiting for Customer */}
      {visitorType === "Customer" && (
        <Select
          label="Person Visiting (Customer)"
          placeholder="Select customer"
          options={customers.map((c: any) => ({
            value: c._id,
            label: c.full_name,
          }))}
          value={
            customers
              .map((c: any) => ({
                value: c._id,
                label: c.full_name,
              }))
              .find((o) => o.value === personVisiting) || null
          }
          onChange={(option: any) => {
            setValue("person_visiting", option?.value || null);
            setValue("person_visiting_model", "Customer");
          }}
          error={errors.person_visiting?.message?.toString()}
        />
      )}

      {/* Person Visiting for Vendor */}
      {visitorType === "Vendor" && (
        <Select
          label="Person Visiting (Vendor)"
          placeholder="Select vendor"
          options={vendors.map((v: any) => ({
            value: v._id,
            label: v.vendor_name,
          }))}
          value={
            vendors
              .map((v: any) => ({
                value: v._id,
                label: v.vendor_name,
              }))
              .find((o) => o.value === personVisiting) || null
          }
          onChange={(option: any) => {
            setValue("person_visiting", option?.value || null);
            setValue("person_visiting_model", "Vendor");
          }}
          error={errors.person_visiting?.message?.toString()}
        />
      )}

      <Input
        label="Purpose of Visit"
        placeholder="Enter purpose of visit"
        {...register("purpose_of_visit")}
        error={errors.purpose_of_visit?.message?.toString()}
      />

      {/* Follow-up toggle row (full width) */}
      <div className="col-span-3 flex items-center gap-2 mt-2">
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

      {showFollowUp && (
        <>
          <Controller
            name="reminder_action_date"
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reminder Date
                </label>
                <DatePicker
                  selected={new Date(field.value) ?? null}
                  onChange={(date: Date | null) => field.onChange(date)}
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
            )}
          />

          <div className="col-span-3">
            <Textarea
              label="Follow-Up Comment"
              placeholder="Enter comment or next action note..."
              {...register("follow_up_comment")}
              error={errors.follow_up_comment?.message?.toString()}
              className="mt-1"
              rows={3}
            />
          </div>
        </>
      )}
    </div>
  );
}

{
  /* Date Picker */
}
{
  /* <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <DatePicker
          // selected={watch("date") ? new Date(watch("date")) : null}
          // onChange={(date: Date | null) =>
          //   setValue("date", date ? date.toISOString() : null)
          // }

          selected={watch("date") ?? null}
          onChange={(date: Date | null) => setValue("date", date)}
          placeholderText="Select a Date"
          dateFormat="dd-MMM-yyyy"
          className="w-full mt-1"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">
            {errors.date.message?.toString()}
          </p>
        )}
      </div> */
}
