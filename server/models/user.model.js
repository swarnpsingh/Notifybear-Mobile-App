import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    twitterId: { 
      type: String, 
      unique: true, 
      sparse: true 
    },
    fcmToken: { 
      type: String 
    },
    selectedCreators: [
      {
        platform: { 
          type: String, 
          required: true,
          enum: ["youtube", "twitch"] // Add other platforms later
        },
        creatorId: { 
          type: String, 
          required: true // YouTube channel ID or Twitch user ID
        },
        name: { 
          type: String, 
          required: true 
        },
        avatar: { 
          type: String 
        },
        // YouTube-specific fields
        youtube: {
          lastPolled: Date,
          lastVideoId: String,
          lastVideoTitle: String, // Added for feed
          lastVideoPublishedAt: Date, // Added for feed
          lastLiveId: String,
          lastPostId: String,
          etag: String // For API caching
        },
        // Twitch-specific fields can be added later
        notificationPreferences: {
          videos: { type: Boolean, default: true },
          liveStreams: { type: Boolean, default: true },
          communityPosts: { type: Boolean, default: false }
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
