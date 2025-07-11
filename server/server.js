import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import connectDB from './config/db.js';

config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

connectDB();
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/api/user', userRoute);

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});