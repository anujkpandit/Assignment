import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import passport from "passport";

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const user = new User({ firstname, lastname, email, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        // Duplicate email error
        if (error.code === 11000 && error.keyValue?.email) {
            return res.status(400).json({ message: "Email already exists. Please login instead." });
        }

        // Validation errors from mongoose
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Please fill all required fields correctly." });
        }

        // Fallback for unexpected errors
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});


// User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Use the secure static method to find and validate the user
        const user = await User.findByCredentials(email, password);

        const secret = process.env.JWT_SECRET;
        if (!secret) {
          console.error("JWT_SECRET is not defined in environment variables.");
          return res.status(500).json({ message: "Server configuration error." });
        }

        const payload = { id: user._id, name: user.firstname };
        const token = jwt.sign(payload, secret, { expiresIn: '1d' });

        res.json({
            message: 'Logged in successfully!',
            token,
            user: { id: user._id, firstname: user.firstname, email: user.email },
        });
    } catch (error) {
        // Log the actual error on the server for easier debugging
        console.error('Login Error:', error.message); 
        
        // Send a more specific status code to the client
        if (error.message === "Invalid login credentials") {
            return res.status(401).json({ message: 'Invalid credentials. Please try again.' });
        }
        
        // For any other type of crash, send a 500 error
        res.status(500).json({ message: 'An unexpected server error occurred.' });
    }
});

export default router;
