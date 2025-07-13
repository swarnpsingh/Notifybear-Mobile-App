import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

// Load environment variables first
config();

import userRoute from './routes/userRoute.js';
import connectDB from './config/db.js';
import './config/passport.js'; // 🔴 VERY IMPORTANT: load your passport config

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔐 Session for Passport to track users
app.use(session({
  secret: 'some-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// 🔑 Passport init
app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/api/user', userRoute);

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
