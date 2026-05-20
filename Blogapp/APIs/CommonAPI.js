import exp from "express";
import bcrypt from "bcrypt";
import { authenticate } from "../services/authService.js";
import { UserTypeModel } from "../Models/UserModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyTokens.js";

export const commonRouter = exp.Router();

//  LOGIN 
commonRouter.post("/login", async (req, res) => {
try {
  // Get user credentials 
const userCred = req.body;
// Authenticate user and get token
const { token, user } = await authenticate(userCred);

res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
});
// Send response with user details
res.status(200).json({
  message: "Login success",
  payload: user,
});


} catch (err) {
res.status(err.status || 500).json({
message: err.message,
});
}
});

//  CHECK AUTH 
commonRouter.get(
"/check-auth",
verifyToken("ADMIN", "AUTHOR", "USER"),
(req, res) => {
res.status(200).json({
message: "Authorized",
payload: req.user
});
}
);

//  LOGOUT 
commonRouter.get("/logout", (req, res) => {
// Clear the token cookie
res.clearCookie("token", {
httpOnly: true, // Must match original  settings
secure: false,  // Must match original settings
sameSite: "lax",// Must match original settings
});

res.status(200).json({
message: "Logged out successfully",
});
});

//  CHANGE PASSWORD (protected route)
commonRouter.put(
"/change-password",
verifyToken("ADMIN", "AUTHOR", "USER"),
async (req, res) => {
try {
  //get current password and new password from req body
  const { currentPassword, newPassword } = req.body;
  //prevent same password
  if (currentPassword === newPassword) {
    return res.status(400).json({
      message: "New password must be different from current password",
    });
  } 
  if (!currentPassword) {
    return res.status(400).json({
      message: "Current password is required",
    });
  }

  if (!newPassword) {
    return res.status(400).json({
      message: "New password is required",
    });
  }

  // get user id from token
  const userId = req.user.userId;

  const user = await UserTypeModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Current password is incorrect",
    });
  }

  // hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    message: "Password updated successfully",
  });

} catch (err) {
  res.status(500).json({
    message: err.message,
  });
}
});

//Page refresh
commonRouter.get("/check-auth",verifyToken("ADMIN", "AUTHOR", "USER"),(req,res)=>{
res.status(200).json({
message: "Authorized",
payload: req.user 
});
}
);
// Read one article with comments (for USER/AUTHOR/Admin)
commonRouter.get("/articles/:id", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const { id } = req.params;

  const article = await ArticleModel.findById(id)
    .populate("author", "firstName email")
    .populate("comments.user", "firstName email");

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // Users can read only active articles.
  if (req.user.role === "USER" && !article.isArticleActive) {
    return res.status(404).json({ message: "Article not found" });
  }

  // Authors can read only their own articles.
  if (req.user.role === "AUTHOR" && article.author?._id.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden. You can only view your own articles" });
  }

  res.status(200).json({ message: "article", payload: article });
});
