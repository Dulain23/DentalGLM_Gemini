import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js"
import { successHandler } from "../utils/success.js"

export const getStudents = async (req, res, next) => {
    try {
        // Pagination 
        const page = parseInt(req.query.page) - 1 || 0
        const limit = 7
        const search = req.query.search || "";

        // Query the database for users with the role of 'student'
        const students = await User.find({ role: 'student' })
            .find({ name: { $regex:search, $options: "i" } })
            .select('name email role profile')
            .sort({ createdAt: -1 })
            .skip(page * limit)
            .limit(limit);

        const total = await User.countDocuments({ 
            name: { $regex:search, $options: "i" },
            role: 'student'
        });

        return res.status(200).json({ success: true, body: { students, total, limit, page: page + 1 } });

    } catch (error) {
        // Log the error for debugging and return
        console.error("Error fetching students:", error);
        next(errorHandler(500, "Database Error - Unable to retrieve from the database."));
    }
}

export const getAdmins = async (req, res, next) => {
    try {
        // Pagination 
        const page = parseInt(req.query.page) - 1 || 0
        const limit = 8
        const search = req.query.search || "";

        // Query the database for users with the role of 'student'
        const admins = await User.find({ role: 'admin' })
            .find({ name: { $regex:search, $options: "i" } })
            .select('name email role profile')
            .sort({ createdAt: -1 })
            .skip(page * limit)
            .limit(limit);

        const total = await User.countDocuments({ 
            name: { $regex:search, $options: "i" },
            role: 'admin'
        });

        return res.status(200).json({ success: true, body: { admins, total, limit, page: page + 1 } });

    } catch (error) {
        // Log the error for debugging and return
        console.error("Error fetching admins:", error);
        next(errorHandler(500, "Database Error - Unable to retrieve from the database."));
    }
}

export const createAdmin = async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if email is already used
    const emailExists = await User.findOne({ email });
    if (emailExists) return next(errorHandler(401, "Registration Error - Email already exists."));

    // Create hashed password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new instance User model
    const newUser = new User({ name, email, password: hashedPassword, role: 'admin' });
    try {
        // Save new User to MongoDB
        await newUser.save();
        res.status(201).json(successHandler(201, "Registration Success - Admin created successfully."));
    } catch (error) {
        next(errorHandler(500, "Registration Error - Database issue."));
    }
}

export const deleteAdmin = async (req, res, next) => {
    const adminID = req.params.id;
    try {
        // Find the admin by ID
        const admin = await User.findById(adminID);

        // Check if admin exists
        if (!admin) {
            return next(errorHandler(404, "Admin Error - Admin not found."));
        }

        // Delete the admin
        await User.deleteOne({ _id: adminID });
        return res.status(200).json(successHandler(200, "Admin Success - Admin successfully deleted."));

    } catch (error) {
        console.error("Error deleting admin:", error);
        return next(errorHandler(500, "Database Error - Unable to delete the admin."));
    }
}

export const updateAdmin = async (req, res, next) => {
    // Check if admin is trying to update their own account
    if (req.token.id !== req.params.id) {
        try {
            const updateData = {
                name: req.body.name,
            };
            // Check if a new password is provided
            if (req.body.password) {
                // Create and hash the new password
                const hashedNewPassword = bcryptjs.hashSync(req.body.password, 10);
                updateData.password = hashedNewPassword;
            }
            // Update User Details
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: updateData,
                },
                { new: true }
            );
            return res.status(200).json(successHandler(200, "Update Success - Admin successfully updated."));
        } catch (error) {
            next(errorHandler(500, "Update Error - Database issue."));
        }
    } else {
        return next(errorHandler(401, "Update Error - You cannot update your account from here."));
    }
};