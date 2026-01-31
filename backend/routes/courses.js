import { randomUUID } from "crypto";
import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyFirebaseToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT c.*, d.name AS department FROM courses c JOIN departments d ON c.dept_id = d.id",
  );
  res.json(rows);
});

router.get("/by-department/:deptId", verifyFirebaseToken, async (req, res) => {
  const { deptId } = req.params;

  const [rows] = await db.query(
    "SELECT id, name FROM courses WHERE dept_id = ?",
    [deptId],
  );
  res.json(rows);
});

router.post("/", verifyFirebaseToken, async (req, res) => {
  const { programme, name, dept_Id } = req.body;

  await db.query(
    "INSERT INTO courses (id, programme, name, dept_id) VALUES (?, ?, ?, ?)",
    [randomUUID(), programme, name, dept_Id],
  );

  res.json({ success: true });
});

export default router;
