import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import User from '../models/user.model.js';

// Check if Twitter credentials are available
const twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;

if (twitterConsumerKey && twitterConsumerSecret) {
  passport.use(new TwitterStrategy({
    consumerKey: twitterConsumerKey,
    consumerSecret: twitterConsumerSecret,
    callbackURL: 'http://localhost:4000/api/user/twitter/callback'
  },
  async (token, tokenSecret, profile, done) => {
    try {
      const existingUser = await User.findOne({ twitterId: profile.id });
      if (existingUser) return done(null, existingUser);

      const newUser = new User({
        twitterId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value || '',
        photo: profile.photos?.[0]?.value || '',
        connectedPlatforms: ['twitter'],
      });

      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err, null);
    }
  }));
} else {
  console.warn('Twitter credentials not found. Twitter OAuth will be disabled.');
}

export default passport;
