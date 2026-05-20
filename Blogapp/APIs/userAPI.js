import exp from "express";
import { register } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyTokens.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import { upload } from "../config/multer.js";
import { cloudinary } from "../config/cloudinary.js";

export const userRoute = exp.Router();


// REGISTER USER 
userRoute.post(
  "/users",
  upload.single("profilePic"),
  async (req, res, next) => {
    let cloudinaryResult;

    try {
      //GET USER Obj
      let userObj = req.body;
      // step1: upload image to cloudinary and get the url
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }
      //step2: call existing register service()
      const newUserObj = await register({
        ...userObj,
        role: "USER",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "user created",
        payload: newUserObj,
      });

    } catch (err) {
      //step3: Rollback
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }
      next(err);// send to error handling middleware
    }
  }
);


//  GET ALL ARTICLES (protected route)
userRoute.get("/articles", verifyToken("USER"), async (req, res) => {
  try {
    // Fetch only active articles and populate author details
    const articles = await ArticleModel.find({
      isArticleActive: true,
    }).populate("author", "firstName profileImageUrl");
    // Return the articles in the response
    res.status(200).json({
      message: "articles",
      payload: articles,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching articles",
      error: err.message,
    });
  }
});


//  GET ARTICLE BY ID (protected route)
userRoute.get("/articles/:id", verifyToken("USER"), async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.id)
      .populate("author", "firstName profileImageUrl")
      .populate("comments.user", "firstName profileImageUrl");
    // Check if the article exists and is active
    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json({
      // Return the article in the response
      message: "single article",
      payload: article,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching article",
      error: err.message,
    });
  }
});

// ADD COMMENT 
userRoute.post("/articles/comment", verifyToken("USER"), async (req, res) => {
  try {
    const { articleId, comment } = req.body;
    const userId = req.user.userId;

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      {
        $push: {
          comments: {
            user: userId,
            comment,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .populate("comments.user", "firstName profileImageUrl");

    if (!updatedArticle) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    return res.status(200).json({
      message: "Comment added",
      payload: updatedArticle,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error adding comment",
      error: err.message,
    });
  }
});

// LIKE / UNLIKE COMMENT
userRoute.post("/articles/comment/like", verifyToken("USER"), async (req, res) => {
  try {
    const { articleId, commentId } = req.body;
    const userId = req.user.userId;

    const article = await ArticleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const comment = article.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const alreadyLiked = comment.likedBy?.some((id) => id.toString() === userId.toString());
    if (alreadyLiked) {
      comment.likedBy.pull(userId);
    } else {
      comment.likedBy = comment.likedBy || [];
      comment.likedBy.push(userId);
    }

    await article.save();
    await article.populate("comments.user", "firstName profileImageUrl");

    return res.status(200).json({
      message: alreadyLiked ? "Like removed" : "Comment liked",
      payload: article,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error toggling comment like",
      error: err.message,
    });
  }
});

//next() ---> next middleware
//next(err) ---> error handling middleware

