const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
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
    lead_identifier_name: {
      type: String,
      required: true,
      trim: true,
    },
    lead_source: {
      type: String,
      required: true,
      enum: [
        "Website Inquiry",
        "Referral",
        "Social Media",
        "Cold Call",
        "Email Campaign",
        "Trade Show/Exhibition",
        "Networking Event",
        "Google Ads/Search Ads",
        "Content Marketing",
        "Organic Search (SEO)",
        "Print Media",
        "Partner/Reseller",
        "Walk-in",
        "Webinar/Event",
        "LinkedIn Outreach",
        "Advertising (TV/Radio)",
        "Product Demo/Trial",
        "Flyer/Brochure",
        "Sales Outreach",
        "Word of Mouth",
        "SMS Marketing",
        "Customer Re-engagement",
        "CRM Database",
        "Other",
      ],
    },
    company_name: { type: String, maxlength: 150 },
    contact_person: { type: String, required: true, maxlength: 100 },
    contact_number: {
      type: String,
      required: true,
      match: /^[0-9]{7,15}$/,
    },
    email: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/,
    },
    address: {
      street: { type: String, maxlength: 255 },
      city: { type: String, maxlength: 100 },
      state: { type: String, maxlength: 100 },
      postal_code: { type: String, maxlength: 20 },
      country: { type: String, maxlength: 100, default: "UAE" },
    },
    lead_status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"],
      required: true,
    },
    lead_score: { type: Number, min: 0, max: 100, default: null },
    next_steps: { type: String, required: true },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    // lead_customer: {
    //    type: mongoose.Schema.Types.ObjectId,
    //   ref: "Employee",
    //   default: null,
    // },
    comments: { type: String, maxlength: 1000 },
    customer_reference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Reference existing customer if applicable
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lead", LeadSchema);
