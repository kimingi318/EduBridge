import { randomUUID } from "crypto";
import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/by-course/:course_id", verifyFirebaseToken, async (req, res) => {
  const { course_id } = req.params;
  const [rows] = await db.query(
    `SELECT cs.*, u.name AS unit_name, l.name AS lecturer_name
     FROM class_sessions cs
     LEFT JOIN units u ON cs.unit_id = u.id
     LEFT JOIN lecturers l ON cs.lecturer_id = l.id
     WHERE cs.course_id = ?`,
    [course_id],
  );
  res.json(rows);
});

// fetch sessions for a specific lecturer
router.get("/by-lecturer/:id", verifyFirebaseToken, async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query(
    `SELECT cs.*, u.name AS unit_name
     FROM class_sessions cs
     LEFT JOIN units u ON cs.unit_id = u.id
     LEFT JOIN profiles p ON cs.lecturer_id = p.id
     WHERE cs.lecturer_id = ?`,
    [id],
  );
  res.json(rows);
});

router.post("/", verifyFirebaseToken, async (req, res) => {
  const { unitId, lecturerId, courseId, venue, dayOfWeek, startTime, endTime } =
    req.body;

  await db.query("INSERT INTO class_sessions VALUES (?, ?, ?, ?, ?, ?, ?,?)", [
    randomUUID(),
    unitId,
    lecturerId,
    courseId,
    venue,
    dayOfWeek,
    startTime,
    endTime,
  ]);

  res.json({ success: true });
});

export default router;
