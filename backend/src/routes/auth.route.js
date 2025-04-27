import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// /api/auth/signup
router.post("/signup", signup);

// /api/auth/login
router.post("/login", login);

// /api/auth/logout
router.post("/logout", logout);

// /api/auth/update-profile
router.put("/update-profile", protectRoute, updateProfile);

// /api/auth/check
router.get("/check", protectRoute, checkAuth);

export default router;
