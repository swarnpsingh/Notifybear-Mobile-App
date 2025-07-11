import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(`${process.env.MONGO_URI}notifybear`).then(() => {
    console.log("Database connected.");
  });
};

export default connectDB;