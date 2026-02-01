import { randomUUID } from "crypto";
import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", verifyFirebaseToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM profiles WHERE firebase_uid = ?",
    [req.user.uid],
  );

  res.json(rows[0] || null);
});

router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const {
      name,
      phone,
      profileImage,
      level,
      course_name,
      reg_no,
      username,
      course_id,
    } = req.body;

    await db.query(
      "INSERT INTO profiles (id,firebase_uid, name, phone, profile_image, level,course_name,reg_no,username,course_id) VALUES (?, ?,?, ?, ?, ?,?,?,?,?)",
      [
        randomUUID(),
        req.user.uid,
        name,
        phone,
        profileImage,
        level,
        course_name,
        reg_no,
        username,
        course_id,
      ],
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
