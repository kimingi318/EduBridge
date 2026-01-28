import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";
import { randomUUID } from "crypto";

const router = express.Router();

router.get("/", verifyFirebaseToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT d.*, f.name AS faculty FROM departments d JOIN faculties f ON d.faculty_id = f.id"
  );
  res.json(rows);
});

router.post("/", verifyFirebaseToken, async (req, res) => {
  const { name, facultyId } = req.body;

  await db.query(
    "INSERT INTO departments (id, name, faculty_id) VALUES (?, ?, ?)",
    [randomUUID(), name, facultyId]
  );

  res.json({ success: true });
});

export default router;
