const { body } = require("express-validator");

const createBrandKitValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Brand Kit Name is required.")
    .isLength({ max: 100 })
    .withMessage("Brand Kit Name cannot exceed 100 characters."),

  body("color_palette")
    .isArray({ min: 1 })
    .withMessage("At least one color is required.")
    .optional(),

  body("color_palette.*.color_name")
    .trim()
    .notEmpty()
    .withMessage("Color name is required.")
    .optional(),

  body("color_palette.*.hex_code")
    .trim()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Invalid HEX color code.")
    .optional(),

  body("typography")
    .isArray()
    .withMessage("Typography must be an array.")
    .optional(),

  body("typography.*.font_name")
    .trim()
    .notEmpty()
    .withMessage("Font name is required.")
    .optional(),

  body("typography.*.font_url")
    .optional()
    .isURL()
    .withMessage("Font URL must be a valid URL."),

  body("imagery").isArray().withMessage("Imagery must be an array.").optional(),

  body("imagery.*.image_url")
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL.")
    .optional(),

  body("imagery.*.description")
    .trim()
    .isLength({ max: 300 })
    .withMessage("Image description cannot exceed 300 characters.")
    .optional(),

  body("brand_guidelines")
    .optional()
    .isURL()
    .withMessage("Brand Guidelines must be a valid URL."),

  body("business_card_files")
    .optional()
    .isURL()
    .withMessage("Business Card Files must be a valid URL."),

  body("letterhead_file")
    .optional()
    .isURL()
    .withMessage("Letterhead File must be a valid URL."),

  body("company_profile")
    .optional()
    .isURL()
    .withMessage("Company Profile must be a valid URL."),

  body("presentation_templates")
    .isArray()
    .withMessage("Presentation templates must be an array.")
    .optional(),

  body("presentation_templates.*.template_url")
    .trim()
    .isURL()
    .withMessage("Presentation template URL must be a valid URL.")
    .optional(),

  body("presentation_templates.*.description")
    .trim()
    .isLength({ max: 300 })
    .withMessage("Presentation description cannot exceed 300 characters.")
    .optional(),

  body("brand_mission")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Brand mission cannot exceed 500 characters.")
    .optional(),

  body("brand_vision")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Brand vision cannot exceed 500 characters.")
    .optional(),

  body("brand_values")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Brand values cannot exceed 500 characters.")
    .optional(),

  body("brand_voice_and_tone")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Brand voice and tone cannot exceed 500 characters.")
    .optional(),

  body("brand_story")
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Brand story cannot exceed 1000 characters.")
    .optional(),

  body("video_guidelines")
    .optional()
    .isURL()
    .withMessage("Video guidelines must be a valid URL."),
];

const updateBrandKitValidation = createBrandKitValidation.map((validation) =>
  validation.optional(),
);

module.exports = {
  createBrandKitValidation,
  updateBrandKitValidation,
};
