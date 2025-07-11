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
