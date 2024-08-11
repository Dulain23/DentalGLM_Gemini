import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

//Importing Routes
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"

//Middleware
const app = express(); 
app.use(express.json());
app.use(cookieParser());

// Configure CORS
const frontendServer = process.env.FRONTEND_SERVER || 'http://localhost:5173';
const corsOptions = {
    origin: frontendServer,
    credentials: true,
};
app.use(cors(corsOptions));

//Database
mongoose.connect(process.env.MONGO_DB).then(() => {
    console.log('App Status: MongoDB Connected')
    app.listen(4000, () => {
        console.log("App Status: Server Started & Running")
    });
}).catch((error) => {
    console.log(error);
})

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

//Next Middleware For Errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});