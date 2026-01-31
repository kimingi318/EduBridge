import { randomUUID } from "crypto";
import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM faculties");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch faculties" });
  }
});

router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { name, abbv } = req.body;
    await db.query("INSERT INTO faculties (id, name, abbv) VALUES (?, ?, ?)", [
      randomUUID(),
      name,
      abbv,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to insert faculty" });
  }
});

export default router;
