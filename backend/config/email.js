const nodemailer = require("nodemailer");
// require("dotenv").config();
const path = require("path");
const env = process.env.NODE_ENV || "development";
const { config } = require("dotenv");
config({ path: path.resolve(process.cwd(), `./env/.env.${env}`) });

console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your app password
  },
});

module.exports = transporter;
