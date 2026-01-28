import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";
import { randomUUID } from "crypto";

const router = express.Router();

router.get("/", verifyFirebaseToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT u.*, c.name AS course FROM units u JOIN courses c ON u.course_id = c.id"
  );
  res.json(rows);
});

router.post("/", verifyFirebaseToken, async (req, res) => {
  const { name, code, courseId } = req.body;

  await db.query(
    "INSERT INTO units (id, name, code, course_id) VALUES (?, ?, ?, ?)",
    [randomUUID(), name, code, courseId]
  );

  res.json({ success: true });
});

export default router;
