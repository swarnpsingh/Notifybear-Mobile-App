import express from 'express';
import { googleLogin, saveSelectedCreators, getSelectedCreators, getUser } from '../controllers/userController.js';
import YouTubeService from '../services/YouTubeService.js';
const router = express.Router();
import passport from 'passport';

router.post('/google-login', googleLogin);
router.post('/save-selected-creators', saveSelectedCreators);
router.get('/get-selected-creators', getSelectedCreators);
router.get('/get-user', getUser);

// GET /activities?channelId=...
router.get('/activities', async (req, res) => {
  const { channelId } = req.query;
  if (!channelId) {
    return res.status(400).json({ error: 'Missing channelId' });
  }
  try {
    const activities = await YouTubeService.getChannelActivities(channelId);
    console.log(`[API] Activities for channel ${channelId}:`, activities);
    res.json({ success: true, activities });
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ error: 'Failed to fetch activities', details: err.message });
  }
});

export default router;