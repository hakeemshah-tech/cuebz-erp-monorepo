const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const dbConnection = require("../config/db");

dotenv.config();

// Load User model
const User = require("../models/User.schema");

// Connect to the database
// Connect to MongoDB
dbConnection();

const seedSuperadmin = async () => {
  try {
    // Check if a superadmin already exists
    const existingSuperadmin = await User.findOne({ role: "super-admin" });
    if (existingSuperadmin) {
      console.log("Superadmin account already exists. Skipping seed.");
      process.exit();
    }

    // Create a new superadmin account
    const hashedPassword = await bcrypt.hash("admin123", 10); // Replace with a secure password
    const superadmin = new User({
      name: "Superadmin",
      email: "superadmin@example.com", // Replace with your desired email
      password: hashedPassword,
      role: "super-admin",
      status: "Active",
    });

    await superadmin.save();

    console.log("Superadmin account seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding superadmin account:", error);
    process.exit(1);
  }
};

seedSuperadmin();
