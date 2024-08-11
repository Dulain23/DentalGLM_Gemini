import express from "express";

import { updateProfile, updatePassword, getUserRoles } from "../controllers/user.controller.js";
import { getChats, createChat, getChat, deleteChat, sendMessage, endChat, getFeedback } from "../controllers/chat.controller.js";
import { verifyTokenAndRole } from '../utils/verify.user.roles.js'
import { getStudents, getAdmins, createAdmin, deleteAdmin, updateAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.get('/roles/:id', getUserRoles);

// Student Routes
router.post('/update/profile/:id', verifyTokenAndRole(['student']), updateProfile);
router.post('/update/password/:id', verifyTokenAndRole(['student']), updatePassword);
router.post('/create/chat', verifyTokenAndRole(['student']), createChat);
router.get('/conversations', verifyTokenAndRole(['student']), getChats);
router.get('/conversation/:id', verifyTokenAndRole(['student']), getChat);
router.post('/conversation/message/:id', verifyTokenAndRole(['student']), sendMessage);
router.delete('/conversation/delete/:id', verifyTokenAndRole(['student']), deleteChat);
router.post('/conversation/end/:id', verifyTokenAndRole(['student']), endChat);
router.get('/conversations/feedback', verifyTokenAndRole(['student']), getFeedback);

// Admin Routes
router.get('/students', verifyTokenAndRole(['admin']), getStudents);
router.get('/admins', verifyTokenAndRole(['admin']), getAdmins);
router.post('/create/admin', verifyTokenAndRole(['admin']), createAdmin);
router.delete('/delete/admin/:id', verifyTokenAndRole(['admin']), deleteAdmin);
router.post('/update/admin/:id', verifyTokenAndRole(['admin']), updateAdmin);

export default router;