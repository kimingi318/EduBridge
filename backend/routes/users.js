import { randomUUID } from "crypto";
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
  const { role } = req.body;

  await db.query(
    "INSERT INTO users (id,firebase_uid, email, role) VALUES (?, ?, ?,?)",
    [randomUUID(), req.user.uid, req.user.email, role],
  );

  res.json({ success: true });
});

export default router;
