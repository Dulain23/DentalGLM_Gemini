import { errorHandler } from "./error.js";

export const verifyRoles = (roles) => {
    return (req, res, next) => {
        // Check if user has relevant roles
        if (!roles.includes(req.token.role)) {
            return next(errorHandler(403, "App Error - User does not have permmissions."));
        }
        next();
    };
}