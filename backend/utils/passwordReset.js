// utils/passwordReset.js
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const OTP_TTL_MINUTES = 10; // OTP valid for 10 minutes
const RESET_TOKEN_TTL_MINUTES = 15;
const MAX_OTP_ATTEMPTS = 5;

function generateOtp() {
  // 6-digit numeric, avoid leading zeros by padding
  const n = crypto.randomInt(0, 1000000);
  return n.toString().padStart(6, "0");
}

function generateOpaqueToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex"); // 64-char hex
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

async function hashValue(value) {
  const saltRounds = 10;
  return bcrypt.hash(value, saltRounds);
}

async function compareHash(value, hash) {
  return bcrypt.compare(value, hash);
}

module.exports = {
  OTP_TTL_MINUTES,
  RESET_TOKEN_TTL_MINUTES,
  MAX_OTP_ATTEMPTS,
  generateOtp,
  generateOpaqueToken,
  addMinutes,
  hashValue,
  compareHash,
};
