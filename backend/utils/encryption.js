const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

// Utility function to encrypt bank details
const encrypt = (text) => {
  console.log(text, "yeeee");
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    process.env.ENCRYPTION_KEY, // Must be 32 characters
    process.env.ENCRYPTION_IV, // Must be 16 characters
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Utility function to decrypt bank details
const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    process.env.ENCRYPTION_KEY,
    process.env.ENCRYPTION_IV,
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = {
  encrypt,
  decrypt,
};
