const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    employees_count: {
      type: String,
      enum: ["0-9", "10-20", "21-50", "51-100", "101+"],
      required: true,
    },
    business_category: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Organization", OrganizationSchema);
