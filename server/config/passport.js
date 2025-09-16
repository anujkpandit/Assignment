import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find if a user exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, pass them to the next middleware
          return done(null, user);
        }

        // If not, check if a user exists with the same email
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If a user with that email exists, link the Google ID
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // If no user exists, create a new one
        const newUser = new User({
          googleId: profile.id,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName || '',
          email: profile.emails[0].value,
          // Password and phone number are not provided by Google
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// These are not strictly necessary for JWT-based auth but are good practice with Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});