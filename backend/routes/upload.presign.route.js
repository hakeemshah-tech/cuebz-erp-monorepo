const express = require("express");
const AWS = require("aws-sdk");
const path = require("path");

const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// your helper to normalize the folder + file name
function buildObjectKey(originalName, folder) {
  const safeFolder = (folder || "uploads").replace(/(^\/+|\/+$)/g, "");
  const safeName = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, "_");
  // add timestamp (or uuid) to avoid collisions
  const key = `${safeFolder}/${Date.now()}-${safeName}`;
  return key;
}

// GET or POST /api/upload/presign
router.post("/presign", async (req, res) => {
  try {
    const { filename, folder, contentType } = req.body;
    if (!filename || !contentType) {
      return res
        .status(400)
        .json({ error: "filename and contentType required" });
    }

    const Key = buildObjectKey(filename, folder);
    const Bucket = process.env.AWS_S3_BUCKET_NAME;

    // the headers you include here must match what the client will send on PUT
    const params = {
      Bucket,
      Key,
      Expires: 60, // URL valid for 60s (tune as needed)
      ContentType: contentType,
      // ACL: "public-read",   // only if your bucket policy requires it
    };

    const url = await s3.getSignedUrlPromise("putObject", params);

    // a convenience function to build your CDN/S3 url for later use
    const publicUrl = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;

    res.json({ url, key: Key, publicUrl });
  } catch (err) {
    console.error("presign error:", err);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
});

module.exports = router;
