import express from "express";
import cors from "cors";
import passport from 'passport';
import session from 'express-session';

import "./db/mongoose.js";
import "./config/passport.js"; // Passport configuration

import userRouter from "./routes/user.js";
import profileRouter from "./routes/profile.js";
import authRouter from './routes/auth.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/auth", authRouter); // Google OAuth routes
app.use("/api/users", userRouter); // Login/Register routes
app.use("/api/profiles", profileRouter); // Dashboard CRUD routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
