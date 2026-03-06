import { randomUUID } from "crypto";
import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyFirebaseToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT u.*, c.name AS course FROM units u JOIN courses c ON u.course_id = c.id",
  );
  res.json(rows);
});

// return units belonging to a specific course
router.get("/by-course/:courseId", verifyFirebaseToken, async (req, res) => {
  const { courseId } = req.params;
  const [rows] = await db.query(
    "SELECT name,id FROM units WHERE course_id = ?",
    [courseId],
  );
  res.json(rows);
});

router.post("/", verifyFirebaseToken, async (req, res) => {
  const { name, code, courseId, level, sem } = req.body;

  await db.query(
    "INSERT INTO units (id, name, code, course_id, level,sem) VALUES (?, ?, ?, ?,?,?)",
    [randomUUID(), name, code, courseId, level, sem],
  );

  res.json({ success: true });
});

export default router;
