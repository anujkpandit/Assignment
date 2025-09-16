import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Route: GET /api/auth/google
// Desc:  Initiate Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route: GET /api/auth/google/callback
// Desc:  Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login`
, session: false }),
  (req, res) => {
    // Successful authentication, generate JWT
    const payload = {
  id: req.user._id,
  firstname: req.user.firstname,
  email: req.user.email,
};


    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Redirect to the frontend with the token
    // The frontend will be responsible for storing the token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

export default router;