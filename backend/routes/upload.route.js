const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
// const { v4: uuidv4 } = require("uuid");
const path = require("path");

const router = express.Router();

/**
 * S3 client
 * Make sure these env vars are set:
 *  - AWS_ACCESS_KEY_ID
 *  - AWS_SECRET_ACCESS_KEY
 *  - AWS_REGION
 *  - AWS_S3_BUCKET_NAME
 * Optionally:
 *  - ASSET_CDN_URL  (e.g. https://cdn.example.com) to build public URLs
 */
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer (single file, memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max; tweak as needed
  },
});

// helper to normalize folder name and build S3 key
// function buildObjectKey(originalName, folder) {
//   const ext = path.extname(originalName) || "";
//   const safeFolder = (folder || "uploads").replace(/(^\/+|\/+$)/g, ""); // no leading/trailing slashes
//   return `${safeFolder}/${uuidv4()}${ext.toLowerCase()}`;
// }

// helper to normalize folder name and build S3 key
function buildObjectKey(originalName, folder) {
  const safeFolder = (folder || "uploads").replace(/(^\/+|\/+$)/g, ""); // no leading/trailing slashes

  // Remove dangerous characters from file name and replace spaces with underscores
  const safeName = path
    .basename(originalName) // remove any path parts
    .replace(/[^a-zA-Z0-9._-]/g, "_"); // allow only safe chars

  // Optionally, you could also append timestamp to avoid overwriting same-name files
  // const timestamp = Date.now();
  // return `${safeFolder}/${timestamp}-${safeName}`;

  return `${safeFolder}/${safeName}`;
}

// helper to produce a public URL (prefers CDN if provided)
function buildPublicUrl(key) {
  const cdn = process.env.ASSET_CDN_URL && process.env.ASSET_CDN_URL.trim();
  if (cdn) {
    const base = cdn.replace(/\/+$/, "");
    return `${base}/${key}`;
  }
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

/**
 * POST /api/upload
 * Expects:
 *  - multipart/form-data with one field: "file"
 *  - optional body field "folder" (string) to prefix the S3 key
 * Returns:
 *  {
 *    message: "Uploaded",
 *    file: {
 *      url, key, originalName, mimeType, size
 *    }
 *  }
 */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file provided. Use field name 'file'." });
    }

    const { originalname, mimetype, buffer, size } = req.file;
    const folder = req.body.folder;
    const Key = buildObjectKey(originalname, folder);

    // Upload to S3
    await s3
      .putObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key,
        Body: buffer,
        ContentType: mimetype,
        // ACL: "public-read", // uncomment only if your bucket policy requires it
      })
      .promise();

    const url = buildPublicUrl(Key);

    return res.status(200).json({
      message: "Uploaded",
      file: {
        url,
        key: Key,
        originalName: originalname,
        mimeType: mimetype,
        size,
      },
    });
  } catch (err) {
    console.error("S3 single upload error:", err);
    return res.status(500).json({ error: "File upload failed." });
  }
});

module.exports = router;
