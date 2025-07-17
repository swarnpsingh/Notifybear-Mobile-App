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

export const saveSelectedCreators = async (req, res) => {
  try {
    const { userId, creators } = req.body;
    if (!userId || !Array.isArray(creators)) {
      return res.status(400).json({ error: 'Missing userId or creators' });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { selectedCreators: creators },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Save Selected Creators Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const getSelectedCreators = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, creators: user.selectedCreators });
  } catch (err) {
    console.error('Get Selected Creators Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Get User Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Save FCM token for a user
export const saveFcmToken = async (req, res) => {
  const { userId, fcmToken } = req.body;
  if (!userId || !fcmToken) return res.status(400).json({ error: 'Missing userId or fcmToken' });
  try {
    await User.updateOne({ _id: userId }, { $set: { fcmToken } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save FCM token' });
  }
};