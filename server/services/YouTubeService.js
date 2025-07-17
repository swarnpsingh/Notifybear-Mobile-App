import axios from 'axios';
import User from '../models/user.model.js';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyDPnXni3z8YR8NC6NET96BmHYc5m6Q0sEw';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

class YouTubeService {
  // Poll all users' selected YouTube creators
  static async pollAllCreators() {
    try {
      const users = await User.find({ 'selectedCreators.platform': 'youtube' });
      console.log('[YouTube Polling] Found users:', users.length);
      for (const user of users) {
        const ytCreators = user.selectedCreators.filter(c => c.platform === 'youtube');
        console.log(`[YouTube Polling] User: ${user.email}, YouTube creators: ${ytCreators.length}`);
        for (const creator of ytCreators) {
          console.log(`[YouTube Polling] Polling creator: ${creator.name}, channelId: ${creator.creatorId}`);
          await YouTubeService.pollCreatorActivities(user, creator);
        }
      }
    } catch (err) {
      console.error('Error polling all creators:', err);
    }
  }

  // Poll a single creator's activities for a user
  static async pollCreatorActivities(user, creator) {
    try {
      const channelId = creator.creatorId || creator.id;
      console.log('[YouTube Polling] pollCreatorActivities for:', channelId);
      const activities = await YouTubeService.getChannelActivities(channelId, creator.youtube?.etag);
      console.log('[YouTube Polling] Activities for', channelId, activities);
      if (!activities) return;

      // Process activities: compare with lastVideoId, lastLiveId, lastPostId
      const { lastVideoId, lastLiveId, lastPostId } = creator.youtube || {};
      let newVideo = null, newLive = null, newPost = null;
      let newEtag = activities.etag;

      // Videos
      const latestVideo = activities.videos?.[0];
      if (latestVideo && latestVideo.id !== lastVideoId) {
        newVideo = latestVideo;
        // Only log new video
        console.log(`[YouTube] New video for ${channelId}:`, latestVideo);
      }
      // Live Streams
      const latestLive = activities.liveStreams?.[0];
      if (latestLive && latestLive.id !== lastLiveId) {
        newLive = latestLive;
        // Only log new live stream
        console.log(`[YouTube] New live stream for ${channelId}:`, latestLive);
      }
      // Community Posts
      const latestPost = activities.communityPosts?.[0];
      if (latestPost && latestPost.id !== lastPostId) {
        newPost = latestPost;
        // Only log new community post
        console.log(`[YouTube] New community post for ${channelId}:`, latestPost);
      }

      // Update DB if any new activity
      if (newVideo || newLive || newPost) {
        await User.updateOne(
          { _id: user._id, 'selectedCreators.creatorId': channelId },
          {
            $set: {
              'selectedCreators.$.youtube.lastPolled': new Date(),
              'selectedCreators.$.youtube.lastVideoId': newVideo ? newVideo.id : lastVideoId,
              'selectedCreators.$.youtube.lastVideoTitle': newVideo ? newVideo.title : (creator.youtube?.lastVideoTitle || ''), // Store title
              'selectedCreators.$.youtube.lastVideoPublishedAt': newVideo ? newVideo.publishedAt : (creator.youtube?.lastVideoPublishedAt || null), // Store publishedAt
              'selectedCreators.$.youtube.lastLiveId': newLive ? newLive.id : lastLiveId,
              'selectedCreators.$.youtube.lastPostId': newPost ? newPost.id : lastPostId,
              'selectedCreators.$.youtube.etag': newEtag,
            },
          }
        );
        console.log(`[YouTube Polling] Updated DB for ${channelId} with video:`, newVideo);
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        // Handle rate limit
        console.error('YouTube API rate limit reached:', err.response.data);
      } else if (err.response && err.response.status === 401) {
        // Handle token expiration (if using OAuth)
        console.error('YouTube API token expired:', err.response.data);
        // TODO: Refresh token logic here
      } else {
        console.error('Error polling creator activities:', err);
      }
    }
  }

  // Fetch channel activities (videos, live streams, community posts)
  static async getChannelActivities(channelId, etag = null) {
    try {
      // Only validate, do not log fetches
      if (!channelId || typeof channelId !== 'string' || channelId.trim() === '') {
        console.error('[YouTubeService] Invalid channelId:', channelId);
        return null;
      }
      if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
        console.error('[YouTubeService] Missing or placeholder YOUTUBE_API_KEY!');
        return null;
      }
      const videoParams = {
        key: YOUTUBE_API_KEY,
        channelId,
        part: 'snippet',
        order: 'date',
        maxResults: 5,
        type: 'video',
      };
      const liveParams = {
        key: YOUTUBE_API_KEY,
        channelId,
        part: 'snippet',
        eventType: 'live',
        type: 'video',
        maxResults: 1,
      };
      // Fetch latest videos
      const videoRes = await axios.get(`${YOUTUBE_API_BASE}/search`, {
        params: videoParams,
        headers: etag ? { 'If-None-Match': etag } : {},
      });
      // Fetch live streams
      const liveRes = await axios.get(`${YOUTUBE_API_BASE}/search`, {
        params: liveParams,
        headers: etag ? { 'If-None-Match': etag } : {},
      });
      // Fetch community posts (not directly available, placeholder)
      // TODO: Use YouTube API or scraping for community posts
      const communityPosts = [];

      return {
        etag: videoRes.headers.etag || null,
        videos: videoRes.data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
        })),
        liveStreams: liveRes.data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
        })),
        communityPosts,
      };
    } catch (err) {
      if (err.response) {
        console.error('YouTube API error:', err.response.data);
      }
      if (err.response && err.response.status === 304) {
        // Not modified, no new data
        return null;
      }
      if (err.response && err.response.status === 403) {
        // Rate limit
        console.error('YouTube API rate limit reached:', err.response.data);
      } else if (err.response && err.response.status === 401) {
        // Token expired
        console.error('YouTube API token expired:', err.response.data);
      } else {
        console.error('Error fetching channel activities:', err);
      }
      return null;
    }
  }
}

export default YouTubeService; 