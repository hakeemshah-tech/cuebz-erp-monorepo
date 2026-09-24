const express = require("express");
const {
  createNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews,
} = require("../controllers/newsUpdate.controller");
const validateRequest = require("../middlewares/validateRequest");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const ensureRole = require("../middlewares/ensureRole");
const { validateNews } = require("../validations/news.validator");
const uploadNewsUpdateFiles = require("../middlewares/fileUploads/newsUpdateFileUploadMiddleware");

const router = express.Router();

// ✅ Create News (Super Admin Only)
router.post(
  "/",
  ensureAuthenticated,
  ensureRole(["super-admin"]),
  uploadNewsUpdateFiles,
  validateRequest(validateNews),
  createNews,
);

// ✅ Get All News (Tenants & Super Admin)
router.get(
  "/",
  ensureAuthenticated,
  ensureRole(["super-admin", "tenant-owner"]),
  getNews,
);

// ✅ Get News by ID (Tenants & Super Admin)
router.get(
  "/:id",
  ensureAuthenticated,
  ensureRole(["super-admin", "tenant-owner"]),
  getNewsById,
);

// ✅ Update News (Super Admin Only)
router.put(
  "/:id",
  ensureAuthenticated,
  ensureRole(["super-admin"]),
  uploadNewsUpdateFiles,
  validateRequest(validateNews),
  updateNews,
);

// ✅ Delete News (Super Admin Only)
router.delete(
  "/:id",
  ensureAuthenticated,
  ensureRole(["super-admin"]),
  deleteNews,
);

module.exports = router;
