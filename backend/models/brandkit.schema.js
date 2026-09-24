const mongoose = require("mongoose");

const BrandKitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }, // Brand Kit Name

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

    logo: {
      type: String,
      required: false,
    }, // URL to logo file

    color_palette: [
      {
        color_name: { type: String },
        hex_code: { type: String },
      },
    ], // List of brand colors

    typography: [
      {
        font_name: { type: String, required: true },
        font_url: { type: String, required: false },
      },
    ], // Font names and optional URLs

    imagery: [
      {
        image_url: { type: String, required: true },
        description: { type: String, required: false },
      },
    ], // List of images and descriptions

    brand_guidelines: {
      type: String,
      required: false,
    }, // URL to brand guideline document

    business_card_files: {
      type: String,
      required: false,
    }, // URL to business card files

    letterhead_file: {
      type: String,
      required: false,
    }, // URL to letterhead file

    company_profile: {
      type: String,
      required: false,
    }, // URL to company profile document

    presentation_templates: [
      {
        template_url: { type: String, required: true },
        description: { type: String, required: false },
      },
    ], // List of presentation templates
    brand_mission: {
      type: String,
    },
    brand_vision: {
      type: String,
    },
    brand_values: {
      type: String,
    },
    brand_voice_and_tone: {
      type: String,
      required: false,
    }, // Text field for describing brand voice and tone

    brand_story: {
      type: String,
      required: false,
    }, // Text field for brand story

    video_guidelines: {
      type: String,
      required: false,
    }, // URL to video guidelines document (optional)

    created_at: {
      type: Date,
      default: Date.now,
    },

    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BrandKit", BrandKitSchema);
