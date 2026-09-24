const mongoose = require("mongoose");

const EventCalendarSchema = new mongoose.Schema(
  {
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    }, // Multi-tenancy support

    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    }, // Organization reference

    title: {
      type: String,
      required: true,
      trim: true,
    }, // Event Title

    description: {
      type: String,
      required: false,
      trim: true,
    }, // Optional Event Description

    date: {
      type: Date,
      required: true,
    }, // Event Date
  },
  { timestamps: true },
);

module.exports = mongoose.model("EventCalendar", EventCalendarSchema);
