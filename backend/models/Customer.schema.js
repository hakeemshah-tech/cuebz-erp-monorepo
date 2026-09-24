const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      maxlength: 150,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: "Invalid email address format.",
      },
    },
    phone_number: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: "Phone number must be between 10 and 15 digits.",
      },
    },
    address: {
      street: { type: String, maxlength: 255 },
      city: { type: String, maxlength: 100 },
      state: { type: String, maxlength: 100 },
      postal_code: { type: String, maxlength: 20 },
      country: { type: String, maxlength: 100 },
    },
    date_of_birth: {
      type: Date,
      required: false,
    },
    customer_type: {
      type: String,
      enum: ["Individual", "Business"],
      default: "Individual",
    },
    organization_name: {
      type: String,
      maxlength: 150,
      required: function () {
        return this.customer_type === "Business";
      },
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // User assigned to manage the customer
      required: false,
    },
    notes: {
      type: String,
      maxlength: 1000,
      default: "",
    },
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Customer", CustomerSchema);
