import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";
import { randomUUID } from "crypto";

const router = express.Router();

router.get("/", verifyFirebaseToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT l.*, u.name AS unit FROM lecturers l JOIN units u ON l.unit_id = u.id"
  );
  res.json(rows);
});

router.post("/", verifyFirebaseToken, async (req, res) => {
  const { name, code, courseId, unitId } = req.body;

  await db.query(
    "INSERT INTO lecturers (id, name, code, course_id, unit_id) VALUES (?, ?, ?, ?, ?)",
    [randomUUID(), name, code, courseId, unitId]
  );

  res.json({ success: true });
});

export default router;
