const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    news_title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    news_description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Stores image URL or file path
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("News", NewsSchema);
