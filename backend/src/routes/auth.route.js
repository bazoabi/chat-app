import express from "express";

const router = express.Router();

// /api/auth/signup
router.get("/signup", (req, res) => {
  res.send("Signup route");
});

// /api/auth/login
router.get("/login", (req, res) => {
  res.send("Login route");
});

// /api/auth/logout
router.get("/logout", (req, res) => {
  res.send("Logout route");
});

export default router;
