import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js"
import { successHandler } from "../utils/success.js"
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if email is already used
    const emailExists = await User.findOne({ email });
    if (emailExists) return next(errorHandler(401, "Registration Error - Email already exists."));

    // Create hashed password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new instance User model
    const newUser = new User({ name, email, password: hashedPassword });
    try {
        // Save new User to MongoDB
        await newUser.save();
        res.status(201).json(successHandler(201, "Registration Success - User created."));
    } catch (error) {
        next(errorHandler(500, "Registration Error - Database issue."));
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Check if email is valid
        const user = await User.findOne({ email });
        if (!user) return next(errorHandler(404, 'Login Error - User does not exist.'));

        // Check if password is valid
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) return next(errorHandler(401, 'Login Error - Invalid credentials.'));

        // Create Token and Put Cookie 
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

        // Remove password & role from User Data - Security
        const { password: hashedPassword, role: role, ...rest } = user._doc;

        return res.cookie('access_token', token, { httpOnly: true }).status(200).json(successHandler(200, "Login Success - User logged in.", {user: rest, role: role}));

    } catch (error) {
        next(errorHandler(500, "Login Error - Database issue."));
    }
}

export const googleLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
             
            // Log In User - Create Cookie
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
            // Remove password & role from User Data - Security
            const { password: hashedPassword, role: role, ...rest } = user._doc;

            return res.cookie('access_token', token, { httpOnly: true }).status(200).json(successHandler(200, "Login Success - User logged in.", {user: rest, role: role}));
        } else {
            const randomPassword = Math.random().toString(36).slice(-8);

            // Create & Save New User
            const hashedRandomPassword = bcryptjs.hashSync(randomPassword, 10);
            const newUser = new User({ 
                name: req.body.name, 
                email: req.body.email, 
                password: hashedRandomPassword,
                profile: req.body.photo,
            });
            await newUser.save();

            // Log In User - Create Cookie
            const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);
            // Remove password & role from User Data - Security
            const { password: hashedPassword, role: role, ...rest } = newUser._doc;

            return res.cookie('access_token', token, { httpOnly: true }).status(200).json(successHandler(200, "Login Success - User logged in.", {user: rest, role: role}));
        }
    } catch (error) {
        console.log(error);
        next(errorHandler(500, "Google Auth Error - Database Error."));
    }

}

export const logout = (req, res) => {
    //Clear Stored Token in Cookies
    return res.clearCookie('access_token').status(200).json(successHandler(200, "Logout Success - User logged out."));
}