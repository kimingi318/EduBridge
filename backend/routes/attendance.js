import { randomUUID } from "crypto";
import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:sessionId", verifyFirebaseToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM attendance WHERE session_id = ?",
    [req.params.sessionId],
  );
  res.json(rows);
});

router.post("/", verifyFirebaseToken, async (req, res) => {
  const { sessionId, unitId, userId, marked } = req.body;

  await db.query("INSERT INTO attendance VALUES (?, ?, ?, ?, ?)", [
    randomUUID(),
    sessionId,
    unitId,
    userId,
    marked,
  ]);

  res.json({ success: true });
});

export default router;
