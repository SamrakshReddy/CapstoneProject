import exp from "express";
import { authenticate, register } from "../services/authService.js";
import { ArticleModel } from "../Models/ArticleModel.js";
import { checkAuthor } from "../middlewares/checkauthor.js";
import { verifyToken } from "../middlewares/verifyTokens.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import { cloudinary } from "../config/cloudinary.js";

export const authorRoute = exp.Router();


//  REGISTER AUTHOR (protected route, only ADMIN can create AUTHOR)
authorRoute.post("/users", upload.single("profilePic"), async (req, res) => {
  let cloudinaryResult;

  try {
    // Get user details from request body
    const userObj = req.body;

    // upload image to cloudinary
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    const newUser = await register({
      ...userObj,
      role: "AUTHOR",
      profileImageUrl: cloudinaryResult?.secure_url,
    });
    // Send success response
    res.status(201).json({
      message: "Author registered successfully",
      payload: newUser
    });

  } catch (err) {
    console.error("Author register error:", err);

    // Rollback cloudinary image if DB registration fails
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    res.status(500).json({ //send to your error handling middleware
      message: err.message || "Author registration failed"
    });

  }
});

//  AUTHOR LOGIN (protected route)
authorRoute.post("/login", async (req, res) => {

  try {

    const result = await authenticate(req.body);

    const isProduction = process.env.NODE_ENV === "production" || process.env.PORT !== undefined;

    res.cookie("token", result.token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction ? true : false
    });

    res.status(200).json({
      message: "Login successful",
      user: result.user
    });

  } catch (err) {

    res.status(err.status || 500).json({
      message: err.message
    });

  }

});


//  CREATE ARTICLE (protected route, only AUTHOR can create)
authorRoute.post(
  "/articles",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {

    try {

      const article = req.body;

      const newArticle = new ArticleModel({
        ...article,
        author: req.user.userId,
        isArticleActive: true
      });

      const savedArticle = await newArticle.save();

      res.status(201).json({
        message: "Article created successfully",
        payload: savedArticle
      });

    } catch (err) {

      res.status(500).json({
        message: err.message
      });

    }

  }
);


// GET AUTHOR ARTICLES (protected route, only AUTHOR can access their articles)
authorRoute.get(
  "/articles",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {

    try {

      const articles = await ArticleModel.find({
        author: req.user.userId,
        isArticleActive: true
      });

      res.status(200).json({
        message: "Articles fetched successfully",
        payload: articles
      });

    } catch (err) {

      res.status(500).json({
        message: err.message
      });

    }

  }
);


//  UPDATE ARTICLE (protected route, only AUTHOR can update their articles)
authorRoute.put(
  "/articles/:id",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {

    try {

      const { id } = req.params;
      const { title, category, content } = req.body;

      const article = await ArticleModel.findOne({
        _id: id,
        author: req.user.userId
      });

      if (!article) {
        return res.status(404).json({
          message: "Article not found"
        });
      }

      const updatedArticle = await ArticleModel.findByIdAndUpdate(
        id,
        { title, category, content },
        { new: true }
      );

      res.status(200).json({
        message: "Article updated successfully",
        payload: updatedArticle
      });

    } catch (err) {

      res.status(500).json({
        message: err.message
      });

    }

  }
);


//  DELETE / RESTORE ARTICLE (protected route, only AUTHOR can modify their articles) 
authorRoute.patch(
  "/articles/:id/status",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {

    try {

      const { id } = req.params;
      const { isArticleActive } = req.body;

      const article = await ArticleModel.findById(id);

      if (!article) {
        return res.status(404).json({
          message: "Article not found"
        });
      }

      if (article.author.toString() !== req.user.userId) {
        return res.status(403).json({
          message: "Forbidden: You can modify only your articles"
        });
      }

      article.isArticleActive = isArticleActive;

      await article.save();

      res.status(200).json({
        message: isArticleActive
          ? "Article restored successfully"
          : "Article deleted successfully",
        payload: article
      });

    } catch (err) {

      res.status(500).json({
        message: err.message
      });

    }

  }
);