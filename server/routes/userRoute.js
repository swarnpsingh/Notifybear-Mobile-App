import express from 'express';
import { googleLogin, twitterOAuth, twitterCallback } from '../controllers/userController.js';
const router = express.Router();
import passport from 'passport';

router.post('/google-login', googleLogin);

// Twitter OAuth routes
router.get('/twitter', twitterOAuth);
router.get('/twitter/callback', twitterCallback);

// 🔽 NEW: Twitter auth initiation
router.get('/twitter', passport.authenticate('twitter'));

// 🔽 NEW: Twitter callback after user logs in on Twitter
router.get(
  '/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/login', // can be any route
    session: false,
  }),
  (req, res) => {
    // Redirect to your mobile app with a token or user ID
    const user = req.user;
    res.redirect(`myapp://twitter-callback?token=${user._id}`);
  }
);

export default router;