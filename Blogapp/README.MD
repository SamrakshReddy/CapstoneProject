Backend
Backend for Blog App using Node.js, Express.js, and MongoDB.
Uses of Backend in Capstone Project

1. User Authentication
Handles user registration and login.
Verifies email and password.
Generates and validates JWT tokens.

2. Database Management
Stores users, articles, comments, and profile details in MongoDB.
Retrieves and updates data.

3. API Handling
Creates APIs for frontend communication.
Example:
Register API
Login API
Create Article API
Comment API

4. Article Management
Create, edit, delete, and fetch blog articles.
Manage categories and article content.

5. Comment System
Stores user comments.
Retrieves comments for each article.

6. Image Upload Handling
Upload and manage article/profile images using Cloudinary.

7. Security
Protect routes using authentication.
Validate user permissions.

8. Server-Side Processing
Processes requests and sends responses to frontend.

9. Session / Cookie Management
Maintains login state for users.

10. Deployment Support
Backend is deployed on Render and serves data to the Vercel frontend.
Technologies used in your backend
Node.js
Express.js
MongoDB
JWT Authentication
Cloudinary
Render (Deployment)

Features are
User Authentication
Google Login
Create Blog
View Blogs
Edit Blog
Delete Blog
Image Upload
JWT Authentication
REST API
MongoDB Connection
Packages Used
Install Express: npm install express

Install Mongoose: npm install mongoose

Install CORS: npm install cors

Install Dotenv: npm install dotenv

Install JWT: npm install jsonwebtoken

Install Bcrypt: npm install bcrypt

Install Cookie Parser: npm install cookie-parser

Install Express Session: npm install express-session

Install Passport: npm install passport

Install Google OAuth: npm install passport-google-oauth20

Install Multer: npm install multer

Install Cloudinary: npm install cloudinary

Install Nodemailer: npm install nodemailer

Backend Folder Structure
APIs

AdminAPI.js
AuthorAPI.js
CommonAPI.js
userAPI.js
config

cloudinary.js
cloudinaryUpload.js
multer.js
passport.js
middlewares

checkoutuser.js
verifyTokens.js
Models

AdminModel.js
ArticleModel.js
UserModel.js
node_modules

services

utils

emailService.js
.env

.gitignore

package-lock.json

package.json

README.md

req.http

server.js

To Run Project
npm install nodemon server.js

Environment Variables

DB_URL=mongodb+srv://Samraksh:Reddy%40123@cluster0.eo2vtor.mongodb.net/blogapp?retryWrites=true&w=majority
PORT=4000
NODE_ENV=development
JWT_SECRET=blogappsecretkey
CLOUD_NAME=dmxq7drvr
API_KEY=164769335295599
API_SECRET=_hYadwPSj9Cv3q8iy0B5OcdOQ4c