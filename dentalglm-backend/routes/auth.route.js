import express from "express";

import { login, register, googleLogin, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/logout', logout);

export default router;