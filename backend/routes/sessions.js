import { randomUUID } from "crypto";
import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyFirebaseToken, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM class_sessions");
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
