import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";
import { randomUUID } from "crypto";

const router = express.Router();

router.get("/", verifyFirebaseToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT c.*, d.name AS department FROM courses c JOIN departments d ON c.dept_id = d.id"
  );
  res.json(rows);
});

router.post("/", verifyFirebaseToken, async (req, res) => {
  const { code, name, deptId } = req.body;

  await db.query(
    "INSERT INTO courses (id, code, name, dept_id) VALUES (?, ?, ?, ?)",
    [randomUUID(), code, name, deptId]
  );

  res.json({ success: true });
});

export default router;
