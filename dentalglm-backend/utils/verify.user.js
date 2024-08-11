import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    // Check if token exists
    if (!token) return next(errorHandler(401, "App Error - User not authenticated."));

    jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
        // Check if token is valid
        if (err) return next(errorHandler(403, "App Error - User token is not valid."));
        // Add token to request if it is valid
        req.token = token;
        next();
    });
}