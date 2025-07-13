import User from '../models/user.model.js';

export const googleLogin = async (req, res) => {
  const { googleId, email, name, photo } = req.body;

  console.log('Received login request:', { googleId, email, name, photo });

  try {
    let user = await User.findOne({ googleId });

    if (user) {
      // Update existing user
      user.lastLogin = new Date();
      await user.save();
      console.log('Updated existing user:', user._id);
      return res.status(200).json({ success: true, user });
    }
    
    // Create new user
    user = await User.create({ googleId, email, name, photo });
    console.log('Created new user:', user._id);
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Google login error details:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process login',
      details: error.message 
    });
  }
};

export const twitterOAuth = async (req, res) => {
  try {
    // Check if Twitter credentials are available
    if (!process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET) {
      return res.status(500).json({ 
        success: false, 
        error: 'Twitter credentials not configured' 
      });
    }

    // Redirect to Twitter OAuth
    const clientId = process.env.TWITTER_CONSUMER_KEY;
    const redirectUri = 'https://notifybear.com/auth/twitter/callback';
    const scopes = 'tweet.read users.read follows.read offline.access';
    
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=notifybear-state`;
    
    res.redirect(authUrl);
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to initiate Twitter OAuth' 
    });
  }
};

export const twitterCallback = async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'No authorization code received' });
    }

    // Check if Twitter credentials are available
    if (!process.env.TWITTER_CLIENT_SECRET) {
      return res.status(500).json({ error: 'Twitter credentials not configured' });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:4000/api/user/twitter/callback',
        client_id: process.env.TWITTER_CONSUMER_KEY || 'dVZxblc2TmgydDBzMlFiLTdsUDA6MTpjaQ',
        client_secret: process.env.TWITTER_CLIENT_SECRET,
      }).toString(),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.access_token) {
      // Redirect to mobile app with token
      res.redirect(`myapp://twitter-callback?token=${tokenData.access_token}`);
    } else {
      console.error('Twitter token error:', tokenData);
      res.status(400).json({ error: 'Failed to get access token' });
    }
  } catch (error) {
    console.error('Twitter callback error:', error);
    res.status(500).json({ error: 'Failed to process Twitter callback' });
  }
};
