import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { successHandler } from "../utils/success.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'

// Getting user roles and validating token to display relevant UI
export const getUserRoles = async (req, res, next) => {

    const token = req.cookies.access_token;
    // Check if there is a token
    if (!token) return  res.status(401).json({success: false, body: "App Error - User token is not valid."});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Check if token is valid
        if (err) return res.status(403).json({success: false, body: "App Error - User token is not valid."});
        // Check if User ID matches the Request User ID.
        if (user.id === req.params.id) {
            return res.status(200).json({success: true, body: user.role });
        }else{
            return res.status(403).json({success: false, body: "App Error - User is not authorised."});
        }
    });
    
}

export const updateProfile = async (req, res, next) => {
    // Check if User ID matches Request User ID
    if (req.token.id === req.params.id) {
        try {
            // Update User Details
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        name: req.body.name,
                    }
                },
                { new: true }
            );
            // Remove password & role from User Data - Security
            const { password: hashedPassword, role: role, ...rest } = updatedUser._doc;
            return res.status(200).json(successHandler(200, "Update Success -  User Details have been updated.", rest));
        } catch (error) {
            next(errorHandler(500, "Update Error - Database issue."));
        }

    } else {
        return next(errorHandler(401, "Update Error - You can update only your account."));
    }
};

export const updatePassword = async (req, res, next) => {
    // Check if User ID matches Request User ID
    if (req.token.id === req.params.id) {
        try {
            const user = await User.findById(req.params.id);

            // Check if password is valid
            const validPassword = bcryptjs.compareSync(req.body.current_password, user.password);
            if (!validPassword) return next(errorHandler(401, "Update Error - Incorrect account password."));

            // Create and Update New Password
            const hashedNewPassword = bcryptjs.hashSync(req.body.new_password, 10);
            user.password = hashedNewPassword;
            await user.save();

            return res.status(200).json(successHandler(200, "Update Success -  Password update successful."));

        } catch (error) {
            next(errorHandler(500, "Update Error - Database issue."));
        }
    } else {
        return next(errorHandler(401, "Update Error - You can update only your account."));
    }
};

