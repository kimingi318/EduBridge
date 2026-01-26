import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET logged-in user's profile
 */
router.get("/me", verifyFirebaseToken, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users WHERE firebase_uid = ?", [
    req.user.uid,
  ]);

  if (rows.length === 0) {
    return res.status(404).json({ error: "Profile not found" });
  }

  res.json(rows[0]);
});

/**
 * CREATE user profile (called after signup)
 */
router.post("/", verifyFirebaseToken, async (req, res) => {
  const { regNo } = req.body;

  await db.query(
    "INSERT INTO users (firebase_uid, email, reg_no, role) VALUES (?, ?, ?, 'student')",
    [req.user.uid, req.user.email, regNo],
  );

  res.json({ success: true });
});

// //profile
// router.post("/profiles", verifyFirebaseToken, async (req, res) => {
//   const { name, Phone } = req.body;

//   await db.query(
//     "INSERT INTO profiles (firebase_uid, name, Phone, Profile-Url) VALUES (?, ?, ?, 'https://photos.google.com/photo/AF1QipOGRHaoTVX9p9cNTpII-vb2tX6iTnTVvXUr52uk')",
//     [req.user.uid, name, Phone],
//   );

//   res.json({ success: true });
// });

export default router;
