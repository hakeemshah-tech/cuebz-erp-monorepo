const News = require("../models/newsUpdate.schema");
const AppError = require("../utils/appError");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ✅ Upload Image to Cloudinary
const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// ✅ Create News (Super Admin Only)
exports.createNews = async (req, res, next) => {
  try {
    console.log("File received:", req.file); // 🛠 Debugging line

    const { body, file } = req;
    let imageUrl = null;

    if (file) {
      imageUrl = await uploadToCloudinary(file, "news/images");
    }

    const newNews = await News.create({
      news_title: body.news_title,
      news_description: body.news_description,
      image: imageUrl,
    });

    res.status(201).json({
      message: "News created successfully.",
      data: newNews,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get All News (Tenants & Super Admin)
exports.getNews = async (req, res, next) => {
  try {
    const newsList = await News.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "News retrieved successfully.",
      data: newsList,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Single News by ID (Tenants & Super Admin)
exports.getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return next(new AppError("News not found.", 404));
    }

    res.status(200).json({
      message: "News retrieved successfully.",
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Update News (Super Admin Only)
exports.updateNews = async (req, res, next) => {
  try {
    const { body, file } = req;
    let imageUrl = body.image; // Retain existing image if no new file is uploaded

    // Upload new image if provided
    if (file) {
      imageUrl = await uploadToCloudinary(file, "news/images");
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      {
        news_title: body.news_title,
        news_description: body.news_description,
        image: imageUrl,
      },
      { new: true, runValidators: true },
    );

    if (!updatedNews) {
      return next(new AppError("News not found.", 404));
    }

    res.status(200).json({
      message: "News updated successfully.",
      data: updatedNews,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete News (Super Admin Only)
exports.deleteNews = async (req, res, next) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);

    if (!deletedNews) {
      return next(new AppError("News not found.", 404));
    }

    res.status(200).json({
      message: "News deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
