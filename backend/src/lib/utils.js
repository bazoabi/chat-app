import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // Helps prevent CSRF attacks
  });

  return token;
};
