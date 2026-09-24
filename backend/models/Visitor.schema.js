const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema(
  {
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    visitor_name: { type: String, required: true },
    visitor_company: { type: String, required: true },
    visitor_type: {
      type: String,
      enum: [
        "Customer",
        "Lead",
        "Vendor",
        "Job Seeker",
        "Interview",
        "Payment Followup",
        "Other",
      ],
      required: true,
    },
    visitor_contact_number: { type: String, required: true },
    purpose_of_visit: { type: String, required: true },
    date: { type: Date, default: Date.now },
    reminder_action_date: { type: Date },
    reminder_status: {
      type: String,
      enum: ["pending", "sent", "cancelled"],
      default: "pending",
    },
    follow_up_comment: { type: String },

    // This stores the _id of the related Customer or Vendor
    person_visiting: {
      type: mongoose.Schema.Types.ObjectId,
    },

    // This tells you which model to use for populating
    person_visiting_model: {
      type: String,
      enum: ["Customer", "Vendor", null],
    },
  },
  { timestamps: true },
);

VisitorSchema.index({ reminder_status: 1, reminder_action_date: 1 });
module.exports = mongoose.model("Visitor", VisitorSchema);
