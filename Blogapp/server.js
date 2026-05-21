import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { userRoute } from "./APIs/userAPI.js";
import cookieParser from "cookie-parser";
import { adminRoute } from "./APIs/AdminAPI.js";
import { authorRoute } from "./APIs/AuthorAPI.js";
import { commonRouter } from "./APIs/CommonAPI.js";
import cors from "cors";

config();

const app = exp();

//  CORS 
const allowedOrigins = [
  "http://localhost:5173",
  "https://capstone-project-nine-lime.vercel.app"
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// BODY PARSER 
app.use(exp.json());

//  COOKIE PARSER 
app.use(cookieParser());

//  CONNECT APIs 
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRouter);


//  CONNECT DB AND START SERVER
const connectDB = async () => {
  try {

    await connect(process.env.DB_URL);

    console.log("DB connection success");

    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server started on port ${process.env.PORT || 4000}`);
    });

  } catch (err) {

    console.log("Error in DB connection", err);

  }
};

connectDB();


//  INVALID PATH 
app.use((req, res) => {
  res.status(404).json({
    message: `${req.url} is an invalid path`
  });
});


//  ERROR HANDLER 
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message
    });
  }

  res.status(500).json({
    message: "error occurred",
    error: "Server side error"
  });

});