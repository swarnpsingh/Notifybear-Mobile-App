import express from 'express';
import { googleLogin, saveSelectedCreators, getSelectedCreators, getUser, saveFcmToken } from '../controllers/userController.js';
import YouTubeService from '../services/YouTubeService.js';
const router = express.Router();
import passport from 'passport';

router.post('/google-login', googleLogin);
router.post('/save-selected-creators', saveSelectedCreators);
router.get('/get-selected-creators', getSelectedCreators);
router.get('/get-user', getUser);
router.post('/save-fcm-token', saveFcmToken);

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

// GET /youtube/activity-feed
router.get('/youtube/activity-feed', async (req, res) => {
  try {
    // Get all users with selectedCreators
    const users = await (await import('../models/user.model.js')).default.find({ 'selectedCreators.platform': 'youtube' });
    const feed = [];
    users.forEach(user => {
      user.selectedCreators.filter(c => c.platform === 'youtube').forEach(creator => {
        // Only include if there is a lastVideoId
        if (creator.youtube && creator.youtube.lastVideoId) {
          feed.push({
            creator: {
              name: creator.name,
              avatar: creator.avatar,
              creatorId: creator.creatorId,
            },
            videoId: creator.youtube.lastVideoId,
            videoTitle: creator.youtube.lastVideoTitle || '',
            publishedAt: creator.youtube.lastVideoPublishedAt,
            videoUrl: `https://www.youtube.com/watch?v=${creator.youtube.lastVideoId}`,
            videoThumbnail: `https://i.ytimg.com/vi/${creator.youtube.lastVideoId}/hqdefault.jpg`,
          });
        }
      });
    });
    // Sort by publishedAt descending
    feed.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    res.json({ success: true, feed });
  } catch (err) {
    console.error('Error fetching YouTube activity feed:', err);
    res.status(500).json({ error: 'Failed to fetch activity feed', details: err.message });
  }
});

export default router;