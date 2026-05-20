import exp from 'express';
import { verifyToken } from '../middlewares/verifyTokens.js';
import { UserTypeModel } from '../Models/UserModel.js';
import { ArticleModel } from '../Models/ArticleModel.js';
import { cloudinary } from '../config/cloudinary.js';

export const adminRoute = exp.Router();

//  DASHBOARD STATS 

// GET Dashboard Stats (Total Users, Authors, Articles, Active Users)
adminRoute.get('/stats', verifyToken('ADMIN'), async (req, res) => {
  try {
    const totalUsers = await UserTypeModel.countDocuments({ role: 'USER' });
    const totalAuthors = await UserTypeModel.countDocuments({ role: 'AUTHOR' });
    const totalArticles = await ArticleModel.countDocuments({ isArticleActive: true });
    const activeUsers = await UserTypeModel.countDocuments({ isActive: true, role: { $in: ['USER', 'AUTHOR'] } });

    res.status(200).json({
      message: 'Dashboard stats retrieved',
      payload: {
        totalUsers,
        totalAuthors,
        totalArticles,
        activeUsers,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching stats',
      error: err.message,
    });
  }
});

// ==================== USER MANAGEMENT ====================

// GET ALL USERS (with pagination and search)
adminRoute.get('/users', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) {
      filter.role = role;
    }

    const users = await UserTypeModel.find(filter)
      .select('-password')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalUsers = await UserTypeModel.countDocuments(filter);

    res.status(200).json({
      message: 'Users retrieved',
      payload: {
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching users',
      error: err.message,
    });
  }
});

// GET SINGLE USER
adminRoute.get('/users/:userId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const user = await UserTypeModel.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User retrieved',
      payload: user,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching user',
      error: err.message,
    });
  }
});

// BLOCK USER
adminRoute.patch('/block-user/:userId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const user = await UserTypeModel.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await UserTypeModel.findByIdAndUpdate(
      req.params.userId,
      { $set: { isActive: false } },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'User blocked successfully',
      payload: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error blocking user',
      error: err.message,
    });
  }
});

// UNBLOCK USER
adminRoute.patch('/unblock-user/:userId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const user = await UserTypeModel.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await UserTypeModel.findByIdAndUpdate(
      req.params.userId,
      { $set: { isActive: true } },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'User unblocked successfully',
      payload: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error unblocking user',
      error: err.message,
    });
  }
});

// DELETE USER
adminRoute.delete('/delete-user/:userId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const user = await UserTypeModel.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's profile image from cloudinary
    if (user.profileImageUrl) {
      const publicId = user.profileImageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`blog-app/${publicId}`).catch(() => {});
    }

    // Delete all user's articles
    await ArticleModel.deleteMany({ author: req.params.userId });

    // Delete user
    await UserTypeModel.findByIdAndDelete(req.params.userId);

    res.status(200).json({
      message: 'User and associated articles deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error deleting user',
      error: err.message,
    });
  }
});

//  ARTICLE MANAGEMENT 

// GET ALL ARTICLES (with pagination and search)
adminRoute.get('/articles', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    if (status === 'active') {
      filter.isArticleActive = true;
    } else if (status === 'inactive') {
      filter.isArticleActive = false;
    }

    const articles = await ArticleModel.find(filter)
      .populate('author', 'firstName lastName email profileImageUrl')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalArticles = await ArticleModel.countDocuments(filter);

    res.status(200).json({
      message: 'Articles retrieved',
      payload: {
        articles,
        totalArticles,
        totalPages: Math.ceil(totalArticles / limit),
        currentPage: page,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching articles',
      error: err.message,
    });
  }
});

// DELETE ARTICLE
adminRoute.delete('/delete-article/:articleId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.articleId);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await ArticleModel.findByIdAndDelete(req.params.articleId);

    res.status(200).json({
      message: 'Article deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error deleting article',
      error: err.message,
    });
  }
});

// DEACTIVATE ARTICLE
adminRoute.patch('/deactivate-article/:articleId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.articleId);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.articleId,
      { $set: { isArticleActive: false } },
      { new: true }
    ).populate('author', 'firstName lastName email');

    res.status(200).json({
      message: 'Article deactivated successfully',
      payload: updatedArticle,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error deactivating article',
      error: err.message,
    });
  }
});

// ==================== AUTHOR MANAGEMENT ====================

// GET ALL AUTHORS
adminRoute.get('/authors', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const filter = { role: 'AUTHOR' };
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const authors = await UserTypeModel.find(filter)
      .select('-password')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    // Get article count for each author
    const authorsWithCounts = await Promise.all(
      authors.map(async (author) => {
        const articleCount = await ArticleModel.countDocuments({ author: author._id });
        return {
          ...author.toObject(),
          articleCount,
        };
      })
    );

    const totalAuthors = await UserTypeModel.countDocuments(filter);

    res.status(200).json({
      message: 'Authors retrieved',
      payload: {
        authors: authorsWithCounts,
        totalAuthors,
        totalPages: Math.ceil(totalAuthors / limit),
        currentPage: page,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching authors',
      error: err.message,
    });
  }
});

//  ADMIN REGISTRATION 

// REGISTER ADMIN (with secret key)
adminRoute.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, adminKey } = req.body;

    // Validate admin key
    const secretKey = process.env.ADMIN_SECRET_KEY || 'admin-secret-key-change-me';
    if (adminKey !== secretKey) {
      return res.status(403).json({
        message: 'Invalid admin key. Admin registration denied.',
      });
    }

    // Check if email already exists
    const existingUser = await UserTypeModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    // Import register service
    const { register } = await import('../services/authService.js');

    // Create new admin
    const newAdmin = await register({
      firstName,
      lastName,
      email,
      password,
      role: 'ADMIN',
    });

    res.status(201).json({
      message: 'Admin registered successfully',
      payload: newAdmin,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error registering admin',
      error: err.message,
    });
  }
});
