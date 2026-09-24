const { body } = require("express-validator");

const validateNews = [
  body("news_title")
    .trim()
    .notEmpty()
    .withMessage("News title is required.")
    .isLength({ max: 200 })
    .withMessage("News title cannot exceed 200 characters."),

  body("news_description")
    .trim()
    .notEmpty()
    .withMessage("News description is required.")
    .isLength({ max: 2000 })
    .withMessage("News description cannot exceed 2000 characters."),
];

// ✅ Validate Uploaded Image
const validateUploadedImage = (req, res, next) => {
  const uploadedFile = req.file;
  const existingUrl = req.body.image;

  if (!uploadedFile && !existingUrl) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: [{ field: "image", message: "News image is required." }],
    });
  }

  next();
};

module.exports = {
  validateNews,
  validateUploadedImage,
};
