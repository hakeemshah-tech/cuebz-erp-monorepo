const mongoose = require("mongoose");

const CallLogSchema = new mongoose.Schema(
  {
    date_time: { type: Date, default: Date.now }, // Date and time of call
    caller_name: { type: String, required: true }, // Caller Name
    caller_company: { type: String }, // Caller Company (Optional)
    visitor_type: {
      type: String,
      enum: ["Customer", "Vendor", "Interview", "Other"],
      required: true,
    }, // Visitor Type
    caller_contact_number: { type: String, required: true }, // Caller Contact Number
    purpose_of_call: { type: String, required: true }, // Purpose of Call
    call_handled_by: { type: String }, // Call Handled By (Employee Name)
    // call_outcome: { type: String }, // Call Outcome/Action Taken
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    }, // Tenant ID
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    }, // Organization ID
    reminder_action_date: { type: Date },
    reminder_status: {
      type: String,
      enum: ["pending", "sent", "cancelled"],
      default: "pending",
    },
    follow_up_comment: { type: String }, // ✅ New field
    // status: {
    //   type: String,
    //   enum: ["Positive Intention", "Neutral Intention", "Negative Intention"],
    //   default: "Positive Intention",
    // },
  },
  { timestamps: true },
);

CallLogSchema.index({ reminder_status: 1, reminder_action_date: 1 });
module.exports = mongoose.model("CallLog", CallLogSchema);
