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
    selectedCreators: [
      {
        id: String,
        name: String,
        avatar: String,
        platform: String,
      }
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
