const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectedDb = await mongoose.connect(process.env.MONGO_DB_URI);
    connectedDb && console.log("DB Connected!");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
